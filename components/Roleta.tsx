'use client';

import { useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { FATIAS, TOTAL_FATIAS, escolherFatiaParaPremio, type PremioId } from '@/lib/roleta';

type Props = {
  leadId: number;
  onResultado: (premio: PremioId) => void;
};

const RAIO = 180;
const CENTRO = 200;
const ANGULO_FATIA = 360 / TOTAL_FATIAS;

/**
 * Converte um ponto em coordenadas polares (raio, ângulo em graus) para cartesianas.
 * Ângulo 0 = topo, cresce no sentido horário (que é como a roleta funciona).
 */
function polarToCartesian(angulo: number): { x: number; y: number } {
  const rad = ((angulo - 90) * Math.PI) / 180;
  return {
    x: CENTRO + RAIO * Math.cos(rad),
    y: CENTRO + RAIO * Math.sin(rad),
  };
}

/**
 * Gera o path SVG de uma fatia de pizza.
 */
function fatiaPath(indice: number): string {
  const inicio = indice * ANGULO_FATIA;
  const fim = inicio + ANGULO_FATIA;
  const p1 = polarToCartesian(inicio);
  const p2 = polarToCartesian(fim);
  // largeArcFlag = 0 porque cada fatia é menor que 180°
  return `M ${CENTRO} ${CENTRO} L ${p1.x} ${p1.y} A ${RAIO} ${RAIO} 0 0 1 ${p2.x} ${p2.y} Z`;
}

/**
 * Posição do texto da fatia: no meio do arco, a uns 65% do raio.
 */
function textoPos(indice: number): { x: number; y: number; rot: number } {
  const meioAngulo = indice * ANGULO_FATIA + ANGULO_FATIA / 2;
  const rad = ((meioAngulo - 90) * Math.PI) / 180;
  return {
    x: CENTRO + RAIO * 0.62 * Math.cos(rad),
    y: CENTRO + RAIO * 0.62 * Math.sin(rad),
    rot: meioAngulo,
  };
}

export default function Roleta({ leadId, onResultado }: Props) {
  const [girando, setGirando] = useState(false);
  const [terminou, setTerminou] = useState(false);
  const rotacao = useMotionValue(0);

  async function girar() {
    if (girando || terminou) return;
    setGirando(true);

    try {
      const res = await fetch(`/api/roleta/${leadId}`, { method: 'POST' });
      const data = (await res.json()) as { premio?: PremioId; error?: string };

      if (!res.ok || !data.premio) {
        throw new Error(data.error || 'Erro ao girar');
      }

      const indiceAlvo = escolherFatiaParaPremio(data.premio);

      // O ponteiro fica fixo no TOPO (ângulo 0). A roleta gira.
      // Para que o MEIO da fatia `indiceAlvo` fique embaixo do ponteiro,
      // precisamos rotacionar a roleta em -(meio_da_fatia) graus.
      // Mais várias voltas completas pra dar drama.
      const meioFatia = indiceAlvo * ANGULO_FATIA + ANGULO_FATIA / 2;
      const voltasExtras = 6; // ~6 voltas completas antes de parar
      // Pequeno jitter dentro da fatia pra não parar sempre no centro exato
      const jitter = (Math.random() - 0.5) * (ANGULO_FATIA * 0.5);
      const destino = voltasExtras * 360 - meioFatia + jitter;

      // Anima da rotação atual até o destino, com easing de "freada"
      await animate(rotacao, destino, {
        duration: 4.5,
        ease: [0.17, 0.67, 0.21, 1.0], // ease-out forte
      });

      setTerminou(true);
      onResultado(data.premio);
    } catch (err) {
      console.error(err);
      alert('Tivemos um problema ao girar a roleta. Tente de novo.');
      setGirando(false);
    }
  }

  return (
    <div className="roleta-stage">
      <div className="roleta-wrap">
        <div className="roleta-ponteiro" aria-hidden="true" />

        <motion.svg
          viewBox="0 0 400 400"
          width="100%"
          height="100%"
          style={{ rotate: rotacao, display: 'block' }}
        >
          {/* Borda externa decorativa */}
          <circle
            cx={CENTRO}
            cy={CENTRO}
            r={RAIO + 8}
            fill="var(--verde-escuro)"
          />
          {FATIAS.map((fatia, i) => {
            const pos = textoPos(i);
            return (
              <g key={i}>
                <path
                  d={fatiaPath(i)}
                  fill={fatia.cor}
                  stroke="var(--creme)"
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${pos.rot} ${pos.x} ${pos.y})`}
                  fill={fatia.corTexto}
                  fontFamily="var(--fonte-corpo)"
                  fontWeight="700"
                  fontSize={fatia.id === 'coxinha' ? 14 : 11}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  <tspan x={pos.x} dy="-6" fontSize="18">{fatia.emoji}</tspan>
                  <tspan x={pos.x} dy="18">{fatia.label}</tspan>
                </text>
              </g>
            );
          })}
          {/* Pinos decorativos na borda */}
          {Array.from({ length: TOTAL_FATIAS }).map((_, i) => {
            const ang = i * ANGULO_FATIA;
            const p = polarToCartesian(ang);
            return (
              <circle
                key={`pin-${i}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="var(--creme)"
                stroke="var(--verde-escuro)"
                strokeWidth="1.5"
              />
            );
          })}
        </motion.svg>

        <div className="roleta-centro" aria-hidden="true">L</div>
      </div>

      <button
        type="button"
        className="btn-girar"
        onClick={girar}
        disabled={girando || terminou}
      >
        {terminou ? 'Já girou!' : girando ? 'Girando…' : 'GIRAR ROLETA'}
      </button>
    </div>
  );
}
