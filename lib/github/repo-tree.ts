// Shared folder-tree helpers for repo file listings (used by the /repo editor
// and the wizard's "will be pushed" preview).

import type { RepoFile } from "./github";

export function basename(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

export function dirname(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}

export interface TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  size?: number;
  children: TreeNode[];
}

// Build a nested folder tree from flat file paths.
export function buildTree(files: RepoFile[]): TreeNode[] {
  const root: TreeNode = { name: "", path: "", isFile: false, children: [] };
  for (const f of files) {
    const parts = f.path.split("/");
    let cur = root;
    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;
      const path = parts.slice(0, i + 1).join("/");
      let child = cur.children.find((c) => c.name === part && c.isFile === isFile);
      if (!child) {
        child = { name: part, path, isFile, size: isFile ? f.size : undefined, children: [] };
        cur.children.push(child);
      }
      cur = child;
    });
  }
  const sortRec = (n: TreeNode) => {
    n.children.sort((a, b) =>
      a.isFile !== b.isFile ? (a.isFile ? 1 : -1) : a.name.localeCompare(b.name),
    );
    n.children.forEach(sortRec);
  };
  sortRec(root);
  return root.children;
}
