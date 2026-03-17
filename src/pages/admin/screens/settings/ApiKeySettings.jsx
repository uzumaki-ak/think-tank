import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAiApiKey,
  setAiApiKey,
  clearAiApiKey,
} from "../../../../utils/aiKeyStorage";

const ApiKeySettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedKey = getAiApiKey();
    setApiKey(storedKey);
    setIsSaved(Boolean(storedKey));
  }, []);

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      toast.error("Please enter a valid API key");
      return;
    }
    setAiApiKey(trimmed);
    setIsSaved(true);
    toast.success("API key saved locally");
    window.dispatchEvent(new Event("ai-key-updated"));
  };

  const handleClear = () => {
    clearAiApiKey();
    setApiKey("");
    setIsSaved(false);
    toast.success("API key removed");
    window.dispatchEvent(new Event("ai-key-updated"));
  };

  return (
    <section className="container mx-auto max-w-3xl px-3 py-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#1f1f1f] dark:bg-[#0d0d0d]">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-dark-hard">AI Settings</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Store your Gemini API key locally in this browser. It is not shared
            or synced to the server.
          </p>
        </div>

        <div className="mt-6">
          <label htmlFor="ai-api-key" className="block text-sm font-semibold text-dark-hard">
            Gemini API Key
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="ai-api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-dark-hard outline-none transition focus:border-slate-500 dark:border-[#2a2a2a] dark:bg-[#111111] dark:text-slate-100"
            />
            <button
              type="button"
              onClick={() => setShowKey((prev) => !prev)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-dark-hard transition hover:border-slate-500 dark:border-[#2a2a2a] dark:text-slate-100"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Tip: You can rotate or remove the key anytime.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Save Key
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-dark-hard transition hover:border-slate-500 dark:border-[#2a2a2a] dark:text-slate-100"
          >
            Clear Key
          </button>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            Status: {isSaved ? "Saved" : "Not set"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiKeySettings;
