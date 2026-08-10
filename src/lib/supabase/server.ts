import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase para uso exclusivo en el servidor (Server Actions,
// Route Handlers). Usa la clave anónima: la tabla `contact_requests` solo
// permite INSERT para el rol anon vía RLS, nunca SELECT/UPDATE/DELETE.
// La clave `service_role` no se usa aquí y nunca debe llegar al cliente.
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan las variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
