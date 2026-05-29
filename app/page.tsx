'use client';

import { useState, FormEvent } from 'react';
import Roleta from '@/components/Roleta';
import type { PremioId } from '@/lib/roleta';

type Etapa = 'form' | 'roleta' | 'resultado';

const MENSAGENS: Record<PremioId, { titulo: string; texto: string; win: boolean }> = {
  coxinha: {
    titulo: 'COXINHA é com você! 🍗',
    texto: 'Você acabou de ganhar uma coxinha fresquinha da Lévi. Mostre esta tela no balcão pra retirar.',
    win: true,
  },
  squeezy: {
    titulo: 'Squeezy na mão! 💧',
    texto: 'Você ganhou uma garrafinha Squeezy da Lévi. Passe no balcão para retirar seu prêmio.',
    win: true,
  },
  caneta: {
    titulo: 'Caneta Lévi pra você! ✒️',
    texto: 'Pequenina, mas com toda a vibe Lévi. Retire sua caneta no balcão.',
    win: true,
  },
  nao_foi: {
    titulo: 'Não foi dessa vez 🍃',
    texto: 'Mas obrigada por participar! Continue de olho no nosso Instagram que sempre rolam novas promoções por lá.',
    win: false,
  },
};

export default function Home() {
  const [etapa, setEtapa] = useState<Etapa>('form');
  const [leadId, setLeadId] = useState<number | null>(null);
  const [premio, setPremio] = useState<PremioId | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      nome: String(fd.get('nome') || ''),
      whatsapp: String(fd.get('whatsapp') || ''),
      email: String(fd.get('email') || ''),
      instagram: String(fd.get('instagram') || ''),
      cidade: String(fd.get('cidade') || ''),
      bairro: String(fd.get('bairro') || ''),
      frequencia: String(fd.get('frequencia') || ''),
      periodo: String(fd.get('periodo') || ''),
      treina: String(fd.get('treina') || ''),
      faixa_etaria: String(fd.get('faixa_etaria') || ''),
      objetivo: String(fd.get('objetivo') || ''),
      como_conheceu: String(fd.get('como_conheceu') || ''),
      autoriza_dados: fd.get('autoriza_dados') === 'on',
    };

    setEnviando(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || 'Não foi possível enviar.');
        setEnviando(false);
        return;
      }
      setLeadId(data.id);
      setEtapa('roleta');
    } catch {
      setErro('Erro de conexão. Verifique sua internet e tente de novo.');
      setEnviando(false);
    }
  }

  return (
    <main className="shell">
      <header className="brand">
        <h1>Lévi</h1>
        <span className="line">Linha Fit</span>
        <span className="complex">Complexo 34</span>
      </header>

      {etapa === 'form' && (
        <>
          <h2 className="hero">
            Gire a roleta e <em>concorra a prêmios</em>.
          </h2>
          <p className="hero-sub">
            Preencha o formulário e leve sua chance de ganhar uma coxinha, squeezy, caneta ou outras surpresas.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Seção 1 — Seus dados */}
            <section className="section">
              <h3 className="section-title">
                <span className="num">1</span> Seus dados
              </h3>

              <div className="field">
                <label htmlFor="nome">Nome completo<span className="req">*</span></label>
                <input id="nome" name="nome" type="text" required placeholder="Ex: Maria da Silva" />
              </div>

              <div className="field field-row">
                <div>
                  <label htmlFor="whatsapp">WhatsApp / Telefone<span className="req">*</span></label>
                  <input id="whatsapp" name="whatsapp" type="tel" required placeholder="(99) 99999-9999" />
                </div>
                <div>
                  <label htmlFor="email">E-mail<span className="req">*</span></label>
                  <input id="email" name="email" type="email" required placeholder="seu@email.com" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="instagram">Instagram</label>
                <input id="instagram" name="instagram" type="text" placeholder="@seuinstagram" />
              </div>

              <div className="field field-row">
                <div>
                  <label htmlFor="cidade">Cidade</label>
                  <input id="cidade" name="cidade" type="text" placeholder="Ex: Porto Alegre" />
                </div>
                <div>
                  <label htmlFor="bairro">Bairro</label>
                  <input id="bairro" name="bairro" type="text" placeholder="Ex: Centro" />
                </div>
              </div>
            </section>

            {/* Seção 2 — Perfil alimentar */}
            <section className="section">
              <h3 className="section-title">
                <span className="num">2</span> Seu perfil alimentar
              </h3>

              <div className="field">
                <label>Com que frequência você come marmita / refeição saudável?<span className="req">*</span></label>
                <Radios
                  name="frequencia"
                  required
                  opcoes={[
                    { v: 'todos_os_dias', l: 'Todos os dias' },
                    { v: '3_a_5_semana', l: '3 a 5x por semana' },
                    { v: '1_a_2_semana', l: '1 a 2x por semana' },
                    { v: 'raramente', l: 'Raramente' },
                  ]}
                />
              </div>

              <div className="field">
                <label>Qual período do dia você costuma consumir?</label>
                <Radios
                  name="periodo"
                  opcoes={[
                    { v: 'almoco', l: 'Almoço' },
                    { v: 'jantar', l: 'Jantar' },
                    { v: 'almoco_jantar', l: 'Almoço e jantar' },
                    { v: 'cafe_da_manha', l: 'Café da manhã' },
                  ]}
                />
              </div>

              <div className="field">
                <label>Você treina ou pratica alguma atividade física?<span className="req">*</span></label>
                <Radios
                  name="treina"
                  required
                  opcoes={[
                    { v: 'sim_regular', l: 'Sim, regularmente' },
                    { v: 'sim_as_vezes', l: 'Sim, às vezes' },
                    { v: 'comecando', l: 'Estou começando' },
                    { v: 'nao', l: 'Não pratico' },
                  ]}
                />
              </div>
            </section>

            {/* Seção 3 — Sobre você */}
            <section className="section">
              <h3 className="section-title">
                <span className="num">3</span> Sobre você
              </h3>

              <div className="field">
                <label>Faixa etária<span className="req">*</span></label>
                <Radios
                  name="faixa_etaria"
                  required
                  opcoes={[
                    { v: 'ate_20', l: 'Até 20 anos' },
                    { v: '21_30', l: '21 a 30 anos' },
                    { v: '31_40', l: '31 a 40 anos' },
                    { v: 'acima_40', l: 'Acima de 40 anos' },
                  ]}
                />
              </div>

              <div className="field">
                <label>Você tem algum objetivo de saúde no momento?</label>
                <Radios
                  name="objetivo"
                  opcoes={[
                    { v: 'emagrecer', l: 'Emagrecer' },
                    { v: 'massa', l: 'Ganhar massa' },
                    { v: 'manter', l: 'Manter o peso' },
                    { v: 'comer_melhor', l: 'Comer melhor' },
                  ]}
                />
              </div>

              <div className="field">
                <label>Como ficou sabendo sobre a Lévi / Complexo 34?</label>
                <Radios
                  name="como_conheceu"
                  opcoes={[
                    { v: 'instagram', l: 'Instagram' },
                    { v: 'indicacao', l: 'Indicação de amigo' },
                    { v: 'evento', l: 'Evento' },
                    { v: 'google', l: 'Google' },
                  ]}
                />
              </div>
            </section>

            <label className="consent">
              <input type="checkbox" name="autoriza_dados" required />
              <span>
                Autorizo o uso dos meus dados para contato e envio de informações sobre a Lévi.
                Estou ciente de que minhas informações não serão compartilhadas com terceiros.
              </span>
            </label>

            {erro && <div className="error">{erro}</div>}

            <button type="submit" className="btn-primary" disabled={enviando}>
              {enviando ? 'Enviando…' : '🎡  Quero girar a roleta'}
            </button>
          </form>
        </>
      )}

      {etapa === 'roleta' && leadId !== null && (
        <>
          <h2 className="hero" style={{ textAlign: 'center' }}>
            Sua vez! <em>Gire a roleta.</em>
          </h2>
          <p className="hero-sub" style={{ textAlign: 'center', margin: '0 auto 20px' }}>
            Toque no botão abaixo e descubra o que está te esperando.
          </p>
          <Roleta
            leadId={leadId}
            onResultado={(p) => {
              setPremio(p);
              setTimeout(() => setEtapa('resultado'), 800);
            }}
          />
        </>
      )}

      {etapa === 'resultado' && premio && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
          <div className={`resultado ${MENSAGENS[premio].win ? 'win' : ''}`}>
            <div className="emoji">
              {premio === 'coxinha' && '🍗'}
              {premio === 'squeezy' && '💧'}
              {premio === 'caneta' && '✒️'}
              {premio === 'nao_foi' && '🍃'}
            </div>
            <h2>{MENSAGENS[premio].titulo}</h2>
            <p>{MENSAGENS[premio].texto}</p>
            <a
              className="insta"
              href="https://instagram.com/levicomidasaudavel"
              target="_blank"
              rel="noreferrer"
            >
              📲 @levicomidasaudavel
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

/* ----- Componente auxiliar de radios ----- */
function Radios({
  name,
  opcoes,
  required,
}: {
  name: string;
  opcoes: { v: string; l: string }[];
  required?: boolean;
}) {
  return (
    <div className="options">
      {opcoes.map((o) => (
        <label className="option" key={o.v}>
          <input type="radio" name={name} value={o.v} required={required} />
          <span className="dot" />
          <span>{o.l}</span>
        </label>
      ))}
    </div>
  );
}
