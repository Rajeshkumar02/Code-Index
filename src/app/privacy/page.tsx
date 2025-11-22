import { SITE_CONFIG } from "@/lib/seo-constants";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for " + SITE_CONFIG.name,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-fd-foreground">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none text-fd-muted-foreground text-sm">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <p className="mb-6">
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Interpretation and Definitions</h2>
        <h3 className="text-lg font-medium mt-4 mb-2 text-fd-foreground">Interpretation</h3>
        <p className="mb-4">
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>

        <h3 className="text-lg font-medium mt-4 mb-2 text-fd-foreground">Definitions</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
          <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to {SITE_CONFIG.name}.</li>
          <li><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
          <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
          <li><strong>Service</strong> refers to the Website.</li>
          <li><strong>Website</strong> refers to {SITE_CONFIG.name}, accessible from {process.env.NEXT_PUBLIC_SITE_URL || "our website"}</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Collecting and Using Your Personal Data</h2>
        <h3 className="text-lg font-medium mt-4 mb-2 text-fd-foreground">Types of Data Collected</h3>
        
        <h4 className="text-base font-medium mt-4 mb-2 text-fd-foreground">Personal Data</h4>
        <p className="mb-4">
          While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Usage Data</li>
        </ul>

        <h4 className="text-base font-medium mt-4 mb-2 text-fd-foreground">Usage Data</h4>
        <p className="mb-4">
          Usage Data is collected automatically when using the Service.
        </p>
        <p className="mb-4">
          Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Tracking Technologies and Cookies</h2>
        <p className="mb-4">
          We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, You can contact us:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>By visiting this page on our website: <a href="/contact" className="text-fd-primary hover:underline">Contact</a></li>
        </ul>
      </div>
    </div>
  );
}
