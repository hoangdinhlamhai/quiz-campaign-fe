import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface QuizIntroProps {
  title: string;
  description: string | null;
  instruction: string | null;
  totalQuestions: number;
  timeLimitMins: number;
  completionCount: number;
  hasSavedProgress: boolean;
  requiresAge?: boolean;
  age?: string;
  onAgeChange?: (value: string) => void;
  onStart: () => void;
  onReset?: () => void;
}

export function QuizIntro({
  title,
  description,
  instruction,
  totalQuestions,
  timeLimitMins,
  completionCount,
  hasSavedProgress,
  requiresAge,
  age,
  onAgeChange,
  onStart,
  onReset,
}: QuizIntroProps) {
  const ageNum = Number(age);
  const ageInvalid = requiresAge ? !age || Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120 : false;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl px-4 py-12"
    >
      <div className="rounded-2xl border border-border bg-surface p-6 glow-border sm:p-8">
        <h1 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Chào mừng bạn đến với <span className="text-accent">{title}</span>
        </h1>

        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1 text-muted">
            <Users className="h-3.5 w-3.5" />
            {completionCount.toLocaleString('vi-VN')} lượt làm
          </span>
          <span className="text-muted">{totalQuestions} câu</span>
          <span className="text-muted">{timeLimitMins} phút</span>
        </div>

        {requiresAge && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <label htmlFor="quiz-age" className="text-sm font-medium text-foreground">
              Vui lòng nhập tuổi của bạn (cần thiết để tính điểm IQ):
            </label>
            <input
              id="quiz-age"
              type="number"
              min={1}
              max={120}
              value={age ?? ''}
              onChange={(e) => onAgeChange?.(e.target.value)}
              placeholder="Ví dụ: 25"
              className="w-40 rounded-xl border border-border bg-surface-elevated px-4 py-2 text-center text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          <motion.button
            whileHover={{ scale: ageInvalid ? 1 : 1.03 }}
            whileTap={{ scale: ageInvalid ? 1 : 0.97 }}
            onClick={onStart}
            disabled={ageInvalid}
            className="rounded-xl bg-accent px-8 py-3 font-bold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {hasSavedProgress ? 'Tiếp tục làm bài' : 'Bắt đầu làm bài'}
          </motion.button>
          {hasSavedProgress && onReset && (
            <button onClick={onReset} className="text-sm text-muted hover:text-foreground">
              Làm lại từ đầu
            </button>
          )}
        </div>

        {description && (
          <div className="mt-6 rounded-xl border-l-2 border-accent bg-surface-elevated/50 p-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{description}</p>
          </div>
        )}

        {instruction && (
          <p className="mt-4 text-center text-sm text-muted">{instruction}</p>
        )}
      </div>

      <p className="mt-6 rounded-xl border border-warning/30 bg-warning/5 p-3 text-center text-xs leading-relaxed text-muted">
        Lưu ý: Kết quả của bài trắc nghiệm này chỉ mang tính chất tham khảo, không thay thế
        cho chẩn đoán hoặc tư vấn chuyên môn từ các chuyên gia y tế, tâm lý hoặc hướng nghiệp.
      </p>
    </motion.div>
  );
}
