"use client";

import { useState } from "react";
import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";

interface ArticlesViewProps {
  articles: ArticleMeta[];
  allTags: string[];
}

export default function ArticlesView({ articles, allTags }: ArticlesViewProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles;

  return (
    <>
      {/* タグフィルター */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 text-xs rounded border transition-colors ${
              activeTag === null
                ? "bg-pn-navy text-white border-pn-navy"
                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            すべて
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                activeTag === tag
                  ? "bg-pn-navy text-white border-pn-navy"
                  : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* 記事一覧 */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">記事が見つかりませんでした。</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((article) => (
            <div
              key={article.slug}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm p-4"
            >
              <Link href={`/articles/${article.slug}`} className="group">
                <h2 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-pn-blue transition-colors mb-1">
                  {article.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                {article.description}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span>{article.publishedAt}</span>
                  <span>{article.readingTime}</span>
                  {article.matchday && <span>第{article.matchday}節</span>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-xs text-pn-blue hover:underline"
                >
                  続きを読む →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
