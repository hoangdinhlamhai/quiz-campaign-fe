import { createFileRoute } from '@tanstack/react-router';
import { get } from '@/lib/api';
import type { PublicQuiz } from '@/types';
import { QuizRunner } from '@/components/quiz-formats/quiz-runner';

export const Route = createFileRoute('/lam-bai/$slug')({
  loader: async ({ params }) => {
    const quiz = await get<PublicQuiz>(`/api/quizzes/${params.slug}`);
    return { quiz };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { quiz } = loaderData;
    return {
      meta: [
        { title: `${quiz.title} — Trắc nghiệm` },
        { name: 'description', content: quiz.description ?? `Làm bài trắc nghiệm ${quiz.title}` },
        { property: 'og:title', content: quiz.title },
        { property: 'og:description', content: quiz.description ?? '' },
        ...(quiz.thumbnailUrl ? [{ property: 'og:image', content: quiz.thumbnailUrl }] : []),
      ],
    };
  },
  component: QuizPage,
});

function QuizPage() {
  const { quiz } = Route.useLoaderData();
  return (
    <main className="min-h-screen">
      <QuizRunner quiz={quiz} />
    </main>
  );
}
