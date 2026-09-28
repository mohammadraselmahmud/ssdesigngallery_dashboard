"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Switch } from "antd";
import {
  Check,
  Info,
  Layers3,
  LockKeyhole,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import PageLoader from "@/components/shared/PageLoader/PageLoader";
import {
  useGetContentsQuery,
  useToggleAiGenerationFeaturesMutation,
} from "@/redux/api/contentApi";
import { selectUser } from "@/redux/features/authSlice";
import { canManageContents } from "@/utils/adminAccess";
import { errorToast, successToast } from "@/utils/customToast";

const hasSettings = (response) =>
  response?.success === true &&
  typeof response?.data?.isAiGenerationEnabled === "boolean";

export default function ContentsContainer() {
  const canEdit = canManageContents(useSelector(selectUser));
  const { data, error, isLoading, isFetching, isError, refetch } =
    useGetContentsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [toggleAiGeneration, { isLoading: isUpdating }] =
    useToggleAiGenerationFeaturesMutation();
  const [selection, setSelection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const validSettings = hasSettings(data);
  const selected = selection ?? data?.data?.isAiGenerationEnabled;
  const busy = isLoading || isFetching || isUpdating || isSaving;
  const hasChanges =
    validSettings && selected !== data.data.isAiGenerationEnabled;
  const canSave =
    canEdit &&
    validSettings &&
    !isError &&
    !busy &&
    selected !== data.data.isAiGenerationEnabled;

    

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setSaveError("");
    try {
      const response = await toggleAiGeneration().unwrap();
      if (!hasSettings(response)) {
        throw new Error(
          response?.success === false
            ? response.message || "Unable to save Contents."
            : "The server returned an invalid Contents response. The saved setting could not be confirmed.",
        );
      }
      const refreshed = await refetch().unwrap();
      console.log("🚀 ~ handleSave ~ refreshed:", refreshed);

      successToast(response.message || "Contents updated successfully.");
    } catch (err) {
      console.log("🚀 ~ handleSave ~ err:", err);

      const message =
        err?.data?.message ||
        err?.message ||
        "Unable to save or confirm Contents. Please retry.";
      setSaveError(message);
      errorToast(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <section className="mx-auto max-w-6xl space-y-6 text-white">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Content management
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Contents
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
            Manage your content experience and control access to AI generation.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300">
          {canEdit ? (
            <ShieldCheck size={15} aria-hidden="true" />
          ) : (
            <LockKeyhole size={15} aria-hidden="true" />
          )}
          {canEdit ? "Admin controls" : "View only"}
        </span>
      </header>
      {(isError || !validSettings) && (
        <Alert
          type="error"
          showIcon
          message="Unable to load Contents"
          description={
            error?.data?.message ||
            "The settings could not be loaded. Please retry."
          }
          action={
            <Button onClick={refetch} loading={isFetching}>
              Retry
            </Button>
          }
        />
      )}
      {!canEdit && (
        <Alert
          type="info"
          showIcon
          message="Only admins and super admins can edit Contents."
        />
      )}
      {validSettings && !isError && (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#27231f] shadow-xl shadow-black/10">
            <div className="from-primary/30 border-b border-white/10 bg-gradient-to-br to-transparent p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <span className="bg-primary/30 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-[#efdbc8]">
                  <Sparkles size={24} aria-hidden="true" />
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${data.data.isAiGenerationEnabled ? "bg-emerald-400/10 text-emerald-300" : "bg-white/10 text-stone-300"}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${data.data.isAiGenerationEnabled ? "bg-emerald-300" : "bg-stone-400"}`}
                  />
                  {data.data.isAiGenerationEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#cfb59e]">
                AI features
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                A little more creative possibility.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-stone-300">
                Choose whether AI generation is available to your users. Manage
                the feature from one place.
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <label
                    htmlFor="ai-generation"
                    className="cursor-pointer text-base font-semibold"
                  >
                    Enable AI Generation
                  </label>
                  <p
                    id="ai-generation-description"
                    className="mt-2 max-w-md text-sm leading-6 text-stone-400"
                  >
                    Allow users to create content using AI generation.
                  </p>
                </div>
                <Switch
                  id="ai-generation"
                  aria-describedby="ai-generation-description"
                  checked={selected}
                  disabled={!canEdit || busy}
                  onChange={(value) => {
                    setSelection(value);
                    setSaveError("");
                  }}
                  className="shrink-0"
                  style={{ backgroundColor: selected ? "#907a69" : "#57534e" }}
                />
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-6 text-stone-300">
                <Info
                  size={17}
                  className="mt-1 shrink-0 text-[#cfb59e]"
                  aria-hidden="true"
                />
                <p>
                  {selected
                    ? "AI generation will be available to users when this setting is saved."
                    : "AI generation will be unavailable to users when this setting is saved."}
                </p>
              </div>
            </div>
          </div>
          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Layers3
              size={21}
              className="mb-4 text-[#cfb59e]"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold">About this setting</h2>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              This control manages AI generation availability across the
              platform.
            </p>
            <div className="my-5 h-px bg-white/10" />
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#cfb59e]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-stone-200">
                  Managed by admins
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-400">
                  Only admins and super admins can change this setting.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
      {saveError && <Alert type="error" showIcon message={saveError} />}
      <footer className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#27231f] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-stone-300"
        >
          {hasChanges ? (
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-300" />
          ) : (
            <Check
              size={16}
              className="shrink-0 text-stone-400"
              aria-hidden="true"
            />
          )}
          {isSaving || isUpdating
            ? "Saving changes..."
            : isFetching
              ? "Refreshing settings..."
              : isError || !validSettings
                ? "Settings unavailable"
                : hasChanges
                  ? "You have unsaved changes"
                  : "No pending changes"}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {canEdit && hasChanges && (
            <Button
              size="large"
              disabled={busy}
              onClick={() => {
                setSelection(null);
                setSaveError("");
              }}
              className="!rounded-xl !border-white/20 !bg-transparent !text-stone-300"
            >
              Discard
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            className="w-full rounded-xl sm:w-auto"
            loading={isSaving || isUpdating}
            disabled={!canSave}
            onClick={handleSave}
            icon={<Save size={16} aria-hidden="true" />}
          >
            Save Changes
          </Button>
        </div>
      </footer>
    </section>
  );
}
