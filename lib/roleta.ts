// Fonte única de verdade pra roleta.
// O servidor usa `sortearPremio()` pra decidir; o cliente importa
// `FATIAS` pra desenhar a roleta e saber em qual fatia parar.

export type PremioId = 'coxinha' | 'squeezy' | 'caneta' | 'nao_foi';

export type Fatia = {
  id: PremioId;
  label: string;
  emoji: string;
  // Cor de fundo da fatia (CSS var ou hex)
  cor: string;
  // Cor do texto sobre a fatia
  corTexto: string;
};

// 10 fatias na ordem em que aparecem na roleta (sentido horário, começando do topo).
// Distribuídas de forma intercalada pra não ficar "tudo coxinha junto".
// Ordem: nao_foi, caneta, nao_foi, squeezy, nao_foi, caneta, coxinha, nao_foi, caneta, squeezy
//          0       1       2        3        4       5        6        7        8       9
// Conta: 1 coxinha ✓ | 2 squeezy ✓ | 3 caneta ✓ | 4 nao_foi ✓
export const FATIAS: Fatia[] = [
  { id: 'nao_foi', label: 'Não foi dessa vez', emoji: '🍃', cor: '#E8E2D3', corTexto: '#2F4A36' },
  { id: 'caneta',  label: 'Caneta',            emoji: '✒️', cor: '#D88A4E', corTexto: '#3A1F0F' },
  { id: 'nao_foi', label: 'Não foi dessa vez', emoji: '🍃', cor: '#E8E2D3', corTexto: '#2F4A36' },
  { id: 'squeezy', label: 'Squeezy',           emoji: '💧', cor: '#5B8F6A', corTexto: '#FFF8E7' },
  { id: 'nao_foi', label: 'Não foi dessa vez', emoji: '🍃', cor: '#E8E2D3', corTexto: '#2F4A36' },
  { id: 'caneta',  label: 'Caneta',            emoji: '✒️', cor: '#D88A4E', corTexto: '#3A1F0F' },
  { id: 'coxinha', label: 'COXINHA!',          emoji: '🍗', cor: '#C9442B', corTexto: '#FFF8E7' },
  { id: 'nao_foi', label: 'Não foi dessa vez', emoji: '🍃', cor: '#E8E2D3', corTexto: '#2F4A36' },
  { id: 'caneta',  label: 'Caneta',            emoji: '✒️', cor: '#D88A4E', corTexto: '#3A1F0F' },
  { id: 'squeezy', label: 'Squeezy',           emoji: '💧', cor: '#5B8F6A', corTexto: '#FFF8E7' },
];

export const TOTAL_FATIAS = FATIAS.length; // 10

/**
 * Sorteia um prêmio com probabilidade proporcional ao número de fatias.
 * Probabilidades: coxinha 10%, squeezy 20%, caneta 30%, nao_foi 40%.
 *
 * Roda no servidor pra não dar pra fraudar pelo DevTools.
 */
export function sortearPremio(): PremioId {
  const indice = Math.floor(Math.random() * TOTAL_FATIAS);
  return FATIAS[indice].id;
}

/**
 * Dada a id do prêmio, escolhe ALEATORIAMENTE qual fatia visual a roleta
 * deve parar (porque tem várias fatias com o mesmo prêmio).
 * Isso evita que a roleta sempre pare na mesma posição pra cada prêmio.
 */
export function escolherFatiaParaPremio(premio: PremioId): number {
  const indices = FATIAS
    .map((f, i) => (f.id === premio ? i : -1))
    .filter((i) => i !== -1);
  return indices[Math.floor(Math.random() * indices.length)];
}
