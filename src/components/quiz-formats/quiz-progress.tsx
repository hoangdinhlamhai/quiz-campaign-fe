interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  progress: number;
  timerDisplay: string;
  isWarning: boolean;
  isCritical: boolean;
  answers: Record<string, unknown>;
  questionIds: string[];
  onGoToQuestion: (index: number) => void;
}

export function QuizProgress({
  currentIndex,
  totalQuestions,
  progress,
  timerDisplay,
  isWarning,
  isCritical,
  answers,
  questionIds,
  onGoToQuestion,
}: QuizProgressProps) {
  const timerColor = isCritical
    ? 'text-danger'
    : isWarning
      ? 'text-yellow-400'
      : 'text-foreground';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          Câu {currentIndex + 1}/{totalQuestions}
        </span>
        <span className={`font-mono text-sm font-bold ${timerColor}`}>
          {timerDisplay}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {questionIds.map((qId, i) => {
          const isAnswered = qId in answers;
          const isCurrent = i === currentIndex;
          return (
            <button
              key={qId}
              onClick={() => onGoToQuestion(i)}
              className={`h-3 w-3 rounded-full border transition-colors ${
                isCurrent
                  ? 'border-accent bg-accent'
                  : isAnswered
                    ? 'border-accent/50 bg-accent-muted'
                    : 'border-border bg-surface-elevated'
              }`}
              aria-label={`Câu ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
