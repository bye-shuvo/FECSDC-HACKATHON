import { useEffect } from "react";
import { siteConfig } from "../data/siteConfig.js";

/**
 * Custom hook to dynamically manage document title and meta description.
 */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} | ${siteConfig.shortName}`
      : `${siteConfig.eventName} — ${siteConfig.tagline}`;
    
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }
  }, [title, description]);
}
