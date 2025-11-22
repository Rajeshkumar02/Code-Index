import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { NavbarProvider } from "@/context/navbar-context";
import type { ReactNode } from "react";

const BlogLayout = ({ children }: { children: ReactNode }) => {
  return (
    <NavbarProvider>
      <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main className="flex-1 pt-14">
          {children}
        </main>
        <Footer />
      </div>
    </NavbarProvider>
  );
};

export { BlogLayout };
