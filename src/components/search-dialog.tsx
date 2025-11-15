"use client";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import Link from "next/link";

interface Item {
  id: string;
  url: string;
  content: string;
  contentWithHighlights?: Array<{
    type: "text" | "heading";
    content: string;
    styles?: { highlight?: boolean };
  }>;
  breadcrumbs?: string[];
  type?: string; // e.g., "page", "heading"
}

interface DialogListProps {
  items: Item[] | null | undefined;
  props?: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setSearch: (value: string) => void;
  };
}

const BlogSearchDialogList = ({ items, props }: DialogListProps) => {
  if (!items || items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-fd-muted-foreground">
        No results found
      </p>
    );
  }

  // Filter only blog pages
  const blogItems = items?.filter((item) => item?.type === "page");

  return (
    <div className="flex flex-col divide-y overflow-hidden my-2 px-2">
      {blogItems?.map((item) => (
        <Link
          key={item?.id}
          href={item?.url}
          onClick={() => {
            props?.onOpenChange(!props?.open);
            props?.setSearch("");
          }}
          className="relative select-none px-2.5 py-2 text-start text-sm rounded-lg hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <div className="flex justify-between items-center mb-1">
            <p className="min-w-0 truncate font-medium">
              {item?.contentWithHighlights
                ? item?.contentWithHighlights?.map((part, idx) => (
                    <span
                      key={idx}
                      className={
                        part?.styles?.highlight
                          ? "text-fd-primary underline"
                          : ""
                      }
                    >
                      {part?.content}
                    </span>
                  ))
                : item?.content}
            </p>
          </div>

          {/* Optional description preview */}
          {item?.type === "page" && (
            <p className="text-xs  mt-1 line-clamp-2 min-w-0 truncate ps-4 text-fd-popover-foreground/80">
              {item?.content}
            </p>
          )}
        </Link>
      ))}

      {blogItems.length === 0 && (
        <p className="py-12 text-center text-sm text-fd-muted-foreground">
          No blog results found
        </p>
      )}
    </div>
  );
};

export default function BlogSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    locale,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput placeholder="Search blog posts..." />
          <SearchDialogClose />
        </SearchDialogHeader>

        <BlogSearchDialogList
          items={query.data !== "empty" ? query.data : null}
          props={{ ...props, setSearch }}
        />
      </SearchDialogContent>
    </SearchDialog>
  );
}
