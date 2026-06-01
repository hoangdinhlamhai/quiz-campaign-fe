import { motion } from 'framer-motion';
import type { PublicAnswer } from '@/types';

interface ImageChoiceGridProps {
  questionImageUrl: string | null;
  answers: PublicAnswer[];
  selectedId?: string;
  onSelect: (answerId: string) => void;
}

export function ImageChoiceGrid({
  questionImageUrl,
  answers,
  selectedId,
  onSelect,
}: ImageChoiceGridProps) {
  return (
    <div className="flex flex-col gap-4">
      {questionImageUrl && (
        <div className="flex justify-center">
          <img
            src={questionImageUrl}
            alt="Câu hỏi"
            className="max-h-48 rounded-xl border border-border object-contain"
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {answers.slice(0, 6).map((answer, i) => {
          const isSelected = selectedId === answer.id;
          const letter = String.fromCharCode(65 + i);
          return (
            <motion.button
              key={answer.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(answer.id)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                isSelected
                  ? 'border-accent bg-accent-muted ring-2 ring-accent'
                  : 'border-border bg-surface hover:border-accent/50'
              }`}
            >
              <span
                className={`absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                  isSelected
                    ? 'bg-accent text-white'
                    : 'bg-surface-elevated text-muted'
                }`}
              >
                {letter}
              </span>
              {answer.imageUrl ? (
                <img
                  src={answer.imageUrl}
                  alt={answer.content || `Đáp án ${letter}`}
                  className="h-24 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-24 w-full items-center justify-center rounded-lg bg-surface-elevated">
                  <span className="text-xs text-muted">{answer.content || letter}</span>
                </div>
              )}
              {answer.content && (
                <span className="text-xs font-medium text-foreground">{answer.content}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
