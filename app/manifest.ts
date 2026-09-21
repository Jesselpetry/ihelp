import type { MetadataRoute } from "next";

/**
 * Served at /manifest.webmanifest. Next 16 emits the <link rel="manifest">
 * tag automatically — no manual tag in app/layout.tsx.
 *
 * NOTE: proxy.ts must keep excluding manifest.webmanifest from the Supabase
 * session matcher, otherwise every install check pays a session refresh.
 *
 * Colors track app/globals.css: --background (light) and --primary.
 * See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/manifest.md
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "iHelp IT KMITL",
    short_name: "iHelp",
    description:
      "คลังเรียนรู้สำหรับนักศึกษาปี 1 คณะ IT สจล. — สรุปเนื้อหา แบบทดสอบ ข้อสอบเก่า และคลังสไลด์",
    lang: "th",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f4f6f8",
    theme_color: "#2357A5",
    categories: ["education", "books", "productivity"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Maskable plates are full-bleed with the glyph inset to the 80% safe
      // zone, so Android's circle/squircle masks never clip it.
      {
        src: "/icons/icon-192x192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
