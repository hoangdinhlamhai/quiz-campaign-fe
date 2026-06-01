import { motion } from 'framer-motion';
import type { PublicAnswer } from '@/types';

interface TextChoiceProps {
  answers: PublicAnswer[];
  selectedId?: string;
  onSelect: (answerId: string) => void;
}

export function TextChoice({ answers, selectedId, onSelect }: TextChoiceProps) {
  return (
    <div className="flex flex-col gap-3">
      {answers.map((answer, i) => {
        const isSelected = selectedId === answer.id;
        const letter = String.fromCharCode(65 + i);
        return (
          <motion.button
            key={answer.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(answer.id)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
              isSelected
                ? 'border-accent bg-accent-muted text-foreground'
                : 'border-border bg-surface hover:border-accent/50'
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                isSelected
                  ? 'bg-accent text-white'
                  : 'bg-surface-elevated text-muted'
              }`}
            >
              {letter}
            </span>
            <span className="text-sm font-medium">{answer.content}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
