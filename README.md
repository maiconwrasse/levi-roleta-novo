# Lévi · Roleta de Prêmios

Formulário web com roleta de prêmios e armazenamento das respostas no Vercel Postgres.

## Como funciona

1. Pessoa preenche o formulário → dados vão pro banco com `premio = NULL`.
2. Tela da roleta aparece. Ao clicar em "Girar", o **servidor** sorteia o prêmio (não o navegador — evita trapaça) e grava no banco.
3. A roleta visual roda no cliente, mas para na fatia correspondente ao prêmio decidido pelo servidor.
4. Pessoa vê a tela de resultado.

Prêmios e probabilidades (10 fatias):
- 🍗 Coxinha — 1 fatia (10%)
- 💧 Squeezy — 2 fatias (20%)
- ✒️ Caneta — 3 fatias (30%)
- 🍃 Não foi dessa vez — 4 fatias (40%)

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Framer Motion** pra animação da roleta
- **Vercel Postgres** pro banco de dados
- Deploy: **Vercel**

---

## Passo a passo de deploy

### 1. Subir o projeto no GitHub

```bash
cd levi-roleta
git init
git add .
git commit -m "primeira versão"
# Crie um repositório novo no GitHub (vazio, sem README) e depois:
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/levi-roleta.git
git push -u origin main
```

### 2. Importar o projeto na Vercel

1. Acesse [vercel.com](https://vercel.com), faça login com o GitHub.
2. Clique em **Add New… → Project**.
3. Selecione o repositório `levi-roleta` e clique em **Import**.
4. Não precisa mexer em nada nas configurações — clique em **Deploy**.
5. Espere o build terminar (uns 2 minutos).

### 3. Criar o banco Postgres

1. No painel do projeto na Vercel, vá na aba **Storage**.
2. Clique em **Create Database → Postgres**.
3. Dê um nome (`levi-db` por exemplo), escolha a região mais próxima (ex: São Paulo / `gru1`) e clique em **Create**.
4. Quando perguntar "Connect Project", confirme — isso adiciona as variáveis de ambiente (`POSTGRES_URL` etc.) automaticamente.

### 4. Criar a tabela

1. Ainda no painel do banco que você criou, vá na aba **Query** (ou **Data**, dependendo da versão da interface).
2. Cole todo o conteúdo de `lib/schema.sql` e execute.
3. Confira que a tabela `leads` aparece na aba **Browse**.

### 5. Redeploy

Como você criou o banco depois do primeiro deploy, é bom forçar um novo build pra ele pegar as variáveis:

- Na Vercel, vá em **Deployments** → nos três pontinhos do último deploy → **Redeploy**.

Pronto. A URL do seu site é a que aparece no topo do painel da Vercel (algo como `levi-roleta.vercel.app`).

---

## Ver as respostas

Vá em **Storage → seu banco → Browse → leads**. Lá você vê todos os leads em ordem.

Pra marcar alguém como validado manualmente, use a aba **Query**:

```sql
UPDATE leads
SET validado = TRUE, validado_por = 'Maria'
WHERE id = 42;
```

Pra exportar como planilha:

```sql
SELECT * FROM leads ORDER BY created_at DESC;
```

E use o botão de exportar CSV no canto da tabela de resultados.

---

## Rodar localmente (opcional)

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env.local` copiando o `.env.example` e preenchendo com as variáveis do Vercel Postgres (você acha em **Storage → seu banco → .env.local**).
3. Rode:
   ```bash
   npm run dev
   ```
4. Abra http://localhost:3000.

---

## Estrutura

```
levi-roleta/
├── app/
│   ├── api/
│   │   ├── lead/route.ts        ← POST salva o formulário
│   │   └── roleta/[id]/route.ts ← POST sorteia o prêmio
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 ← formulário + roleta + resultado
├── components/
│   └── Roleta.tsx               ← SVG animado da roleta
├── lib/
│   ├── roleta.ts                ← fatias e função de sorteio
│   └── schema.sql               ← criação da tabela
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```
