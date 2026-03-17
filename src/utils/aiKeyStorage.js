const AI_KEY_STORAGE_KEY = "ai_api_key";

export const getAiApiKey = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AI_KEY_STORAGE_KEY) || "";
};

export const setAiApiKey = (key) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(AI_KEY_STORAGE_KEY, key);
};

export const clearAiApiKey = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AI_KEY_STORAGE_KEY);
};
