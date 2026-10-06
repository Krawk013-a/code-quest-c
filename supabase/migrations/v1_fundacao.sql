-- ============================================================
-- CodeQuest C — Migration V1: Fundação
-- Rodar no Supabase SQL Editor. Idempotente: pode rodar 2x.
-- ============================================================

-- ---------- ENUMS ----------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
    CREATE TYPE activity_type AS ENUM ('mission', 'challenge', 'boss', 'project');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty') THEN
    CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard', 'insane');
  END IF;
END$$;

-- ---------- PROFILES ----------
-- 1 linha por usuário (trigger cria a partir do auth.users)

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ---------- LANGUAGES ----------
-- linguagem é plugin (Plano Mestre §3.2) — conteúdo público

CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,        -- 'c', 'python', 'javascript'...
  name TEXT NOT NULL,
  monaco_id TEXT NOT NULL,          -- id do Monaco editor p/ syntax highlight
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS languages_select_all ON public.languages;
CREATE POLICY languages_select_all ON public.languages
  FOR SELECT USING (true);

-- ---------- WORLDS ----------

CREATE TABLE IF NOT EXISTS public.worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id UUID NOT NULL REFERENCES public.languages (id) ON DELETE CASCADE,
  number INTEGER NOT NULL,          -- 0, 1, 2...
  slug TEXT UNIQUE NOT NULL,        -- 'mundo-0-primeiros-passos'
  title TEXT NOT NULL,
  description TEXT,
  required_missions INTEGER NOT NULL DEFAULT 6,  -- regra de desbloqueio (§13)
  required_boss BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (language_id, number)
);

ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS worlds_select_all ON public.worlds;
CREATE POLICY worlds_select_all ON public.worlds
  FOR SELECT USING (true);

-- ---------- MISSIONS ----------
-- conteúdo é dado, não código (§3.1): tudo vive aqui

CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds (id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  activity activity_type NOT NULL DEFAULT 'mission',
  difficulty difficulty NOT NULL DEFAULT 'easy',
  -- narrativa / contexto
  context_text TEXT,                -- contexto imersivo (§5)
  objective_text TEXT,              -- objetivo claro
  explanation_md TEXT,              -- explicação curta (markdown)
  -- código
  initial_code TEXT NOT NULL,       -- código inicial no editor
  solution_code TEXT,               -- solução de referência (§20: expor só via função segura futura)
  -- testes: [{input, expected_output, label, hidden}]
  tests JSONB NOT NULL DEFAULT '[]',
  -- ajuda progressiva (§7)
  hints JSONB NOT NULL DEFAULT '[]',  -- [{content, xp_cost}] em ordem
  -- gamificação
  xp_reward INTEGER NOT NULL DEFAULT 100,
  concepts TEXT[] NOT NULL DEFAULT '{}',  -- ['printf', 'main', ...]
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Por ora (uso pessoal): leitura pública das missões ativas.
DROP POLICY IF EXISTS missions_select_all ON public.missions;
CREATE POLICY missions_select_all ON public.missions
  FOR SELECT USING (is_active = true);

-- ---------- BADGES ----------

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,                        -- emoji
  criteria JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS badges_select_all ON public.badges;
CREATE POLICY badges_select_all ON public.badges
  FOR SELECT USING (true);

-- ---------- USER_BADGES ----------

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges (id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_badges_select_own ON public.user_badges;
CREATE POLICY user_badges_select_own ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- ---------- USER_PROGRESS ----------
-- estado do jogador por missão

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.missions (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, mission_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_progress_select_own ON public.user_progress;
CREATE POLICY user_progress_select_own ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_progress_insert_own ON public.user_progress;
CREATE POLICY user_progress_insert_own ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_progress_update_own ON public.user_progress;
CREATE POLICY user_progress_update_own ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---------- SUBSCRIPTIONS (futura monetização §21 — só a estrutura) ----------

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'inactive',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS subscriptions_select_own ON public.subscriptions;
CREATE POLICY subscriptions_select_own ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ---------- TRIGGER: criar profile no signup ----------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'username',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'username')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- SEED: linguagem C + Mundo 0 ----------

INSERT INTO public.languages (slug, name, monaco_id, sort_order)
VALUES ('c', 'C', 'cpp', 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.worlds (language_id, number, slug, title, description, required_missions, required_boss, sort_order)
SELECT l.id, 0, 'mundo-0-primeiros-passos', 'Primeiros Passos',
  'main(), printf, compilação, execução e comentários — sua jornada começa aqui.',
  3, false, 0
FROM public.languages l
WHERE l.slug = 'c'
ON CONFLICT (slug) DO NOTHING;

-- ---------- GRANTS ----------
-- Projetos Supabase novos (2025+) NÃO expõem as APIs por padrão:
-- mesmo com RLS correto, sem GRANT explícito o PostgREST retorna
-- "permission denied". (Na fase comercial, UPDATE de XP/nível migra
-- para RPC SECURITY DEFINER — §20/§22 do Plano Mestre.)

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.languages TO anon, authenticated;
GRANT SELECT ON public.worlds TO anon, authenticated;
GRANT SELECT ON public.missions TO anon, authenticated;
GRANT SELECT ON public.badges TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_progress TO authenticated;
GRANT SELECT, INSERT ON public.user_badges TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;

-- ---------- CONFERINDO ----------

SELECT 'profiles' AS tabela, count(*) FROM public.profiles
UNION ALL SELECT 'languages', count(*) FROM public.languages
UNION ALL SELECT 'worlds', count(*) FROM public.worlds
UNION ALL SELECT 'missions', count(*) FROM public.missions
UNION ALL SELECT 'user_progress', count(*) FROM public.user_progress;
