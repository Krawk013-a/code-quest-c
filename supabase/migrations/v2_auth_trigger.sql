-- ============================================================
-- CodeQuest C — Migration V2: trigger de signup à prova de colisão
-- Rodar no Supabase SQL Editor. Idempotente: pode rodar 2x.
-- ============================================================

-- Se dois usuários escolherem o mesmo username, o trigger não pode
-- quebrar o signup (unique em profiles.username). Solução: username
-- base + sufixo numérico quando já estiver ocupado.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  suffix INTEGER := 0;
BEGIN
  base_username := COALESCE(
    NEW.raw_user_meta_data ->> 'username',
    split_part(NEW.email, '@', 1)
  );
  -- normaliza: minúsculas, só [a-z0-9_], máx 20 chars
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g'));
  base_username := left(base_username, 20);
  IF base_username IS NULL OR base_username = '' THEN
    base_username := 'player';
  END IF;

  final_username := base_username;
  WHILE EXISTS (
    SELECT 1 FROM public.profiles
    WHERE username = final_username AND id <> NEW.id
  ) LOOP
    suffix := suffix + 1;
    -- garante que username+sufixo caiba em 20 chars
    final_username := left(base_username, 20 - length(suffix::text)) || suffix::text;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'username')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- ---------- CONFERINDO ----------

SELECT routine_name, data_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
