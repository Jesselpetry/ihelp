import type { ReactNode } from "react";

export default function MakeLayout({ children }: { children: ReactNode }) {
  return <div className="pscp-theme min-h-screen w-full">{children}</div>;
}
