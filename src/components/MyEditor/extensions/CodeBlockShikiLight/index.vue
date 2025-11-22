<template>
  <NodeViewWrapper class="code-block-container" v-if="isEditable">
    <div class="code-block-container__select-language">
      <my-select style="width: 100%;" placeholder="请选择语言" v-model="currentLang">
        <my-select-item v-for="obj in languages" :key="obj.value" :value="obj.value"
          :label="obj.label"></my-select-item>
      </my-select>
    </div>

    <pre><NodeViewContent as="code" /></pre>
  </NodeViewWrapper>

  <NodeViewWrapper v-else>
    <div class="code-highlight-wrapper" :style="{ backgroundColor: bgColor }">
      <!-- 顶部工具栏 -->
      <div class="chw__top-tool-bar" :style="{ color: fgColor }">
        <!-- 语言 -->
        <span>{{ currentLang }}</span>

        <div class="ttb__copy-code" @click="copyCode">
          <svg-icons name="fileCopyLine" :size="17" />
          <span>{{ isCopySuccess ? '已复制' : '复制代码' }}</span>
        </div>
      </div>

      <div v-html="highlightedHtml"></div>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import MySelect from '@/components/MySelect/index.vue'
import MySelectItem from '@/components/MySelect/MySelectItem/index.vue'

import SvgIcons from '@/components/Icons/index.vue'

// 引入土司
import { toast } from '@/components/MyToast/toast'

// 引入shiki
import { createHighlighter } from 'shiki'

const props = defineProps<NodeViewProps>()

const codeEl = ref<HTMLElement | null>(null)
const languages = [
  { label: 'Plain Text', value: 'plaintext' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vue', value: 'vue' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'PHP', value: 'php' },
]

const currentLang = ref(props.node.attrs.language || 'plaintext')

// 是否编辑模式
const isEditable = props.editor.isEditable

// 复制成功
const isCopySuccess = ref(false)

// 高亮代码
const highlightedHtml = ref('')
const bgColor = ref('')  // 获取当前主题背景颜色
const fgColor = ref('')  // 获取当前主题背景颜色

watch(currentLang, lang => {
  props.updateAttributes({ language: lang })

})

onMounted(async () => {
  if (codeEl.value && props.node) {
    codeEl.value.textContent = props.node.textContent || ''
  }

  if (!isEditable) {
    // 全部分类
    const langs = languages.map(l => l.value)

    const highlighter = await createHighlighter({
      themes: ['andromeeda'],
      langs,
    })

    highlightedHtml.value = await highlighter.codeToHtml(props.node.textContent, {
      lang: 'javascript',
      theme: 'andromeeda'
    })

    bgColor.value = highlighter.getTheme('andromeeda').bg
    fgColor.value = highlighter.getTheme('andromeeda').fg
  }
})

// 复制代码
const copyCode = () => {
  if (isCopySuccess.value) return

  if (props.node.textContent) {
    const code = props.node.textContent || ''
    navigator.clipboard.writeText(code).then(() => {
      toast({ message: '复制成功', type: 'success' })

      isCopySuccess.value = true

      setTimeout(() => {
        isCopySuccess.value = false
      }, 5000);
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

<style lang="scss" scoped>
.code-block-container {
  position: relative;
  width: 100%;
  background-color: rgb(43, 43, 43);
  padding: 10px;
  box-sizing: border-box;
  border-radius: 4px;
  color: white;

  .code-block-container__select-language {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.code-highlight-wrapper {
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  gap: 5px;

  // 顶部工具栏
  .chw__top-tool-bar {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 12px;
    box-sizing: border-box;
    padding: 0 10px;
    justify-content: space-between;

    .ttb__copy-code {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      font-size: 14px;
      position: sticky;
      top: 0;
    }
  }
}
</style>
