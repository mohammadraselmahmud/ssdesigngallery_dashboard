const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const { transform } = require("next/dist/build/swc");

async function loadModule(path, mocks = {}) {
  const { code } = await transform(readFileSync(path, "utf8"), {
    filename: path,
    jsc: {
      parser: { syntax: "ecmascript", jsx: true },
      transform: { react: { runtime: "automatic" } },
    },
    module: { type: "commonjs" },
  });
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return exports;
}

const settings = (value) => ({
  success: true,
  data: { isAiGenerationEnabled: value },
});

test("public Contents GET skips auth headers and refresh; PATCH retains bearer auth", async () => {
  let config;
  let apiConfig;
  let sessionReads = 0;
  let logoutCalls = 0;
  await loadModule("src/redux/api/baseApi.js", {
    "@reduxjs/toolkit/query/react": {
      createApi: (value) => {
        apiConfig = value;
        return value;
      },
      fetchBaseQuery: (value) => {
        config = value;
        return async () => ({ error: { status: 401 } });
      },
    },
    "../tagtypes": { tagTypesList: ["content"] },
    "@/utils/sessionStorage": {
      getFromSessionStorage: () => {
        sessionReads++;
        return null;
      },
    },
    "../features/authSlice": {
      logout: () => {
        logoutCalls++;
      },
      setUser: () => {},
    },
    "@/config": { getBackendBaseUrl: () => "https://example.test/api" },
  });
  const getState = () => ({ auth: { token: "test-access-token" } });
  const publicHeaders = config.prepareHeaders(new Headers(), {
    getState,
    endpoint: "getContents",
  });
  assert.equal(publicHeaders.has("authorization"), false);
  assert.equal(sessionReads, 0);
  const patchHeaders = config.prepareHeaders(new Headers(), {
    getState,
    endpoint: "updateContentsSettings",
  });
  assert.equal(patchHeaders.get("authorization"), "Bearer test-access-token");
  const result = await apiConfig.baseQuery(
    "/contents",
    { endpoint: "getContents", getState },
    {},
  );
  assert.equal(result.error.status, 401);
  assert.equal(logoutCalls, 0);
});

async function harness(role = "admin", initial = false) {
  let cursor = 0;
  const state = [];
  const requests = [];
  const notifications = [];
  const query = {
    data: settings(initial),
    isLoading: false,
    isFetching: false,
    isError: false,
  };
  let stored = initial;
  let patchError;
  let patchResponse;
  let refreshError;
  query.refetch = () => ({
    unwrap: async () => {
      if (refreshError) throw refreshError;
      query.data = settings(stored);
      return query.data;
    },
  });
  const access = await loadModule("src/utils/adminAccess.js");
  const component = await loadModule(
    "src/app/admin/(settings)/contents/_components/ContentsContainer.js",
    {
      react: {
        useState: (initialValue) => {
          const index = cursor++;
          if (!(index in state)) state[index] = initialValue;
          return [
            state[index],
            (value) => {
              state[index] = value;
            },
          ];
        },
      },
      "react-redux": { useSelector: () => ({ role }) },
      antd: { Alert: "Alert", Button: "Button", Switch: "Switch" },
      "@/components/shared/PageLoader/PageLoader": "PageLoader",
      "@/redux/features/authSlice": { selectUser: () => {} },
      "@/utils/adminAccess": access,
      "@/utils/customToast": {
        successToast: (message) => notifications.push(["success", message]),
        errorToast: (message) => notifications.push(["error", message]),
      },
      "@/redux/api/contentApi": {
        useGetContentsQuery: () => query,
        useUpdateContentsSettingsMutation: () => [
          (body) => ({
            unwrap: async () => {
              requests.push(body);
              if (patchError) throw patchError;
              stored = body.isAiGenerationEnabled;
              return patchResponse || settings(stored);
            },
          }),
          { isLoading: false },
        ],
      },
    },
  );
  function render() {
    cursor = 0;
    const nodes = [];
    function visit(node) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(visit);
      nodes.push(node);
      visit(node.props?.children);
    }
    visit(component.default());
    return {
      nodes,
      toggle: nodes.find((node) => node.type === "Switch"),
      save: nodes.find(
        (node) =>
          node.type === "Button" && node.props.children === "Save Changes",
      ),
    };
  }
  return {
    render,
    query,
    requests,
    notifications,
    state,
    failPatch: (error) => {
      patchError = error;
    },
    respondPatch: (response) => {
      patchResponse = response;
    },
    failRefresh: (error) => {
      refreshError = error;
    },
  };
}

