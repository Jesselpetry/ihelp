import Link from "next/link";
import {
  GithubIcon,
  InstagramIcon,
  GITHUB_URL,
  INSTAGRAM_URL,
} from "@/components/social-icons";

const SOCIALS = [
  {
    label: "GitHub",
    handle: "/Jesselpetry",
    href: GITHUB_URL,
    icon: <GithubIcon />,
  },
  {
    label: "Instagram",
    handle: "@chatann_",
    href: INSTAGRAM_URL,
    icon: <InstagramIcon />,
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          Built for{" "}
          <span className="font-medium text-foreground">PSCP · IT KMITL</span> ·
          © {new Date().getFullYear()} Chatan Petry
        </p>
        <div className="flex items-center gap-2">
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.05] hover:text-foreground"
            >
              {s.icon}
              {s.handle}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
