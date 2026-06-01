// ============================================
// SHARED CONTRACT — copy identical to quiz-fe/src/types.ts
// LOCKED in Phase 1. All teammates code against this. Do NOT diverge.
// ============================================

export type QuizType = 'MBTI' | 'DISC' | 'SCORED' | 'MI_LIKERT';
export type AnswerFormat = 'TEXT_CHOICE' | 'IMAGE_CHOICE' | 'LIKERT_SCALE';
export type LookupType = 'LOVE_COMPATIBILITY' | 'BABY_NAMING';

// ----- Public quiz (anti-cheat stripped) -----
export interface PublicAnswer {
  id: string;
  content: string;
  imageUrl: string | null;
  // NEVER: isCorrect, scoreValue, dimensionPole
}

export interface PublicQuestion {
  id: string;
  content: string;
  imageUrl: string | null;
  orderNumber: number;
  answers: PublicAnswer[]; // rỗng cho LIKERT_SCALE
}

export interface PublicQuiz {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  description: string | null;
  instruction: string | null;
  thumbnailUrl: string | null;
  quizType: QuizType;
  answerFormat: AnswerFormat;
  scaleMin: number | null;
  scaleMax: number | null;
  scaleLabelMin: string | null;
  scaleLabelMax: string | null;
  timeLimitMins: number;
  totalQuestions: number;
  completionCount: number; // số lượt làm (đã đếm sẵn)
  questions: PublicQuestion[];
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  quizCount: number;
  quizzes?: QuizListItem[];
}

export interface QuizListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  quizType: QuizType;
  answerFormat: AnswerFormat;
  totalQuestions: number;
  timeLimitMins: number;
}

// ----- Submit -----
export interface AnswerInput {
  questionId: string;
  answerId?: string;    // TEXT_CHOICE | IMAGE_CHOICE
  scaleValue?: number;  // LIKERT_SCALE (scaleMin..scaleMax)
}

export interface SubmitPayload {
  quizId: string;
  answers: AnswerInput[];
  timeSpentSecs: number;
  age?: number; // nhập ở intro cho bài IQ — ảnh hưởng điểm (age-norming)
}

export interface SubmitResponse {
  resultId: string;
  isLocked: true;
}

// ----- Score results (per quiz type) -----
export interface MbtiResult {
  kind: 'MBTI';
  type: string; // "INTJ"
  poles: { E: number; I: number; S: number; N: number; T: number; F: number; J: number; P: number };
  detail?: MbtiDetail;
}

