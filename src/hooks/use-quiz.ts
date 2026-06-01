import { useState, useCallback, useEffect } from 'react';
import type { PublicQuestion, AnswerInput } from '@/types';

type AnswerValue = { answerId?: string; scaleValue?: number };

interface UseQuizOptions {
  questions: PublicQuestion[];
  quizSlug: string;
  quizId: string;
}

interface QuizState {
  currentIndex: number;
  answers: Record<string, AnswerValue>;
  isStarted: boolean;
  isCompleted: boolean;
  hasSavedProgress?: boolean;
}

const STORAGE_PREFIX = 'quiz_progress_';

function loadState(quizSlug: string): QuizState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + quizSlug);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(quizSlug: string, state: QuizState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_PREFIX + quizSlug, JSON.stringify(state));
}

function clearSavedState(quizSlug: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_PREFIX + quizSlug);
}

export function useQuiz({ questions, quizSlug, quizId }: UseQuizOptions) {
  const [state, setState] = useState<QuizState>(() => {
    const saved = loadState(quizSlug);
    if (saved && saved.isStarted && !saved.isCompleted) {
      return {
        ...saved,
        isStarted: false,
        hasSavedProgress: true,
      };
    }
    return {
      currentIndex: 0,
      answers: {},
      isStarted: false,
      isCompleted: false,
      hasSavedProgress: false,
    };
  });

  useEffect(() => {
    if (state.isStarted && !state.isCompleted) {
      saveState(quizSlug, state);
    }
  }, [state, quizSlug]);

  const currentQuestion = questions[state.currentIndex] || null;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(state.answers).length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const startQuiz = useCallback(() => {
    setState((prev) => ({ ...prev, isStarted: true, hasSavedProgress: false }));
  }, []);

  const resetQuiz = useCallback(() => {
    clearSavedState(quizSlug);
    setState({
      currentIndex: 0,
      answers: {},
      isStarted: true,
      isCompleted: false,
      hasSavedProgress: false,
    });
  }, [quizSlug]);

  const selectAnswer = useCallback((questionId: string, answerId: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: { answerId } },
    }));
  }, []);

  const setScale = useCallback((questionId: string, scaleValue: number) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: { scaleValue } },
    }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= totalQuestions - 1) return prev;
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, [totalQuestions]);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev;
      return { ...prev, currentIndex: prev.currentIndex - 1 };
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    if (index < 0 || index >= totalQuestions) return;
    setState((prev) => ({ ...prev, currentIndex: index }));
  }, [totalQuestions]);

  const completeQuiz = useCallback(() => {
    setState((prev) => ({ ...prev, isCompleted: true }));
    clearSavedState(quizSlug);
  }, [quizSlug]);

  const getSubmitData = useCallback((): AnswerInput[] => {
    return Object.entries(state.answers).map(([questionId, value]) => {
      const input: AnswerInput = { questionId };
      if (value.answerId) input.answerId = value.answerId;
      if (value.scaleValue !== undefined) input.scaleValue = value.scaleValue;
      return input;
    });
  }, [state.answers]);

  return {
    currentIndex: state.currentIndex,
    currentQuestion,
    answers: state.answers,
    isStarted: state.isStarted,
    isCompleted: state.isCompleted,
    hasSavedProgress: state.hasSavedProgress,
    totalQuestions,
    answeredCount,
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
  };
}
