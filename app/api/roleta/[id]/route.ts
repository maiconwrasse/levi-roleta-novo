import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { sortearPremio } from '@/lib/roleta';

export const runtime = 'nodejs';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    // Confere se o lead existe e ainda NÃO girou a roleta
    const existente = await sql`
      SELECT id, premio FROM leads WHERE id = ${id} LIMIT 1
    `;
    if (existente.rowCount === 0) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
    }
    if (existente.rows[0].premio) {
      // Já girou — devolve o mesmo prêmio (idempotente, evita girar duas vezes)
      return NextResponse.json({ premio: existente.rows[0].premio, repetido: true });
    }

    const premio = sortearPremio();

    await sql`
      UPDATE leads
      SET premio = ${premio}, premio_girado_em = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ premio });
  } catch (err) {
    console.error('Erro na roleta:', err);
    return NextResponse.json({ error: 'Erro ao girar' }, { status: 500 });
  }
}
