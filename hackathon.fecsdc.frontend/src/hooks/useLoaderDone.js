import { createContext, useContext, useState, createElement } from "react";

const LoaderContext = createContext({
  isLoaderDone: true,
  markLoaderDone: () => {},
});

const SESSION_STORAGE_KEY = "fec_hackathon_loader_seen";

export function LoaderProvider({ children }) {
  const [isLoaderDone, setIsLoaderDone] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem(SESSION_STORAGE_KEY));
    } catch {
      return false;
    }
  });

  const markLoaderDone = () => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch {
      // safe fallback if storage blocked
    }
    setIsLoaderDone(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("loaderDone"));
    }
  };

  return createElement(
    LoaderContext.Provider,
    { value: { isLoaderDone, markLoaderDone } },
    children
  );
}

export function useLoaderDone() {
  return useContext(LoaderContext);
}
