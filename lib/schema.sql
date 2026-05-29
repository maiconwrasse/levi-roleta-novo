-- Rode este SQL UMA VEZ no painel do Vercel Postgres (aba "Query")
-- depois de criar o banco.

CREATE TABLE IF NOT EXISTS leads (
  id              SERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 1. Dados pessoais
  nome            TEXT NOT NULL,
  whatsapp        TEXT NOT NULL,
  email           TEXT NOT NULL,
  instagram       TEXT,
  cidade          TEXT,
  bairro          TEXT,

  -- 2. Perfil alimentar
  frequencia      TEXT,  -- 'todos_os_dias' | '3_a_5_semana' | '1_a_2_semana' | 'raramente'
  periodo         TEXT,  -- 'almoco' | 'jantar' | 'almoco_jantar' | 'cafe_da_manha'
  treina          TEXT,  -- 'sim_regular' | 'sim_as_vezes' | 'comecando' | 'nao'

  -- 3. Sobre você
  faixa_etaria    TEXT,  -- 'ate_20' | '21_30' | '31_40' | 'acima_40'
  objetivo        TEXT,  -- 'emagrecer' | 'massa' | 'manter' | 'comer_melhor'
  como_conheceu   TEXT,  -- 'instagram' | 'indicacao' | 'evento' | 'google'

  autoriza_dados  BOOLEAN NOT NULL DEFAULT FALSE,

  -- Resultado da roleta
  premio          TEXT,        -- 'coxinha' | 'squeezy' | 'caneta' | 'nao_foi'
  premio_girado_em TIMESTAMPTZ,

  -- Validação manual (você atualiza pelo painel do Vercel Postgres)
  validado        BOOLEAN NOT NULL DEFAULT FALSE,
  validado_por    TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_premio     ON leads (premio);
