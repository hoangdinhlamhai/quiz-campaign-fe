import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import type { PublicQuiz, SubmitPayload, SubmitResponse } from '@/types';
import { useQuiz } from '@/hooks/use-quiz';
import { useTimer } from '@/hooks/use-timer';
import { post } from '@/lib/api';
import { QuizIntro } from './quiz-intro';
import { QuizProgress } from './quiz-progress';
import { TextChoice } from './text-choice';
import { ImageChoiceGrid } from './image-choice-grid';
import { LikertScale } from './likert-scale';

interface QuizRunnerProps {
  quiz: PublicQuiz;
}

export function QuizRunner({ quiz }: QuizRunnerProps) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [age, setAge] = useState('');

  const requiresAge = quiz.slug === 'trac-nghiem-iq';

  const {
    currentIndex,
    currentQuestion,
    answers,
    isStarted,
    hasSavedProgress,
    totalQuestions,
    progress,
    quizId,
    startQuiz,
    resetQuiz,
    selectAnswer,
    setScale,
    goNext,
    goBack,
    goToQuestion,
    completeQuiz,
    getSubmitData,
  } = useQuiz({ questions: quiz.questions, quizSlug: quiz.slug, quizId: quiz.id });

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    completeQuiz();
    try {
      const payload: SubmitPayload = {
        quizId,
        answers: getSubmitData(),
        timeSpentSecs: timer.elapsed,
        ...(requiresAge && age ? { age: Number(age) } : {}),
      };
      const res = await post<SubmitResponse>('/api/submit', payload);
      navigate({ to: '/ket-qua/$id', params: { id: res.resultId } });
    } catch {
      setError('Gửi bài thất bại. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  const timer = useTimer({
    totalMinutes: quiz.timeLimitMins,
    onTimeUp: handleSubmit,
  });

  const handleStart = () => {
    startQuiz();
    timer.start();
  };

  const handleReset = () => {
    resetQuiz();
    timer.reset();
    timer.start();
  };

  if (!isStarted) {
    return (
      <QuizIntro
        title={quiz.title}
        description={quiz.description}
        instruction={quiz.instruction}
        totalQuestions={totalQuestions}
        timeLimitMins={quiz.timeLimitMins}
        completionCount={quiz.completionCount ?? 0}
        hasSavedProgress={hasSavedProgress ?? false}
        requiresAge={requiresAge}
        age={age}
        onAgeChange={setAge}
        onStart={handleStart}
        onReset={handleReset}
      />
    );
  }

  if (submitting) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-muted">Đang gửi bài...</p>
      </div>
    );
  }

  const questionIds = quiz.questions.map((q) => q.id);
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        progress={progress}
        timerDisplay={timer.display}
        isWarning={timer.isWarning}
        isCritical={timer.isCritical}
        answers={answers}
        questionIds={questionIds}
        onGoToQuestion={goToQuestion}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-5"
        >
          {currentQuestion && (
            <>
              <h2 className="text-lg font-semibold text-foreground">
                {currentQuestion.content}
              </h2>

              {quiz.answerFormat === 'TEXT_CHOICE' && (
                <TextChoice
                  answers={currentQuestion.answers}
                  selectedId={currentAnswer?.answerId}
                  onSelect={(id) => selectAnswer(currentQuestion.id, id)}
                />
              )}

              {quiz.answerFormat === 'IMAGE_CHOICE' && (
                <ImageChoiceGrid
                  questionImageUrl={currentQuestion.imageUrl}
                  answers={currentQuestion.answers}
                  selectedId={currentAnswer?.answerId}
                  onSelect={(id) => selectAnswer(currentQuestion.id, id)}
                />
              )}

              {quiz.answerFormat === 'LIKERT_SCALE' && (
                <LikertScale
                  scaleMin={quiz.scaleMin ?? 1}
                  scaleMax={quiz.scaleMax ?? 5}
                  labelMin={quiz.scaleLabelMin}
                  labelMax={quiz.scaleLabelMax}
                  selectedValue={currentAnswer?.scaleValue}
                  onSelect={(val) => setScale(currentQuestion.id, val)}
                />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="text-center text-sm text-danger">{error}</p>}

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={goBack}
          disabled={currentIndex === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-40"
        >
          Quay lại
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            Nộp bài
          </button>
        ) : (
          <button
            onClick={goNext}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent-hover"
          >
            Tiếp theo
          </button>
        )}
      </div>
    </div>
  );
}