export interface MbtiDetail {
  type: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

export interface DiscTrait {
  label: string;
  desc: string;
}

export interface DiscDetail {
  group: string;        // 'D' | 'I' | 'S' | 'C'
  name: string;         // 'Dominance'
  title: string;        // 'Người Thủ Lĩnh'
  description: string;
  traits: DiscTrait[];       // đặc điểm nổi bật
  improvements: string[];    // điểm cần cải thiện
}

export interface DiscResult {
  kind: 'DISC';
  dominant: string;       // 'D' | 'I' | 'S' | 'C' (hoặc combo)
  counts: { D: number; I: number; S: number; C: number };
  detail?: DiscDetail;    // attach ở results.ts (giống MBTI)
}

// Diễn giải mức điểm cho LIKERT single (EQ/CQ/AQ/SQ/PQ/tâm lý) — 5 mục
export interface LikertDetail {
  name: string;          // tên chỉ số, vd "Trí tuệ cảm xúc"
  level: string;         // Cao / Trung bình / Thấp
  overview: string;      // ý nghĩa tổng quan mốc điểm
  strengths: string[];   // điểm mạnh ở mức này
  watchouts: string[];   // điều cần lưu ý
  tips: string[];        // gợi ý phát triển
  closing: string;       // câu kết động viên
  description?: string;  // transitional (FE cũ) — sẽ bỏ
}

export interface LikertResult {
  kind: 'LIKERT';
  dimensions: Record<string, { raw: number; max: number; percent: number; level: string }>;
  // single-score tests (EQ/CQ/AQ/SQ/PQ/tâm lý) dùng key 'TOTAL'
  detail?: LikertDetail; // attach runtime ở results.ts cho single TOTAL
}

export interface BigFiveDimDetail {
  key: string;         // O/C/E/A/N
  label: string;       // Cởi mở...
  percent: number;
  level: string;       // Cao / Thấp
  description: string;
}

export interface BigFiveResult {
  kind: 'BIG_FIVE';
  dimensions: { O: number; C: number; E: number; A: number; N: number }; // percent 0-100
  detail?: BigFiveDimDetail[];
}

export interface MiItemDetail {
  label: string;
  percent: number;
  description: string;
}

export interface MiResult {
  kind: 'MI';
  intelligences: Record<string, number>; // 8 loại → percent 0-100, cho radar
  detail?: { items: MiItemDetail[]; topLabels: string[] };
}

// Diễn giải IQ theo dải điểm — 5 mục
export interface IqDetail {
  band: string;                  // "Xuất sắc"...
  overview: string;
  cognitiveStrengths: string[];
  growthAreas: string[];
  tips: string[];
  note: string;
}

export interface IqResult {
  kind: 'IQ';
  correct: number;
  total: number;
  iqScore: number;
  classification: string;
  age?: number; // tuổi đã nhập — điểm đã chuẩn hóa theo độ tuổi
  detail?: IqDetail; // attach runtime ở results.ts
}

export type ScoreResult =
  | MbtiResult | DiscResult | LikertResult | BigFiveResult | MiResult | IqResult;

// ----- Result responses -----
export interface LockedResult {
  isLocked: true;
  resultId: string;
  quizTitle: string;
  quizType: QuizType;
  quizSlug: string;
  timeSpentSecs: number | null;
}

export interface UnlockedResult {
  isLocked: false;
  resultId: string;
  quizTitle: string;
  quizType: QuizType;
  quizSlug: string;
  result: ScoreResult;
}

export type ResultResponse = LockedResult | UnlockedResult;

// ----- Lookups (numerology) -----
export interface LovePersonInput {
  name: string;
  birthDate: string; // ISO yyyy-mm-dd
}

export interface LoveLookupInput {
  person1: LovePersonInput;
  person2: LovePersonInput;
  variant?: 'LOVE' | 'AFFINITY'; // bói tình yêu vs tình duyên
}

export type NamingMode = 'CHECK' | 'COMPARE' | 'SUGGEST';
export type Gender = 'MALE' | 'FEMALE';

export interface BabyNamingInput {
  mode: NamingMode;
  birthDate: string;   // ISO yyyy-mm-dd (build từ select ngày/tháng/năm)
  gender: Gender;
  familyName: string;  // họ của bé
  names?: string[];    // CHECK=1 phần tử, COMPARE=nhiều, SUGGEST=bỏ trống
}

export interface LoveComparisonRow {
  label: string;
  person1: string;
  person2: string;
  match: 'high' | 'medium' | 'low';
}

export interface LoveDimension {
  label: string;
  person1Percent: number; // 0-100
  person2Percent: number; // 0-100
}

export interface LoveHighlight {
  title: string;
  description: string;
}

// 6 con số cốt lõi numerology cho mỗi người
export interface LovePersonNumbers {
  lifePath: number;
  destiny: number;
  soul: number;
  personality: number;
  maturity: number;
  balance: number;
}

// Luận giải sâu theo từng cặp con số
export interface LovePairInterpretation {
  numberLabel: string; // "Số Chủ Đạo", "Số Linh Hồn"...
  p1: number;
  p2: number;
  verdict: 'high' | 'medium' | 'low';
  text: string;
}

// Một giai đoạn trong timeline mối quan hệ (AFFINITY)
export interface LoveTimelineStage {
  phase: string; // "Giai đoạn đầu", "Gắn kết"...
  ageRange?: string;
  tone: 'good' | 'neutral' | 'watch';
  description: string;
}

// Section-driven result — mỗi variant phát một bộ section khác nhau.
// Discriminated union theo `type`; FE map type → component con.
export type LoveSection =
  | { type: 'gauge'; percent: number; headline: string; summary: string }
  | { type: 'dimensions'; rows: LoveDimension[] }
  | { type: 'radar'; axes: { axis: string; p1: number; p2: number }[] }
  | { type: 'pairTable'; rows: LoveComparisonRow[] }
  | { type: 'pairInterpretation'; items: LovePairInterpretation[] }
  | { type: 'loveLanguages'; items: { label: string; person: 1 | 2; description: string }[] }
  | { type: 'attractionMeter'; score: number; factors: { label: string; value: number }[] }
  | { type: 'timeline'; stages: LoveTimelineStage[] }
  | { type: 'longevity'; score: number; horizon: string; description: string }
  | { type: 'strengthsWeaknesses'; strengths: string[]; weaknesses: string[] }
  | { type: 'advice'; title: string; points: string[] }
  | { type: 'highlights'; items: LoveHighlight[] }
  | { type: 'explorePerson'; people: { name: string; birth: string }[] };

export interface LoveResult {
  kind: 'LOVE';
  variant: 'LOVE' | 'AFFINITY';
  percent: number; // 0-100
  headline: string;
  summary: string;
  person1Name: string;
  person2Name: string;
  person1Birth: string;
  person2Birth: string;
  numbers: { p1: LovePersonNumbers; p2: LovePersonNumbers };
  sections: LoveSection[];
}

// ----- Naming (Đặt tên con) — section-driven, 3 mode -----
// Lo Shu 3×3: tần suất từng chữ số (1-9) trong ngày sinh + số còn thiếu
export interface LoShuGrid {
  counts: Record<number, number>; // key 1-9 → số lần xuất hiện
  missing: number[];              // các số (1-9) vắng mặt
}

// Tổng quan ngày sinh — chung cho cả 3 mode
export interface NamingBirthOverview {
  birthDate: string;
  loShu: LoShuGrid;
  canChi: string;    // "Ất Tỵ"
  menh: string;      // "Phúc Đăng Hỏa" (Nạp Âm)
  nguHanh: string;   // "Hỏa"
  trachMenh: string; // "Khôn" (Bát Trạch)
  trachGroup: 'DONG' | 'TAY'; // Đông/Tây tứ mệnh
  goal: string;      // mục tiêu đặt tên (bù số thiếu...)
}

export interface NamingNumberRow {
  key: string;
  label: string;       // "Số Sứ Mệnh", "Số Nợ Nghiệp"...
  value: number;
  keywords: string[];
  isKarmic?: boolean;  // số nợ nghiệp 13/14/16/19
}

export interface NameAnalysis {
  name: string;        // tên nhập/gợi ý (chưa kèm họ)
  fullName: string;    // họ + tên
  score: number;       // 0-100 tất định
  nguHanhTen: string;  // ngũ hành của tên
  tuongSinhKhac: 'sinh' | 'khac' | 'hoa' | 'trung'; // so với mệnh chủ
  tuongText: string;   // diễn giải tương sinh/khắc
  combinedLoShu: LoShuGrid; // biểu đồ tổng hợp tên + ngày sinh
  numbers: NamingNumberRow[];
}

export interface NamingResult {
  kind: 'NAMING';
  mode: NamingMode;
  birthOverview: NamingBirthOverview;
  names: NameAnalysis[]; // CHECK=1, COMPARE=N, SUGGEST=top 5
}

export type LookupResultData = LoveResult | NamingResult;

export interface LookupSubmitResponse {
  lookupId: string;
  isLocked: true;
}

export interface LockedLookup {
  isLocked: true;
  lookupId: string;
  lookupType: LookupType;
}

export interface UnlockedLookup {
  isLocked: false;
  lookupId: string;
  lookupType: LookupType;
  result: LookupResultData;
}

export type LookupResponse = LockedLookup | UnlockedLookup;

// ----- Numerology Profile (full detailed report) -----
export interface NumerologyCoreNumber {
  key: string;
  label: string;
  value: number;
  keywords: string[];
  description: string;
}

export interface NumerologyTraits {
  strengths: string[];
  weaknesses: string[];
  advice: string;
}

export interface NumerologyLifeCycle {
  number: number;
  name: string;
  label: string;
  ageRange: string;
  yearRange: string;
  linkedNumber: number;
  description: string;
  opportunities: string[];
  challenges: string[];
  advice: string;
}

export interface NumerologyPersonalYear {
  year: number;
  number: number;
  title: string;
  description: string;
  career: string;
  love: string;
  challenge: string;
  advice: string[];
  mantra: string;
}

export interface NumerologyCareerGroup {
  name: string;
  percent: number;
}

export interface NumerologyDimension {
  label: string;
  percent: number;
}

export interface NumerologyProfile {
  name: string;
  birthDate: string;
  coreNumbers: NumerologyCoreNumber[];
  traits: NumerologyTraits;
  lifeCycles: NumerologyLifeCycle[];
  personalYears: NumerologyPersonalYear[];
  topCareerGroups: NumerologyCareerGroup[];
  cautionCareerGroups: NumerologyCareerGroup[];
  dimensions: NumerologyDimension[];
  summary: string;
}
