import { motion } from 'framer-motion';

interface LikertScaleProps {
  scaleMin: number;
  scaleMax: number;
  labelMin?: string | null;
  labelMax?: string | null;
  selectedValue?: number;
  onSelect: (value: number) => void;
}

export function LikertScale({
  scaleMin,
  scaleMax,
  labelMin,
  labelMax,
  selectedValue,
  onSelect,
}: LikertScaleProps) {
  const values: number[] = [];
  for (let i = scaleMin; i <= scaleMax; i++) {
    values.push(i);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        {values.map((val) => {
          const isSelected = selectedValue === val;
          return (
            <motion.button
              key={val}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(val)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors sm:h-14 sm:w-14 sm:text-base ${
                isSelected
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-surface text-muted hover:border-accent/50'
              }`}
            >
              {val}
            </motion.button>
          );
        })}
      </div>
      {(labelMin || labelMax) && (
        <div className="flex justify-between text-xs text-muted">
          <span>{labelMin || ''}</span>
          <span>{labelMax || ''}</span>
        </div>
      )}
    </div>
  );
}
