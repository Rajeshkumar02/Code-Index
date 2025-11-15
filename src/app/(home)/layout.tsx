import { BlogLayout } from "@/layout/BlogLayout";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return <BlogLayout {...baseOptions()}>{children}</BlogLayout>;
}
