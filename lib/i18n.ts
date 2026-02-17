export type Lang = 'pt' | 'ja';

export const translations = {
  pt: {
    // Nav
    appName: 'N3 Study Panel',
    logout: 'Sair',

    // Header
    jlpt: 'JLPT N3',
    title: 'Study Control Panel',
    streakLabel: 'dias completos',
    streakLabelSingle: 'dia completo',
    progress: 'Progresso',
    hours: 'Horas',
    days: 'Dias',
    weeklyProgress: 'Progresso semanal',

    // Day card
    today: 'HOJE',
    tasks: 'tarefas',
    done: 'feitos',

    // Task
    undo: 'Desfazer',

    // Session timeout
    sessionExpiredTitle: 'Sessão expirada',
    sessionExpiredDesc: 'Você ficou inativo por 2 horas. Por segurança, faça login novamente.',
    sessionExpiredBtn: 'Fazer login',
    sessionWarningTitle: 'Sessão expirando',
    sessionWarningDesc: 'Sua sessão vai expirar em 5 minutos por inatividade.',
    sessionWarningBtn: 'Continuar',

    // Login
    loginTitle: 'Faça login para continuar',
    loginUser: 'Usuário',
    loginPass: 'Senha',
    loginBtn: 'Entrar',
    loginLoading: 'Entrando...',
    loginFooter: 'JLPT N3 · Controle de estudos pessoal',

    // Day names
    Segunda: 'Segunda',
    Terça: 'Terça',
    Quarta: 'Quarta',
    Quinta: 'Quinta',
    Sexta: 'Sexta',
    Sábado: 'Sábado',

    // Focus labels
    'Entender nova gramática': 'Entender nova gramática',
    'Fixar e usar': 'Fixar e usar',
    'Leitura': 'Leitura',
    'Escuta': 'Escuta',
    'Dia de teste': 'Dia de teste',
    'Treino pesado': 'Treino pesado',
  },
  ja: {
    // Nav
    appName: 'N3 学習パネル',
    logout: 'ログアウト',

    // Header
    jlpt: 'JLPT N3',
    title: '学習コントロールパネル',
    streakLabel: '日完了',
    streakLabelSingle: '日完了',
    progress: '進捗',
    hours: '時間',
    days: '日数',
    weeklyProgress: '週間進捗',

    // Day card
    today: '今日',
    tasks: 'タスク',
    done: '完了',

    // Task
    undo: '元に戻す',

    // Session timeout
    sessionExpiredTitle: 'セッション期限切れ',
    sessionExpiredDesc: '2時間操作がありませんでした。セキュリティのため、再ログインしてください。',
    sessionExpiredBtn: 'ログインする',
    sessionWarningTitle: 'セッションの有効期限',
    sessionWarningDesc: '5分後に自動的にログアウトされます。',
    sessionWarningBtn: '継続する',

    // Login
    loginTitle: 'ログインしてください',
    loginUser: 'ユーザー名',
    loginPass: 'パスワード',
    loginBtn: 'ログイン',
    loginLoading: 'ログイン中...',
    loginFooter: 'JLPT N3 · 個人学習管理',

    // Day names
    Segunda: '月曜日',
    Terça: '火曜日',
    Quarta: '水曜日',
    Quinta: '木曜日',
    Sexta: '金曜日',
    Sábado: '土曜日',

    // Focus labels
    'Entender nova gramática': '新しい文法を理解する',
    'Fixar e usar': '定着と活用',
    'Leitura': '読解',
    'Escuta': 'リスニング',
    'Dia de teste': 'テスト日',
    'Treino pesado': '集中練習',
  },
} as const;

export type Translations = typeof translations.pt;

export function t(lang: Lang, key: keyof Translations): string {
  return translations[lang][key] ?? translations.pt[key];
}