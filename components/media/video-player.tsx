"use client";

import { useState } from "react";
import { useLocale, t, type LText } from "@/lib/i18n";
import { VIDEO_PROVIDERS, type VideoProviderId } from "@/lib/media/providers";

/** One clip: the provider's id for it, and what the picker and the caption call it. */
export interface PlayerVideo {
  id: string;
  label: string;
}

const L = {
  pick: { th: "เลือกวิดีโอ", en: "Choose a video" },
  // The provider's name is appended, so "Watch on" + "YouTube" reads the same as
  // the fixed string it replaced and a second embeddable provider needs no text.
  openOn: { th: "เปิดใน", en: "Watch on" },
} satisfies Record<string, LText>;

/**
 * Plays one clip at a time in an embedded player, with a picker when there are
 * several. Where the clips come from, what their ids may look like and which
 * URLs they map to are all the provider's business (lib/media/providers.ts).
 *
 * A provider with no `embed` entry (OnLearn) is a link, never a player, so
 * there is nothing to draw and the component renders nothing.
 */
export function VideoPlayer({
  provider = "youtube",
  videos,
}: {
  provider?: VideoProviderId;
  videos: PlayerVideo[];
}) {
  const { locale } = useLocale();
  const [index, setIndex] = useState(0);
  const { embed, label: providerLabel } = VIDEO_PROVIDERS[provider];

  // The id is the one part of the authored text that ends up inside a URL, so
  // it is checked again here: a caller that skipped the fence parser cannot put
  // an arbitrary string into an iframe src.
  const playable = embed ? videos.filter((video) => embed.isValidId(video.id)) : [];
  const active = playable[Math.min(index, playable.length - 1)];
  if (!embed || !active) return null;

  return (
    <figure className="my-5">
      {playable.length > 1 && (
        <nav
          aria-label={t(L.pick, locale)}
          className="mb-2 flex flex-wrap gap-1.5"
        >
          {playable.map((video, i) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index ? "true" : undefined}
              className={
                i === index
                  ? "rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  : "rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
              }
            >
              {video.label}
            </button>
          ))}
        </nav>
      )}

      {/*
       * The wrapper owns the 16:9 box and the iframe fills it absolutely, so
       * the player keeps its shape from a 400px phone up to the reader's full
       * width without the iframe's own default 300x150 showing through.
       */}
      <div className="relative w-full overflow-hidden rounded-xl border bg-muted">
        <div style={{ paddingTop: "56.25%" }} />
        <iframe
          key={active.id}
          src={embed.embedUrl(active.id)}
          title={active.label}
          aria-label={active.label}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      <figcaption className="mt-2 text-sm text-muted-foreground">
        {active.label}
        {" · "}
        <a
          className="text-primary underline underline-offset-4 hover:opacity-80"
          href={embed.watchUrl(active.id)}
          target="_blank"
          rel="noreferrer"
        >
          {`${t(L.openOn, locale)} ${providerLabel}`}
        </a>
      </figcaption>
    </figure>
  );
}
