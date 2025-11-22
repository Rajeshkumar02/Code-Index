"use client";

import { useEffect } from "react";
import { useNavbar } from "@/context/navbar-context";

export default function ArticleTitleSetter({ title }: { title: string }) {
  const { setTitle } = useNavbar();

  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);

  return null;
}
