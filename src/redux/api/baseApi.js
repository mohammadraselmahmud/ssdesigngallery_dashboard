import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagtypes";
import { getFromSessionStorage } from "@/utils/sessionStorage";
import { logout, setUser } from "../features/authSlice";
import { getBackendBaseUrl } from "@/config";

const prepareAuthHeaders = (headers, state) => {
  const otpToken = getFromSessionStorage("signUpToken");
  const forgotPassToken = getFromSessionStorage("forgotPassToken");
  const changePassToken = getFromSessionStorage("changePassToken");
  const accessToken = getFromSessionStorage("prime-pilates-access-token");
  const token = state?.auth?.token;

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  } else if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  if (otpToken) {
    headers.set("token", otpToken);
  }

  if (forgotPassToken) {
    headers.set("token", forgotPassToken);
  }

  if (changePassToken) {
    headers.set("token", changePassToken);
  }

  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: getBackendBaseUrl(),
  credentials: "include",
  prepareHeaders: (headers, { getState }) =>
    prepareAuthHeaders(headers, getState()),
});

const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    try {
      const res = await fetch(`${getBackendBaseUrl()}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to refresh token:", res.statusText);
        api.dispatch(logout());
        return result;
      }

      const data = await res.json();
      if (data?.data?.accessToken) {
        const user = api.getState()?.auth?.user;

        api.dispatch(
          setUser({
            user,
            token: data.data.accessToken,
          }),
        );

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { tagTypesList } from "../tagtypes";
// import { getFromSessionStorage } from "@/utils/sessionStorage";
// import { logout } from "../features/authSlice";
// import { getBackendBaseUrl } from "@/config";

// const baseQuery = fetchBaseQuery({
//   // baseUrl: "http://167.172.237.31:5000/api/v1",
//   baseUrl: getBackendBaseUrl(),
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const otpToken = getFromSessionStorage("signUpToken");
//     const forgotPassToken = getFromSessionStorage("forgotPassToken");
//     const sellerAccessToken = getFromSessionStorage("prime-pilates-access-token");

//     const token = getState().auth.token;

//     if (token) {
//       headers.set("authorization", `Bearer ${token}`);
//     }

//     if (sellerAccessToken) {
//       headers.set("authorization", `Bearer ${sellerAccessToken}`);
//     }

//     if (otpToken) {
//       headers.set("token", otpToken);
//     }

//     if (forgotPassToken) {
//       headers.set("token", forgotPassToken);
//     }
//     return headers;
//   },
// });

// const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result?.error?.status === 401) {
//     const res = await fetch(
//       // `http://167.172.237.31:5000/api/v1/auth/refresh-token`,
//       `${getBackendBaseUrl()}/auth/refresh-token`,
//       {
//         method: "POST",
//         credentials: "include",
//       },
//     );

//     const data = await res.json();
//     if (data?.data?.accessToken) {
//       const user = api.getState().auth.user;

//       api.dispatch(
//         setUser({
//           user,
//           token: data.data.accessToken,
//         }),
//       );

//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout());
//     }
//   }

//   // Handle meta for pagination
//   // if (result?.data?.meta) {
//   //   result = {
//   //     data: result?.data?.data,
//   //     meta: result?.data?.meta,
//   //   };
//   // }
//   return result;
// };

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: baseQueryWithRefreshToken,
//   tagTypes: tagTypesList,
//   endpoints: () => ({}),
// });
