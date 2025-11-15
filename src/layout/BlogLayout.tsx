import { HomeLayout, HomeLayoutProps } from "fumadocs-ui/layouts/home";

const BlogLayout = ({ children, ...props }: HomeLayoutProps) => {
  return (
    <>
      <HomeLayout {...props}>{children}</HomeLayout>
    </>
  );
};

export { BlogLayout };
