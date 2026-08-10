# Raúl Romero — Web & Growth

Landing page profesional de marca personal: diseño y desarrollo de webs y
aplicaciones para pequeñas empresas, autónomos y profesionales.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) (tokens de diseño en `src/app/globals.css`)
- [Motion](https://motion.dev) para animaciones e interacciones
- [Supabase](https://supabase.com) para guardar las solicitudes de contacto
- [Zod](https://zod.dev) para validación de formularios
- [Lucide](https://lucide.dev) para iconografía

## Requisitos

- Node.js 20 o superior
- Una cuenta y proyecto de [Supabase](https://supabase.com) (gratuito)

## Instalación

```bash
npm install
cp .env.example .env.local
```

Rellena `.env.local` con tus variables (ver siguiente sección) y arranca el
servidor de desarrollo:

```bash
npm run dev
```

La web estará disponible en `http://localhost:3000`.

## Variables de entorno

Copia `.env.example` a `.env.local` y complétalo:

| Variable | Dónde encontrarla | Notas |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public | Segura para exponerse: el acceso real lo controla RLS |
| `NEXT_PUBLIC_SITE_URL` | — | URL pública del sitio en producción, usada en metadata y sitemap |

No se usa ni se necesita la clave `service_role` en ningún punto del
proyecto: el formulario inserta datos usando la clave `anon`, protegida por
Row Level Security (ver más abajo).

## Configurar Supabase

1. Crea un proyecto nuevo en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor → New query**.
3. Copia y pega **todo** el contenido de [`supabase/schema.sql`](supabase/schema.sql) y pulsa **Run**.
   Este script crea la tabla `contact_requests`, sus restricciones y las
   políticas de Row Level Security (RLS):
   - El rol público (`anon`, el que usa el formulario) solo puede **insertar**
     filas, nunca leerlas, editarlas ni borrarlas.
   - Solo un usuario autenticado (por ejemplo, tú desde el panel de Supabase)
     puede leer o actualizar el estado de las solicitudes.
4. Copia la `Project URL` y la clave `anon public` a tu `.env.local`.

El script es idempotente: puedes volver a ejecutarlo sin duplicar datos ni
romper nada existente.

## Estructura del proyecto

```
src/
  app/                  Rutas (App Router), metadata, SEO, páginas legales
    actions/contact.ts  Server Action del formulario de contacto
  components/
    layout/              Nav, Footer
    sections/            Hero, Servicios, Proyectos, Proceso, Sobre mí, FAQ, Contacto
    ui/                  Componentes reutilizables (formulario, monograma, animaciones)
  content/               Contenido separado de la presentación (servicios, proyectos, proceso, FAQ)
  lib/                   Validación (Zod), cliente de Supabase, utilidades
supabase/
  schema.sql             Esquema completo, listo para pegar en el SQL Editor
```

## Contenido pendiente de revisión

- **Proyectos**: los tres proyectos mostrados son conceptuales y están
  claramente marcados como tal (`src/content/projects.ts`). Sustitúyelos por
  casos reales según vayas teniendo clientes.
- **Páginas legales**: aviso legal, privacidad y cookies (`src/app/aviso-legal`,
  `src/app/privacidad`, `src/app/cookies`) están completas con los datos
  reales del responsable. No son asesoramiento jurídico profesional: conviene
  que un profesional las revise antes de un lanzamiento comercial serio,
  pero ya no contienen marcadores ni datos inventados.

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # servir el build de producción
npm run lint     # ESLint
npx tsc --noEmit # comprobación de tipos
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com/new).
3. Añade las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`) en
   **Project Settings → Environment Variables**.
4. Despliega. Vercel detecta Next.js automáticamente, no requiere
   configuración adicional.
