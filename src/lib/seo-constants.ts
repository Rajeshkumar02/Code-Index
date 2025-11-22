/**
 * SEO Configuration Constants
 * Centralized place for all SEO-related settings
 * A comprehensive tech blog covering multiple topics
 */

// ============ SITE METADATA ============
export const SITE_CONFIG = {
  name: "Code Index",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://codeindex.is-a.dev",
  description:
    "A comprehensive tech blog covering web development, backend development, mobile development, system design, data structures & algorithms, cloud computing, DevOps, and more. Learn from in-depth tutorials and best practices.",
  keywords: [
    "tech blog",
    "web development",
    "backend development",
    "frontend development",
    "mobile development",
    "system design",
    "data structures",
    "algorithms",
    "dsa",
    "cloud computing",
    "devops",
    "database design",
    "microservices",
    "next.js",
    "react",
    "javascript",
    "typescript",
    "python",
    "java",
    "golang",
    "nodejs",
    "programming",
    "software engineering",
    "coding tutorials",
  ],
  author: "Rajeshkumar S",
  creator: "@yourhandle",
  image: "/og-image.png", // Default OG image
  locale: "en_US",
  type: "website",
  email: "dev.rajeshkumars@gmail.com"
};

// ============ BLOG CATEGORIES ============
export const BLOG_CATEGORIES = [
  {
    id: "web-development",
    name: "Web Development",
    description: "Frontend frameworks, libraries, and best practices",
    icon: "globe",
  },
  {
    id: "backend-development",
    name: "Backend Development",
    description: "Server-side programming, APIs, and server architecture",
    icon: "server",
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    description: "iOS, Android, React Native, and cross-platform development",
    icon: "smartphone",
  },
  {
    id: "system-design",
    name: "System Design",
    description: "Architecture, scalability, and large-scale system design",
    icon: "layers",
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "DSA concepts, problem-solving, and coding interviews",
    icon: "database",
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    description: "AWS, GCP, Azure, Docker, Kubernetes, and deployment",
    icon: "cloud",
  },
  {
    id: "database",
    name: "Databases",
    description: "SQL, NoSQL, database design, and optimization",
    icon: "table",
  },
  {
    id: "tools-workflow",
    name: "Tools & Workflow",
    description: "Development tools, git, CI/CD, and productivity tips",
    icon: "wrench",
  },
];

// ============ POPULAR TAGS ============
export const POPULAR_TAGS = [
  // Frontend
  "React",
  "Next.js",
  "Vue.js",
  "TypeScript",
  "Tailwind CSS",
  "JavaScript",
  
  // Backend
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Rust",
  "Express",
  "FastAPI",
  "Spring Boot",
  
  // Mobile
  "React Native",
  "Flutter",
  "iOS",
  "Android",
  "Kotlin",
  "Swift",
  
  // System Design
  "Microservices",
  "Distributed Systems",
  "Scalability",
  "High Availability",
  "Load Balancing",
  
  // Databases
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "MySQL",
  "DynamoDB",
  "Elasticsearch",
  
  // DevOps & Cloud
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Azure",
  "CI/CD",
  "Jenkins",
  "GitHub Actions",
  
  // Other
  "DSA",
  "Algorithms",
  "Git",
  "REST API",
  "GraphQL",
  "WebSockets",
  "Performance",
  "Security",
];

// ============ SOCIAL MEDIA ============
export const SOCIAL_CONFIG = {
  twitter: {
    handle: "@yourhandle",
    card: "summary_large_image" as const,
  },
  facebook: {
    appId: "", // Add your Facebook App ID if needed
  },
  github: {
    url: "https://github.com/Rajeshkumar02", // Add your GitHub profile
  },
};

// ============ VIEWPORT ============
export const VIEWPORT_CONFIG = {
  width: "device-width" as const,
  initialScale: 1,
  maximumScale: 5,
};

// ============ ROBOTS ============
export const ROBOTS_CONFIG = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large" as const,
    "max-video-preview": -1,
  },
};

// ============ OG IMAGE DEFAULTS ============
export const OG_IMAGE_CONFIG = {
  width: 1200,
  height: 630,
  type: "image/png" as const,
};

// ============ BLOG SPECIFIC ============
export const BLOG_CONFIG = {
  postsPerPage: 12,
  defaultReadingTime: "5 min read",
  changeFrequency: "weekly" as const,
  priority: 0.8,
};

// ============ SEO HELPERS ============
export function generateOgImageUrl(slug: string[]): string {
  return `/og/${slug.join("/")}/image.png`;
}

export function generateBlogUrl(slug: string[]): string {
  return `${SITE_CONFIG?.url}/${slug.join("/")}`;
}

export function generateAbsoluteUrl(path: string): string {
  return `${SITE_CONFIG?.url}${path}`;
}

// ============ STRUCTURED DATA HELPERS ============
export function generateBlogPostingSchema(postData: {
  title: string;
  description: string;
  author: string;
  date: string | Date;
  slug: string[];
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postData?.title,
    description: postData?.description,
    author: {
      "@type": "Person",
      name: postData?.author,
    },
    datePublished: new Date(postData?.date).toISOString(),
    dateModified: new Date(postData?.date).toISOString(),
    image:
      postData?.image ||
      `${SITE_CONFIG?.url}${generateOgImageUrl(postData?.slug)}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": generateBlogUrl(postData?.slug),
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG?.name,
    url: SITE_CONFIG?.url,
    description: SITE_CONFIG?.description,
    founder: SITE_CONFIG?.author,
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG?.name,
    url: SITE_CONFIG?.url,
    description: SITE_CONFIG?.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG?.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
