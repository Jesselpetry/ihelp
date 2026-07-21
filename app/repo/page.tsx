import { Navbar } from "@/components/navbar";
import { RepoEditor } from "@/components/github/repo-editor";

export const dynamic = "force-dynamic";

export default function RepoPage() {
  return (
    <>
      <Navbar />
      <RepoEditor />
    </>
  );
}
