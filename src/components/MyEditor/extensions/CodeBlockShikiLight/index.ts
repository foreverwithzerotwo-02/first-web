// CodeBlockWithLang.ts
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlock from '@tiptap/extension-code-block'
import CodeBlockView from './index.vue'

export const CodeBlockWithLang = CodeBlock.extend({
  name: 'codeBlockWithLang',

  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: 'plaintext',
        parseHTML: element => element.getAttribute('data-language') || 'plaintext',
        renderHTML: attributes => ({
          'data-language': attributes.language,
        }),
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(CodeBlockView)
  },
})
