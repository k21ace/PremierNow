import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // YYYY-MM-DD
  matchday?: number;
  tags: string[];
  readingTime: string; // 「約5分」形式
  featured?: boolean;
};

export type Article = ArticleMeta & {
  content: string;
};

function formatReadingTime(minutes: number): string {
  return `約${Math.max(1, Math.ceil(minutes))}分`;
}

function parseMeta(slug: string, data: Record<string, unknown>, content: string): ArticleMeta {
  const stats = readingTime(content);
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    publishedAt: data.publishedAt as string,
    matchday: data.matchday as number | undefined,
    tags: (data.tags as string[]) ?? [],
    readingTime: formatReadingTime(stats.minutes),
    featured: (data.featured as boolean) ?? false,
  };
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, "");
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    return parseMeta(slug, data, content);
  });

  return articles.sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}

export function getArticleBySlug(slug: string): Article {
  const extensions = [".mdx", ".md"];
  let raw: string | null = null;

  for (const ext of extensions) {
    const filePath = path.join(ARTICLES_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      raw = fs.readFileSync(filePath, "utf-8");
      break;
    }
  }

  if (!raw) throw new Error(`Article not found: ${slug}`);

  const { data, content } = matter(raw);
  return { ...parseMeta(slug, data, content), content };
}

export function getFeaturedArticles(): ArticleMeta[] {
  return getAllArticles()
    .filter((a) => a.featured)
    .slice(0, 3);
}