test("enable and disable submit booleans and synchronize confirmed GET; remount uses saved value", async () => {
  const h = await harness();
  assert.equal(h.render().toggle.props.checked, false);
  assert.equal(h.render().save.props.disabled, true);
  for (const value of [true, false]) {
    h.render().toggle.props.onChange(value);
    assert.equal(h.render().save.props.disabled, false);
    const saving = h.render().save.props.onClick();
    assert.equal(h.render().save.props.disabled, true);
    await saving;
    assert.equal(h.requests.at(-1).isAiGenerationEnabled, value);
    assert.deepEqual(Object.keys(h.requests.at(-1)), ["isAiGenerationEnabled"]);
    assert.equal(h.render().toggle.props.checked, value);
    assert.equal(h.render().save.props.disabled, true);
    const remounted = await harness(
      "admin",
      h.query.data.data.isAiGenerationEnabled,
    );
    assert.equal(remounted.render().toggle.props.checked, value);
  }
  assert.equal(
    h.notifications.filter(([type]) => type === "success").length,
    2,
  );
});

test("failed PATCH preserves selection and displays server error; retry succeeds", async () => {
  const h = await harness();
  h.render().toggle.props.onChange(true);
  h.failPatch({ data: { message: "Permission denied" } });
  await h.render().save.props.onClick();
  assert.equal(h.render().toggle.props.checked, true);
  assert.equal(h.render().save.props.disabled, false);
  assert.ok(
    h.render().nodes.some((n) => n.props?.message === "Permission denied"),
  );
  h.failPatch(null);
  await h.render().save.props.onClick();
  assert.equal(h.render().save.props.disabled, true);
});

test("loading, failed GET and malformed GET never show a disabled-setting fallback", async () => {
  const h = await harness();
  h.query.isLoading = true;
  assert.equal(h.render().toggle, undefined);
  h.query.isLoading = false;
  h.query.isError = true;
  assert.equal(h.render().toggle, undefined);
  assert.equal(h.render().save.props.disabled, true);
  const alert = h
    .render()
    .nodes.find((n) => n.props?.message === "Unable to load Contents");
  assert.equal(alert.props.action.props.onClick, h.query.refetch);
  h.query.isError = false;
  h.query.data = { success: true, data: {} };
  assert.equal(h.render().toggle, undefined);
  assert.equal(h.render().save.props.disabled, true);
});

test("only admin and super_admin can edit or submit", async () => {
  for (const role of ["admin", "super_admin", "sub_admin", "user", undefined]) {
    const h = await harness(role === undefined ? null : role);
    const allowed = ["admin", "super_admin"].includes(role);
    assert.equal(h.render().toggle.props.disabled, !allowed);
    h.render().toggle.props.onChange(true);
    assert.equal(h.render().save.props.disabled, !allowed);
    await h.render().save.props.onClick();
    assert.equal(h.requests.length, allowed ? 1 : 0);
  }
});

test("legacy PATCH response and failed verification cannot report success", async () => {
  for (const mode of ["legacy", "refresh", "mismatch"]) {
    const h = await harness();
    h.render().toggle.props.onChange(true);
    if (mode === "legacy")
      h.respondPatch({ success: true, data: { turnOffAiOption: false } });
    else if (mode === "refresh")
      h.failRefresh({ data: { message: "Network unavailable" } });
    else h.respondPatch(settings(false));
    await h.render().save.props.onClick();
    assert.equal(h.render().toggle.props.checked, true);
    assert.equal(
      h.notifications.some(([type]) => type === "success"),
      false,
    );
    assert.equal(h.notifications.at(-1)[0], "error");
  }
});

test("API uses public GET and exact PATCH payload; failed PATCH does not invalidate", async () => {
  let endpoints;
  await loadModule("src/redux/api/contentApi.js", {
    "../tagtypes": { tagTypes: { content: "content" } },
    "./baseApi": {
      baseApi: {
        injectEndpoints: (config) => {
          endpoints = config.endpoints({ query: (x) => x, mutation: (x) => x });
          return {};
        },
      },
    },
  });
  const get = endpoints.getContents.query();
  assert.equal(get.url, "/contents");
  assert.equal(get.credentials, "omit");
  for (const value of [true, false]) {
    const patch = endpoints.updateContentsSettings.query({
      isAiGenerationEnabled: value,
      extra: "discard",
    });
    assert.equal(patch.method, "PATCH");
    assert.equal(patch.url, "/contents");
    assert.equal(
      JSON.stringify(patch.body),
      JSON.stringify({ isAiGenerationEnabled: value }),
    );
  }
  assert.equal(
    endpoints.updateContentsSettings.invalidatesTags(undefined, {}).length,
    0,
  );
  assert.equal(
    endpoints.updateContentsSettings.invalidatesTags(
      settings(true),
      undefined,
    )[0],
    "content",
  );
});
