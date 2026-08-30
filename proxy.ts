import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * Next 16 renamed the `middleware` file convention to `proxy`. See
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Everything except:
     * - _next internals and the dev overlay
     * - api/github/*, the pre-existing cookie-based GitHub OAuth flow, which
     *   has nothing to do with the Supabase session
     * - favicon and static image extensions
     */
    "/((?!_next|__nextjs|api/github|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
