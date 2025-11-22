// utils/highlight.ts

import { createHighlighterCore } from 'shiki/core'

const highlighterPromise = createHighlighterCore({
  theme: 'github-light',  // 或你喜欢的
  langs: ['javascript', 'python', 'vue', 'css', 'html']
})

export async function highlightCode(code: string, lang: string) {
  const highlighter = await highlighterPromise
  return highlighter.codeToHtml(code, lang)
}
