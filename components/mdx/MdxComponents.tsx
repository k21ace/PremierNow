import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-gray-700 leading-relaxed mb-4 pl-6 list-disc">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-gray-700 leading-relaxed mb-4 pl-6 list-decimal">{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-violet-300 pl-4 text-gray-600 italic my-4">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <Link
      href={href ?? "#"}
      className="text-violet-600 hover:underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  ),
};

export default mdxComponents;
