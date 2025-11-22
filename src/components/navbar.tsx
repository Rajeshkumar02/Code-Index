"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Github, Share2 } from "lucide-react";
import SearchDialog from "./search-dialog";
import { SITE_CONFIG, SOCIAL_CONFIG } from "@/lib/seo-constants";
import { useNavbar } from "@/context/navbar-context";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const { title } = useNavbar();
  const [isScrolledPastHeader, setIsScrolledPastHeader] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        // Check if scrolled (for shadow)
        setIsScrolled(currentScrollY > 10);

        // Check if scrolled past initial header (approx 200px)
        setIsScrolledPastHeader(currentScrollY > 200);

        // Calculate reading progress
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight) {
          setReadingProgress(
            Number((currentScrollY / scrollHeight).toFixed(2)) * 100
          );
        }
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const navLinks = [
    { name: "Blog", href: "/" },
    { name: "Series", href: "/series" },
  ];

  // Determine if we should show the Article Title mode
  const showArticleMode = title && isScrolledPastHeader;

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const shareData = {
      title: title || SITE_CONFIG.name,
      text: "Check out this article!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        const copyToClipboard = async () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(window.location.href);
            return true;
          } else {
            // Fallback for insecure contexts or older browsers
            const textArea = document.createElement("textarea");
            textArea.value = window.location.href;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand("copy");
              document.body.removeChild(textArea);
              return true;
            } catch (err) {
              console.error("Fallback: Oops, unable to copy", err);
              document.body.removeChild(textArea);
              return false;
            }
          }
        };

        const success = await copyToClipboard();
        if (success) {
          const isSecure = window.isSecureContext;
          alert(
            isSecure
              ? "Link copied to clipboard!"
              : "Native sharing requires HTTPS (Secure Context). Link copied to clipboard instead."
          );
        } else {
          alert("Failed to copy link.");
        }
      }
    } catch (err) {
      console.error("Error sharing:", err);
      // Don't alert if the user cancelled the share
      if (err instanceof Error && err.name !== "AbortError") {
        alert("Error sharing: " + err.message);
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40">
        {/* Main Navbar Container */}
        <header
          className={`w-full bg-fd-background border-b border-fd-border transition-all duration-300 py-1.5 ${
            isScrolled ? "shadow-md" : ""
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10">
              {/* Left Side - Logo & Dynamic Text */}
              <div className="flex items-center gap-3">
                {/* Text Slider Container */}
                <div className="relative h-6 w-[200px] sm:w-[300px] overflow-hidden">
                  {/* Site Name */}
                  <div
                    className={`absolute inset-0 flex items-center transition-transform duration-500 ease-in-out ${
                      showArticleMode ? "-translate-y-full" : "translate-y-0"
                    }`}
                  >
                    <Link href="/" className="font-bold text-lg tracking-tight hover:text-fd-primary transition-colors">
                      {SITE_CONFIG.name}
                    </Link>
                  </div>

                  {/* Article Title */}
                  <div
                    className={`absolute inset-0 flex items-center transition-transform duration-500 ease-in-out ${
                      showArticleMode ? "translate-y-0" : "translate-y-full"
                    }`}
                  >
                    <span className="font-semibold text-fd-foreground truncate w-full">
                      {title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Navigation (Hidden in Article Mode) */}
              <nav
                className={`hidden md:flex items-center gap-6 transition-opacity duration-300 ${
                  showArticleMode ? "opacity-0 invisible" : "opacity-100"
                }`}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-fd-muted-foreground hover:text-fd-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {showArticleMode ? (
                  // Article Actions
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                      onClick={handleShare}
                      className="p-2 text-fd-muted-foreground hover:text-fd-primary transition-colors cursor-pointer"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  // Standard Actions
                  <>
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent rounded-full transition-all cursor-pointer"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    
                    <ThemeToggle />

                    <a
                      href={SOCIAL_CONFIG.github.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:block p-2 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent rounded-full transition-all cursor-pointer"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Reading Progress Bar (Integrated) */}
          {showArticleMode && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-muted">
              <div
                className="h-full bg-fd-primary transition-all duration-150 ease-out"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          )}
        </header>
      </div>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
