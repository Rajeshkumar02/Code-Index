import "./global.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import {
  SITE_CONFIG,
  SOCIAL_CONFIG,
  VIEWPORT_CONFIG,
  ROBOTS_CONFIG,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo-constants";
import { Provider } from "@/provider/root-provider";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
});

// ============ METADATA ============
export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Comprehensive Tech Blog | Web, Backend, Mobile, System Design & More`,
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.name,
  robots: ROBOTS_CONFIG,
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - Web Development Blog`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}${SITE_CONFIG.image}`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: SOCIAL_CONFIG.twitter.card,
    creator: SOCIAL_CONFIG.twitter.handle,
    title: `${SITE_CONFIG.name} - Comprehensive Tech Blog`,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}${SITE_CONFIG.image}`],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    types: {
      "application/rss+xml": [
        {
          title: SITE_CONFIG.name,
          url: `${SITE_CONFIG.url}/index.xml`,
        },
      ],
    },
  },
};

// ============ VIEWPORT ============
export const viewport: Viewport = {
  width: VIEWPORT_CONFIG.width,
  initialScale: VIEWPORT_CONFIG.initialScale,
  maximumScale: VIEWPORT_CONFIG.maximumScale,
};

export default function Layout({ children }: LayoutProps<"/">) {
  // Organization and Website structured data
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
      <GoogleAnalytics gaId={"G-QXHTTS8ZD5"} />
    </html>
  );
}
