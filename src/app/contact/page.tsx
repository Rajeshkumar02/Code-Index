import { SITE_CONFIG } from "@/lib/seo-constants";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with " + SITE_CONFIG.name,
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl overflow-hidden">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-fd-foreground tracking-tight">
          Let's Start a Conversation
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Whether you have a question about a tutorial, a bug to report, or just want to say hello, 
          I'm always open to discussing new ideas and opportunities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Context & Info */}
        <div className="space-y-6">
          <div className="bg-fd-card border border-fd-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-fd-foreground">Why Reach Out?</h2>
            <ul className="space-y-3 text-fd-muted-foreground text-sm">
              <li className="flex items-start gap-3">
                <span className="bg-fd-primary/10 p-1 rounded-full mt-0.5">
                  <div className="w-1.5 h-1.5 bg-fd-primary rounded-full" />
                </span>
                <span><strong>Collaboration:</strong> Interested in working together on a project?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-fd-primary/10 p-1 rounded-full mt-0.5">
                  <div className="w-1.5 h-1.5 bg-fd-primary rounded-full" />
                </span>
                <span><strong>Feedback:</strong> Have suggestions to improve the blog?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-fd-primary/10 p-1 rounded-full mt-0.5">
                  <div className="w-1.5 h-1.5 bg-fd-primary rounded-full" />
                </span>
                <span><strong>Tech Talk:</strong> Just want to geek out about the latest frameworks?</span>
              </li>
            </ul>
          </div>

          <div className="bg-fd-secondary/50 rounded-2xl p-5">
            <h3 className="font-semibold text-fd-foreground mb-1 text-sm">Response Time</h3>
            <p className="text-fd-muted-foreground text-xs">
              I typically respond within <strong>24-48 hours</strong>. If you don't hear back, please feel free to follow up!
            </p>
          </div>
        </div>

        {/* Right Column: Action */}
        <div className="flex flex-col items-center justify-center bg-fd-card border border-fd-border rounded-2xl p-6 shadow-sm h-full text-center">
          <div className="p-3 bg-fd-primary/10 rounded-full mb-4 animate-pulse">
            <Mail className="w-6 h-6 text-fd-primary" />
          </div>
          
          <h2 className="text-xl font-bold text-fd-foreground mb-2">Drop me an email</h2>
          <p className="text-fd-muted-foreground mb-6 max-w-xs mx-auto text-sm">
            The best way to reach me is directly via email.
          </p>

          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 max-w-full break-all"
          >
            {SITE_CONFIG.email}
          </a>
          
          <p className="mt-4 text-[10px] text-fd-muted-foreground">
            Click to open your mail client
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 border-t border-fd-border pt-10">
        <h2 className="text-2xl font-bold mb-8 text-center text-fd-foreground">Frequently Asked Questions</h2>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-fd-card p-5 rounded-xl border border-fd-border/50">
            <h3 className="text-base font-semibold text-fd-foreground mb-2">Can I contribute guest posts?</h3>
            <p className="text-fd-muted-foreground leading-relaxed text-sm">
              Absolutely! I love featuring community content. Send me your topic ideas and a brief outline.
            </p>
          </div>
          
          <div className="bg-fd-card p-5 rounded-xl border border-fd-border/50">
            <h3 className="text-base font-semibold text-fd-foreground mb-2">Do you offer mentorship?</h3>
            <p className="text-fd-muted-foreground leading-relaxed text-sm">
              I try to help where I can. Drop me an email with your specific questions or what you're looking to learn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
