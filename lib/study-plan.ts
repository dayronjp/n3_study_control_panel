export interface DayPlan {
  dayName: string;
  focus: string;
  totalMinutes: number;
  tasks: { title: string; minutes: number }[];
}

export const WEEKLY_PLAN: DayPlan[] = [
  {
    dayName: 'Segunda',
    focus: 'Entender nova gramática',
    totalMinutes: 90,
    tasks: [
      { title: 'Kyoto', minutes: 20 },
      { title: 'JapaLab', minutes: 20 },
      { title: 'Anki', minutes: 20 },
      { title: 'Kanji', minutes: 15 },
      { title: 'Revisão geral', minutes: 15 },
    ],
  },
  {
    dayName: 'Terça',
    focus: 'Fixar e usar',
    totalMinutes: 90,
    tasks: [
      { title: 'JapaLab (vídeo + resumo rápido)', minutes: 20 },
      { title: 'Produção ativa (frases + mini texto)', minutes: 40 },
      { title: 'Anki', minutes: 15 },
      { title: 'Kanji', minutes: 15 },
    ],
  },
  {
    dayName: 'Quarta',
    focus: 'Leitura',
    totalMinutes: 90,
    tasks: [
      { title: 'Leitura longa (Minna ou texto N3)', minutes: 40 },
      { title: 'Análise do texto (vocabulário + estrutura)', minutes: 25 },
      { title: 'Anki', minutes: 15 },
      { title: 'Kanji', minutes: 10 },
    ],
  },
  {
    dayName: 'Quinta',
    focus: 'Escuta',
    totalMinutes: 90,
    tasks: [
      { title: 'Listening principal (formato N3)', minutes: 40 },
      { title: 'Correção + análise detalhada', minutes: 20 },
      { title: 'Shadowing intenso', minutes: 20 },
      { title: 'Reescuta sem pausa', minutes: 10 },
    ],
  },
  {
    dayName: 'Sexta',
    focus: 'Dia de teste',
    totalMinutes: 90,
    tasks: [
      { title: 'Mini simulado', minutes: 35 },
      { title: 'Correção detalhada', minutes: 30 },
      { title: 'Revisão focada nos erros', minutes: 15 },
      { title: 'Anki', minutes: 20 },
    ],
  },
  {
    dayName: 'Sábado',
    focus: 'Treino pesado',
    totalMinutes: 150,
    tasks: [
      { title: 'Revisão geral', minutes: 40 },
      { title: 'Minna no Nihongo Intermediário', minutes: 40 },
      { title: 'Leitura longa', minutes: 30 },
      { title: 'Listening', minutes: 20 },
      { title: 'Anki', minutes: 20 },
    ],
  },
];

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday...
  // Move to Monday of the current week
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00');
  const end = new Date(start);
  end.setDate(end.getDate() + 5); // Monday to Saturday

  const formatDate = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return `${formatDate(start)} – ${formatDate(end)}`;
}
