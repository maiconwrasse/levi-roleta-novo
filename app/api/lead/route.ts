import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';

type LeadBody = {
  nome: string;
  whatsapp: string;
  email: string;
  instagram?: string;
  cidade?: string;
  bairro?: string;
  frequencia?: string;
  periodo?: string;
  treina?: string;
  faixa_etaria?: string;
  objetivo?: string;
  como_conheceu?: string;
  autoriza_dados: boolean;
};

function isNonEmpty(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export async function POST(req: NextRequest) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  // Validação mínima dos campos obrigatórios
  if (!isNonEmpty(body.nome) || !isNonEmpty(body.whatsapp) || !isNonEmpty(body.email)) {
    return NextResponse.json(
      { error: 'Nome, WhatsApp e e-mail são obrigatórios.' },
      { status: 400 },
    );
  }
  if (!isNonEmpty(body.frequencia) || !isNonEmpty(body.treina) || !isNonEmpty(body.faixa_etaria)) {
    return NextResponse.json(
      { error: 'Preencha frequência, treino e faixa etária.' },
      { status: 400 },
    );
  }
  if (body.autoriza_dados !== true) {
    return NextResponse.json(
      { error: 'É preciso autorizar o uso dos dados para participar.' },
      { status: 400 },
    );
  }

  try {
    const result = await sql`
      INSERT INTO leads (
        nome, whatsapp, email, instagram, cidade, bairro,
        frequencia, periodo, treina,
        faixa_etaria, objetivo, como_conheceu,
        autoriza_dados
      ) VALUES (
        ${body.nome.trim()},
        ${body.whatsapp.trim()},
        ${body.email.trim().toLowerCase()},
        ${body.instagram?.trim() || null},
        ${body.cidade?.trim() || null},
        ${body.bairro?.trim() || null},
        ${body.frequencia || null},
        ${body.periodo || null},
        ${body.treina || null},
        ${body.faixa_etaria || null},
        ${body.objetivo || null},
        ${body.como_conheceu || null},
        ${body.autoriza_dados}
      )
      RETURNING id
    `;

    const id = result.rows[0]?.id as number;
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error('Erro ao salvar lead:', err);
    return NextResponse.json(
      { error: 'Erro ao salvar no banco. Tente de novo.' },
      { status: 500 },
    );
  }
}
