// Tipos TypeScript que espelham o schema do Supabase (v1_fundacao.sql)
// NOTA: Row/Insert/Update usam `type` aliases (não `interface`) —
// o supabase-js 2.117 exige assignability a Record<string, unknown>,
// e só type aliases recebem index signature implícita (TS 4.4+).

export type ActivityType = "mission" | "challenge" | "boss" | "project";
export type Difficulty = "easy" | "medium" | "hard" | "insane";
export type MissionStatus = "in_progress" | "completed" | "failed";

/** Um teste de missão: roda o código com `input` e compara com `expected_output` */
export type MissionTest = {
  /** stdin que será passado ao programa compilado */
  input: string;
  /** saída esperada (comparação trim/trailing) */
  expected_output: string;
  /** rótulo exibido no painel de testes (ex.: "Acesso permitido") */
  label?: string;
  /** se true, não mostra o input/expected pro usuário */
  hidden?: boolean;
};

/** Uma dica progressiva (§7 do Plano Mestre) */
export type MissionHint = {
  content: string;
};

export type Language = {
  id: string;
  slug: string;
  name: string;
  monaco_id: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type World = {
  id: string;
  language_id: string;
  number: number;
  slug: string;
  title: string;
  description: string | null;
  required_missions: number;
  required_boss: boolean;
  sort_order: number;
  created_at: string;
};

export type Mission = {
  id: string;
  world_id: string;
  slug: string;
  title: string;
  activity: ActivityType;
  difficulty: Difficulty;
  context_text: string | null;
  objective_text: string | null;
  explanation_md: string | null;
  initial_code: string;
  solution_code: string | null;
  tests: MissionTest[];
  hints: MissionHint[];
  xp_reward: number;
  concepts: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  level: number;
  streak_days: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  mission_id: string;
  status: MissionStatus;
  attempts: number;
  hints_used: number;
  xp_earned: number;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
};

export type Badge = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  criteria: Record<string, unknown>;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
};

// ---------- Runner (CodeRunner — §3.2) ----------

export type RunnerStatus =
  | "ok"               // compilou, executou e testes passaram
  | "compile_error"    // erro de compilação
  | "runtime_error"    // erro em tempo de execução
  | "timeout"          // excedeu o limite de tempo
  | "wrong_answer"     // compilou+rodou, mas saída incorreta
  | "error";           // falha da infraestrutura (rede, sandbox etc.)

export type TestResult = {
  label: string;
  passed: boolean;
  input?: string;
  expected_output?: string;
  actual_output?: string;
};

export type RunResult = {
  status: RunnerStatus;
  /** saída bruta do programa (primeira execução / caso único) */
  stdout: string;
  stderr: string;
  /** versão amigável do erro (§8 — sistema de erros inteligente) */
  friendly_error?: string;
  /** resultados por teste */
  tests: TestResult[];
  /** tempo de execução em ms */
  time_ms?: number;
};

// ---------- Schema Supabase tipado ----------

export type Json = {
  [key: string]: unknown;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Relationships: [];
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          total_xp?: number;
          level?: number;
          streak_days?: number;
          last_activity_date?: string | null;
        };
        Update: Partial<Profile>;
      };
      languages: {
        Row: Language;
        Relationships: [];
        Insert: {
          slug: string;
          name: string;
          monaco_id: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: Partial<Language>;
      };
      worlds: {
        Row: World;
        Relationships: [];
        Insert: {
          language_id: string;
          number: number;
          slug: string;
          title: string;
          description?: string | null;
          required_missions?: number;
          required_boss?: boolean;
          sort_order?: number;
        };
        Update: Partial<World>;
      };
      missions: {
        Row: Mission;
        Relationships: [];
        Insert: {
          world_id: string;
          slug: string;
          title: string;
          activity?: ActivityType;
          difficulty?: Difficulty;
          context_text?: string | null;
          objective_text?: string | null;
          explanation_md?: string | null;
          initial_code: string;
          solution_code?: string | null;
          tests?: MissionTest[];
          hints?: MissionHint[];
          xp_reward?: number;
          concepts?: string[];
          sort_order?: number;
          is_active?: boolean;
        };
        Update: Partial<Mission>;
      };
      badges: {
        Row: Badge;
        Relationships: [];
        Insert: {
          slug: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          criteria?: Json;
        };
        Update: Partial<Badge>;
      };
      user_badges: {
        Row: UserBadge;
        Relationships: [];
        Insert: {
          user_id: string;
          badge_id: string;
        };
        Update: Partial<UserBadge>;
      };
      user_progress: {
        Row: UserProgress;
        Relationships: [];
        Insert: {
          user_id: string;
          mission_id: string;
          status?: MissionStatus;
          attempts?: number;
          hints_used?: number;
          xp_earned?: number;
        };
        Update: Partial<UserProgress>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: {
          user_id: string;
          plan?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_end?: string | null;
        };
        Update: {
          plan?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_end?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      activity_type: ActivityType;
      difficulty: Difficulty;
    };
    CompositeTypes: Record<string, never>;
  };
};
