import { SITE_CONFIG } from "@/lib/seo-constants";

export const metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions for " + SITE_CONFIG.name,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-fd-foreground">Terms and Conditions</h1>
      
      <div className="prose dark:prose-invert max-w-none text-fd-muted-foreground text-sm">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <p className="mb-6">
          Please read these terms and conditions carefully before using Our Service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Interpretation and Definitions</h2>
        <h3 className="text-lg font-medium mt-4 mb-2 text-fd-foreground">Interpretation</h3>
        <p className="mb-4">
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>

        <h3 className="text-lg font-medium mt-4 mb-2 text-fd-foreground">Definitions</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to {SITE_CONFIG.name}.</li>
          <li><strong>Service</strong> refers to the Website.</li>
          <li><strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
          <li><strong>Website</strong> refers to {SITE_CONFIG.name}, accessible from {process.env.NEXT_PUBLIC_SITE_URL || "our website"}</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Acknowledgment</h2>
        <p className="mb-4">
          These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
        </p>
        <p className="mb-4">
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Links to Other Websites</h2>
        <p className="mb-4">
          Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
        </p>
        <p className="mb-4">
          The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Termination</h2>
        <p className="mb-4">
          We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Governing Law</h2>
        <p className="mb-4">
          The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Changes to These Terms and Conditions</h2>
        <p className="mb-4">
          We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-fd-foreground">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms and Conditions, You can contact us:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>By visiting this page on our website: <a href="/contact" className="text-fd-primary hover:underline">Contact</a></li>
        </ul>
      </div>
    </div>
  );
}
