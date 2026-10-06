import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/**
 * Middleware de sessão: renova o token do Supabase Auth em cada request
 * e propaga os cookies de volta ao browser.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: não inserir lógica entre createServerClient e
  // supabase.auth.getUser() — pode causar logout aleatório intermitente.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Exemplo de rota protegida (ativas na Etapa 3 — Auth):
  // if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return supabaseResponse;
}
