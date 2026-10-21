"use client";

import { FileActions } from "@/components/media/file-actions";
import type { SubjectAsset } from "@/lib/library/subject-library-ui";

/**
 * The row under every gallery card. The primary action opens the in-app modal
 * rather than a new tab — leaving the page loses the filters and the scroll
 * position the student just set up. Download stays one click away beside it.
 */
export function CardActions({
  asset,
  onOpen,
}: {
  asset: SubjectAsset;
  onOpen: (asset: SubjectAsset) => void;
}) {
  return <FileActions file={asset} variant="card" onPreview={() => onOpen(asset)} />;
}
