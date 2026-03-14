import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import ArticlesView from "./ArticlesView";

export const metadata: Metadata = {
  title: "分析記事 | PremierInsight",
  description: "プレミアリーグの戦術・データ分析記事一覧。マッチレポートや統計分析をお届けします。",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags)));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 mb-6">
          分析記事
        </h1>
        <ArticlesView articles={articles} allTags={allTags} />
      </div>
    </main>
  );
}
