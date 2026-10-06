-- ============================================================
-- CodeQuest C — Migration V6: tom de voz Turbo C (sem emojis)
-- Alinha os títulos das missões ao redesign DOS (§7 do spec):
-- sem emoji, tudo em caixa alta na UI.
-- Idempotente: pode rodar 2x.
-- ============================================================

-- boss do mundo 0
UPDATE public.missions
SET title = 'BOSS — Despertar Completo'
WHERE slug = 'despertar-completo';

-- boss do mundo 1
UPDATE public.missions
SET title = 'BOSS — Firmware do Reator'
WHERE slug = 'firmware-do-reator';

-- ---------- CONFERINDO ----------

SELECT slug, title FROM public.missions
WHERE activity = 'boss'
ORDER BY slug;
