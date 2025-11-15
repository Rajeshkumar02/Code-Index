import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { SITE_CONFIG } from "./seo-constants";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: SITE_CONFIG.name,
    },
  };
}
