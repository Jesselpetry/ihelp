import { Navbar } from "@/components/navbar";
import { RepoEditor } from "@/components/github/repo-editor";

export const dynamic = "force-dynamic";

export default function RepoPage() {
  return (
    <div className="pscp-theme min-h-screen w-full">
      <Navbar />
      <RepoEditor />
    </div>
  );
}
