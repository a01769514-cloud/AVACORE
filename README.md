# AVACORE — Panel de Operaciones

Sistema de monitoreo y operaciones para AVA Systems.

## Stack

- **Next.js 15** (App Router)
- **Supabase** (Auth + PostgreSQL + RLS)
- **Tailwind CSS v4**
- **Recharts**
- **Vercel** (deploy)

## Setup local

```bash
npm install
cp .env.local.example .env.local
# Edita .env.local con tu anon key real de Supabase
npm run dev
```

## Variables de entorno requeridas

```
NEXT_PUBLIC_SUPABASE_URL=https://fgmnspwslgcvtiiuaeli.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # Desde Supabase → Settings → API → anon public
```

## Estructura de rutas

```
/login                          → Autenticación
/admin                          → Directorio de clientes (solo admin)
/admin/operations               → Monitor técnico + logs
/dashboard/[clienteId]          → Dashboard general del cliente
/dashboard/[clienteId]/leads    → Tabla de leads
/dashboard/[clienteId]/meetings → Tabla de citas
/dashboard/[clienteId]/projects → Tabla de proyectos
/dashboard/[clienteId]/analytics → Gráficos de métricas
/dashboard/[clienteId]/campaigns → Campañas y landing page
/403                            → Acceso denegado
```

## Roles

- `admin` → Acceso total. Toggle de vista en header.
- `client` → Solo su `cliente_id`. Bloqueado en `/admin`.

## Primer usuario admin

En Supabase → Authentication → Users, crea el usuario y luego ejecuta:

```sql
INSERT INTO user_profiles (id, role, full_name)
VALUES ('uuid-del-usuario', 'admin', 'Diego');
```
