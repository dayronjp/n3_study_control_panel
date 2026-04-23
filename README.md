# 📚 N3 Study Control Panel

Dashboard interativo para controle do plano semanal de estudos do JLPT N3.

![Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Stack](https://img.shields.io/badge/PostgreSQL-Neon-teal?style=flat-square&logo=postgresql)
![Stack](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

---

## ✨ Features

- ✅ Dashboard semanal fixo (Segunda → Sábado)
- ✅ Checkbox por tarefa com salvamento automático
- ✅ Barra de progresso por dia e semanal
- ✅ Streak de dias concluídos
- ✅ Cards com destaque para o dia atual
- ✅ Dark mode nativo
- ✅ Loading skeleton e error boundary
- ✅ Banco PostgreSQL no Neon
- ✅ Deploy pronto para Vercel

---

## 🏗️ Estrutura de Pastas

```
n3-study-control-panel/
├── app/
│   ├── globals.css          # Estilos globais + Tailwind
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard (Server Component)
│   ├── loading.tsx          # Skeleton de carregamento
│   └── error.tsx            # Error boundary
├── components/
│   ├── ui/
│   │   ├── card.tsx         # Card component
│   │   ├── progress.tsx     # Progress bar
│   │   ├── badge.tsx        # Badge
│   │   └── checkbox.tsx     # Checkbox
│   ├── DayCard.tsx          # Card de cada dia
│   ├── TaskItem.tsx         # Item de tarefa com checkbox
│   ├── WeekGrid.tsx         # Grid dos 6 cards
│   └── WeekHeader.tsx       # Header com stats
├── lib/
│   ├── db.ts                # Conexão Neon
│   ├── actions.ts           # Server Actions
│   ├── study-plan.ts        # Plano fixo semanal
│   ├── types.ts             # Tipos TypeScript
│   └── utils.ts             # Utilitários
├── schema.sql               # Script SQL para criação das tabelas
├── .env.example             # Variáveis de ambiente
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 🚀 Instalação e Execução Local

### 1. Clone e instale as dependências

```bash
git clone <seu-repo>
cd n3-study-control-panel
npm install
```

### 2. Configure o banco de dados no Neon

1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um novo projeto (ex: `n3-study`)
3. Copie a **Connection String** no formato:
   ```
   postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. No dashboard do Neon, abra o **SQL Editor** e execute o conteúdo de `schema.sql`

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` e substitua pela sua connection string:

```env
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 4. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

Na primeira visita, a aplicação irá:
- Criar um usuário padrão automaticamente
- Criar a semana atual automaticamente
- Inserir todas as tarefas do plano fixo

---

## 🌐 Deploy na Vercel

### Opção 1 — Via GitHub (recomendado)

1. Suba o projeto para um repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**
3. Importe o repositório do GitHub
4. Na etapa de configuração, adicione a variável de ambiente:
   - **Name:** `DATABASE_URL`
   - **Value:** sua connection string do Neon
5. Clique em **Deploy**

### Opção 2 — Via Vercel CLI

```bash
npm i -g vercel
vercel
```

Siga as instruções e adicione o `DATABASE_URL` quando solicitado.

### Configuração de rede no Neon (importante)

O Neon aceita conexões da Vercel por padrão. Mas se necessário:
1. No Neon, vá em **Settings → Connections**
2. Certifique-se de que **Pooled connections** estão habilitadas
3. Use a connection string com `?sslmode=require`

---

## 🗃️ Schema do Banco

Execute o arquivo `schema.sql` no SQL Editor do Neon:

```sql
-- Cria as 4 tabelas necessárias:
-- users, study_weeks, study_days, tasks
```

Veja o arquivo completo em [`schema.sql`](./schema.sql).

---

## 📅 Plano Semanal

| Dia     | Foco               | Tempo  |
| ------- | ------------------ | ------ |
| Segunda | Entender gramática | 1h30   |
| Terça   | Fixar e usar       | 1h30   |
| Quarta  | Leitura            | 1h30   |
| Quinta  | Escuta             | 1h30   |
| Sexta   | Dia de teste       | 1h30   |
| Sábado  | Treino pesado      | 2h30   |

**Total semanal:** 10h

---

## 🛠️ Stack

| Tecnologia    | Uso                         |
| ------------- | --------------------------- |
| Next.js 14    | Framework (App Router)      |
| React 18      | UI                          |
| Tailwind CSS  | Estilização                 |
| shadcn/ui     | Componentes base            |
| Neon          | PostgreSQL serverless       |
| Vercel        | Deploy e hosting            |

---

## 🔄 Como funciona

1. **Primeiro acesso:** cria usuário + semana + tarefas automaticamente
2. **Marcar tarefa:** Server Action atualiza o banco e revalida a página
3. **Progresso do dia:** calculado a partir das tarefas concluídas
4. **Dia completo:** quando todas as tarefas estão marcadas
5. **Streak:** número de dias completamente finalizados na semana atual
6. **Nova semana:** gerada automaticamente toda segunda-feira

---

## 📦 Variáveis de Ambiente

| Variável       | Descrição                        | Obrigatória |
| -------------- | -------------------------------- | ----------- |
| `DATABASE_URL` | Connection string do Neon        | ✅ Sim      |


# N3 Study Panel API

API REST para acessar o cronograma de estudos JLPT N3.

## Endpoints

### GET /api/today

Retorna o cronograma do dia atual (segunda a sábado).

**Exemplo de request:**
```bash
curl http://localhost:3000/api/today
```

**Exemplo de response (sucesso):**
```json
{
  "day": "Segunda",
  "focus": "Entender nova gramática",
  "date": "2026-02-16",
  "weekStart": "2026-02-16",
  "stats": {
    "totalMinutes": 90,
    "completedMinutes": 40,
    "progress": 40,
    "completedTasks": 2,
    "totalTasks": 5,
    "isCompleted": false
  },
  "tasks": [
    {
      "id": "1",
      "title": "Kyoto",
      "minutes": 20,
      "completed": true
    },
    {
      "id": "2",
      "title": "JapaLab",
      "minutes": 20,
      "completed": true
    },
    {
      "id": "3",
      "title": "Anki",
      "minutes": 20,
      "completed": false
    },
    {
      "id": "4",
      "title": "Kanji",
      "minutes": 15,
      "completed": false
    },
    {
      "id": "5",
      "title": "Revisão geral",
      "minutes": 15,
      "completed": false
    }
  ]
}
```

**Exemplo de response (domingo):**
```json
{
  "error": "No schedule for Sundays",
  "message": "O cronograma semanal vai de segunda a sábado"
}
```

---

### GET /api/week

Retorna o cronograma completo da semana (segunda a sábado).

**Exemplo de request:**
```bash
curl http://localhost:3000/api/week
```

**Exemplo de response:**
```json
{
  "weekStart": "2026-02-16",
  "weekEnd": "2026-02-21",
  "stats": {
    "totalMinutes": 630,
    "completedMinutes": 180,
    "weekProgress": 29,
    "completedDays": 1,
    "totalDays": 6,
    "streak": 1
  },
  "schedule": [
    {
      "day": "Segunda",
      "focus": "Entender nova gramática",
      "stats": {
        "totalMinutes": 90,
        "completedMinutes": 90,
        "progress": 100,
        "completedTasks": 5,
        "totalTasks": 5,
        "isCompleted": true
      },
      "tasks": [...]
    },
    {
      "day": "Terça",
      "focus": "Fixar e usar",
      "stats": { ... },
      "tasks": [...]
    },
    ...
  ]
}
```

---

## Como usar em outra aplicação

### JavaScript/Node.js
```javascript
// Pegar cronograma de hoje
const response = await fetch('http://localhost:3000/api/today');
const data = await response.json();

if (response.ok) {
  console.log(`Hoje é ${data.day}: ${data.focus}`);
  console.log(`Progresso: ${data.stats.progress}%`);
  console.log('Tasks:', data.tasks);
} else {
  console.error(data.message);
}
```

### Python
```python
import requests

response = requests.get('http://localhost:3000/api/today')
data = response.json()

if response.status_code == 200:
    print(f"Hoje é {data['day']}: {data['focus']}")
    print(f"Progresso: {data['stats']['progress']}%")
    for task in data['tasks']:
        status = '✓' if task['completed'] else '○'
        print(f"{status} {task['title']} ({task['minutes']}min)")
```

### cURL
```bash
# Ver cronograma de hoje
curl http://localhost:3000/api/today | jq

# Ver semana completa
curl http://localhost:3000/api/week | jq

# Ver só as tasks de hoje
curl http://localhost:3000/api/today | jq '.tasks'

# Ver progresso da semana
curl http://localhost:3000/api/week | jq '.stats.weekProgress'
```

---

## Códigos de Status HTTP

- **200 OK** - Sucesso
- **404 Not Found** - Dia/semana não encontrado ou é domingo
- **500 Internal Server Error** - Erro no servidor

---

## Notas

- A API retorna dados apenas de leitura (GET)
- Não é necessária autenticação (por enquanto)
- Os IDs retornados são strings
- Domingos não têm cronograma (retorna 404)
- A semana é criada automaticamente quando você acessa o painel pela primeira vez