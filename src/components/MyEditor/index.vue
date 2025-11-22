<template>
    <div class="my-editor" ref="editorContainer">
        <!-- 顶部工具栏 -->
        <div class="my-editor__toolbar" v-if="props.editable">
            <!-- quote -->
            <button v-tip="'引用'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().toggleBlockquote().run()"
                :class="{ 'is-active': editor?.isActive('blockquote') }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 4H3V6H21V4ZM21 11H8V13H21V11ZM21 18H8V20H21V18ZM5 11H3V20H5V11Z"></path>
                </svg>
            </button>

            <!-- 代码块 -->
            <button v-tip="'代码块'" class="my-editor__toolbar--btn" @click="toggleCodeBlock"
                :class="{ 'is-active': editor?.isActive('codeBlockWithLang') }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M24 12L18.3431 17.6569L16.9289 16.2426L21.1716 12L16.9289 7.75736L18.3431 6.34315L24 12ZM2.82843 12L7.07107 16.2426L5.65685 17.6569L0 12L5.65685 6.34315L7.07107 7.75736L2.82843 12ZM9.78845 21H7.66009L14.2116 3H16.3399L9.78845 21Z">
                    </path>
                </svg>
            </button>

            <!-- 子弹列表 -->
            <button v-tip="'子弹列表'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor?.isActive('bulletList') }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z">
                    </path>
                </svg>
            </button>

            <!-- 排序列表 -->
            <button v-tip="'排序列表'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().toggleOrderedList().run()"
                :class="{ 'is-active': editor?.isActive('orderedList') }"><svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z">
                    </path>
                </svg></button>

            <!-- 列表操作 -->
            <button v-tip="'换行'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().splitListItem('listItem').run()"
                :disabled="!editor?.can().splitListItem('listItem')"><svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M15 18H16.5C17.8807 18 19 16.8807 19 15.5C19 14.1193 17.8807 13 16.5 13H3V11H16.5C18.9853 11 21 13.0147 21 15.5C21 17.9853 18.9853 20 16.5 20H15V22L11 19L15 16V18ZM3 4H21V6H3V4ZM9 18V20H3V18H9Z">
                    </path>
                </svg></button>
            <button v-tip="'新增缩进'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().sinkListItem('listItem').run()"
                :disabled="!editor?.can().sinkListItem('listItem')"><svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4H21V6H3V4ZM3 19H21V21H3V19ZM11 14H21V16H11V14ZM11 9H21V11H11V9ZM7 12.5L3 16V9L7 12.5Z">
                    </path>
                </svg></button>
            <button v-tip="'去除缩进'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().liftListItem('listItem').run()"
                :disabled="!editor?.can().liftListItem('listItem')"><svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4H21V6H3V4ZM3 19H21V21H3V19ZM11 14H21V16H11V14ZM11 9H21V11H11V9ZM3 12.5L7 9V16L3 12.5Z">
                    </path>
                </svg></button>

            <!-- 详情 -->
            <button v-tip="'详情'" class="my-editor__toolbar--btn" @click="editor?.chain().focus().setDetails().run()"
                title="新增详情" :disabled="!editor?.can().setDetails()"
                :class="{ 'is-active': editor?.isActive('details') }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M5 5H13V19H5V5ZM19 19H15V5H19V19ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM11 12L7 8.5V15.5L11 12Z">
                    </path>
                </svg></button>
            <button v-tip="'删除详情'" class="my-editor__toolbar--btn" @click="editor?.chain().focus().unsetDetails().run()"
                title="移除详情" :disabled="!editor?.can().unsetDetails()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M5 5H13V19H5V5ZM19 19H15V5H19V19ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM7 12L11 8.5V15.5L7 12Z">
                    </path>
                </svg></button>

            <!-- 标题选项 -->
            <my-select :toggle="true" class="my-editor__toolbar--select" placeholder="请选择标题">
                <my-select-item v-for="obj in titleOptions" :label="obj.label" :value="obj.value" :onClick="obj.onClick"
                    :key="obj.label"></my-select-item>
            </my-select>

            <!-- HorizontalRule -->
            <button v-tip="'分割线'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().setHorizontalRule().run()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 11H4V13H2V11ZM6 11H18V13H6V11ZM20 11H22V13H20V11Z"></path>
                </svg>
            </button>

            <!-- 确认框 -->
            <button v-tip="'确认框'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().toggleTaskList().run()"
                :class="{ 'is-active': editor?.isActive('taskList') }">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M8.00008 6V9H5.00008V6H8.00008ZM3.00008 4V11H10.0001V4H3.00008ZM13.0001 4H21.0001V6H13.0001V4ZM13.0001 11H21.0001V13H13.0001V11ZM13.0001 18H21.0001V20H13.0001V18ZM10.7072 16.2071L9.29297 14.7929L6.00008 18.0858L4.20718 16.2929L2.79297 17.7071L6.00008 20.9142L10.7072 16.2071Z">
                    </path>
                </svg>
            </button>
            <button v-tip="'换行'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().splitListItem('taskItem').run()"
                :disabled="!editor?.can().splitListItem('taskItem')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M15 18H16.5C17.8807 18 19 16.8807 19 15.5C19 14.1193 17.8807 13 16.5 13H3V11H16.5C18.9853 11 21 13.0147 21 15.5C21 17.9853 18.9853 20 16.5 20H15V22L11 19L15 16V18ZM3 4H21V6H3V4ZM9 18V20H3V18H9Z">
                    </path>
                </svg>
            </button>
            <button v-tip="'新增缩进'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().sinkListItem('taskItem').run()"
                :disabled="!editor?.can().sinkListItem('taskItem')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4H21V6H3V4ZM3 19H21V21H3V19ZM11 14H21V16H11V14ZM11 9H21V11H11V9ZM7 12.5L3 16V9L7 12.5Z">
                    </path>
                </svg>
            </button>
            <button v-tip="'删除缩进'" class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().liftListItem('taskItem').run()"
                :disabled="!editor?.can().liftListItem('taskItem')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4H21V6H3V4ZM3 19H21V21H3V19ZM11 14H21V16H11V14ZM11 9H21V11H11V9ZM3 12.5L7 9V16L3 12.5Z">
                    </path>
                </svg>
            </button>

            <!-- 表格 -->
            <button class="my-editor__toolbar--btn"
                @click="editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
                v-tip="'插入表格'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M3 3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H3ZM11 5V8H4V5H11ZM4 14V10H11V14H4ZM4 16H11V19H4V16ZM13 16H20V19H13V16ZM20 14H13V10H20V14ZM20 5V8H13V5H20Z">
                    </path>
                </svg>
            </button>

            <!-- 上传图片 -->
            <button class="my-editor__toolbar--btn" @click="clickUpdateImage" v-tip="'上传图片'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M20.7134 8.12811L20.4668 8.69379C20.2864 9.10792 19.7136 9.10792 19.5331 8.69379L19.2866 8.12811C18.8471 7.11947 18.0555 6.31641 17.0677 5.87708L16.308 5.53922C15.8973 5.35653 15.8973 4.75881 16.308 4.57612L17.0252 4.25714C18.0384 3.80651 18.8442 2.97373 19.2761 1.93083L19.5293 1.31953C19.7058 0.893489 20.2942 0.893489 20.4706 1.31953L20.7238 1.93083C21.1558 2.97373 21.9616 3.80651 22.9748 4.25714L23.6919 4.57612C24.1027 4.75881 24.1027 5.35653 23.6919 5.53922L22.9323 5.87708C21.9445 6.31641 21.1529 7.11947 20.7134 8.12811ZM2.9918 3H14V5H4V19L14 9L20 15V11H22V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z">
                    </path>
                </svg>
            </button>

            <!-- 加粗 -->
            <button class="my-editor__toolbar--btn" @click="editor?.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor?.isActive('bold') }" v-tip="'文本加粗'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z">
                    </path>
                </svg>
            </button>

            <!-- 斜体 -->
            <button class="my-editor__toolbar--btn" @click="editor?.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor?.isActive('italic') }" v-tip="'文本斜体'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"></path>
                </svg>
            </button>

            <!-- 删除线 -->
            <button class="my-editor__toolbar--btn" @click="editor?.chain().focus().toggleStrike().run()"
                :class="{ 'is-active': editor?.isActive('strike') }" v-tip="'删除线'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M17.1538 14C17.3846 14.5161 17.5 15.0893 17.5 15.7196C17.5 17.0625 16.9762 18.1116 15.9286 18.867C14.8809 19.6223 13.4335 20 11.5862 20C9.94674 20 8.32335 19.6185 6.71592 18.8555V16.6009C8.23538 17.4783 9.7908 17.917 11.3822 17.917C13.9333 17.917 15.2128 17.1846 15.2208 15.7196C15.2208 15.0939 15.0049 14.5598 14.5731 14.1173C14.5339 14.0772 14.4939 14.0381 14.4531 14H3V12H21V14H17.1538ZM13.076 11H7.62908C7.4566 10.8433 7.29616 10.6692 7.14776 10.4778C6.71592 9.92084 6.5 9.24559 6.5 8.45207C6.5 7.21602 6.96583 6.165 7.89749 5.299C8.82916 4.43299 10.2706 4 12.2219 4C13.6934 4 15.1009 4.32808 16.4444 4.98426V7.13591C15.2448 6.44921 13.9293 6.10587 12.4978 6.10587C10.0187 6.10587 8.77917 6.88793 8.77917 8.45207C8.77917 8.87172 8.99709 9.23796 9.43293 9.55079C9.86878 9.86362 10.4066 10.1135 11.0463 10.3004C11.6665 10.4816 12.3431 10.7148 13.076 11H13.076Z">
                    </path>
                </svg>
            </button>

            <!-- 下标 -->
            <button class="my-editor__toolbar--btn" @click="editor?.chain().focus().toggleSubscript().run()"
                :class="{ 'is-active': editor?.isActive('subscript') }" v-tip="'下标'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M11 6V19H9V6H3V4H17V6H11ZM19.5507 16.5803C19.7042 16.4345 19.8 16.2284 19.8 16C19.8 15.5582 19.4418 15.2 19 15.2C18.5582 15.2 18.2 15.5582 18.2 16C18.2 16.0762 18.2107 16.15 18.2306 16.2198L17.0765 16.5496C17.0267 16.375 17 16.1906 17 16C17 14.8954 17.8954 14 19 14C20.1046 14 21 14.8954 21 16C21 16.5727 20.7593 17.0892 20.3735 17.4538L18.7441 19H21V20H17V19L19.5507 16.5803V16.5803Z">
                    </path>
                </svg>
            </button>

            <!-- 上标 -->
            <button class="my-editor__toolbar--btn" @click="editor?.chain().focus().toggleSuperscript().run()"
                :class="{ 'is-active': editor?.isActive('superscript') }" v-tip="'上标'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M11 7V20H9V7H3V5H15V7H11ZM19.5507 6.5803C19.7042 6.43453 19.8 6.22845 19.8 6C19.8 5.55817 19.4418 5.2 19 5.2C18.5582 5.2 18.2 5.55817 18.2 6C18.2 6.07624 18.2107 6.14999 18.2306 6.21983L17.0765 6.54958C17.0267 6.37497 17 6.1906 17 6C17 4.89543 17.8954 4 19 4C20.1046 4 21 4.89543 21 6C21 6.57273 20.7593 7.08923 20.3735 7.45384L18.7441 9H21V10H17V9L19.5507 6.5803V6.5803Z">
                    </path>
                </svg>
            </button>

            <!-- 下划线 -->
            <button class="my-editor__toolbar--btn" @click="editor?.chain().focus().toggleUnderline().run()"
                :class="{ 'is-active': editor?.isActive('underline') }" v-tip="'下划线'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z">
                    </path>
                </svg>
            </button>

            <!-- 文字颜色 -->
            <button class="my-editor__toolbar--btn" v-tip="'文字颜色'"
                :style="textColor ? { border: '1px solid ' + textColor + ' !important' } : {}">
                <el-color-picker style="opacity: 0;" v-model="textColor" :predefine="predefineTextColors"
                    @change="changeTextColor" />
                <div class="my-editor__toolbar--btn__floating-svg">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        :style="textColor ? { color: textColor + ' !important' } : {}" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M15.2459 14H8.75407L7.15407 18H5L11 3H13L19 18H16.8459L15.2459 14ZM14.4459 12L12 5.88516L9.55407 12H14.4459ZM3 20H21V22H3V20Z">
                        </path>
                    </svg>
                </div>
            </button>

            <!-- 马克笔 -->
            <button class="my-editor__toolbar--btn" v-tip="'马克笔'"
                :style="markColor ? { border: '1px solid ' + markColor + ' !important' } : {}">
                <el-color-picker style="opacity: 0;" v-model="markColor" :predefine="predefineMarkColors" show-alpha
                    @change="changeMarkColor" />
                <div class="my-editor__toolbar--btn__floating-svg">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        :style="markColor ? { color: markColor + ' !important' } : {}" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M15.2427 4.51149L8.50547 11.2487L7.79836 13.37L6.7574 14.411L9.58583 17.2394L10.6268 16.1985L12.7481 15.4913L19.4853 8.75413L15.2427 4.51149ZM21.6066 8.04702C21.9972 8.43755 21.9972 9.07071 21.6066 9.46124L13.8285 17.2394L11.7071 17.9465L10.2929 19.3607C9.90241 19.7513 9.26925 19.7513 8.87872 19.3607L4.63608 15.1181C4.24556 14.7276 4.24556 14.0944 4.63608 13.7039L6.0503 12.2897L6.7574 10.1683L14.5356 2.39017C14.9261 1.99964 15.5593 1.99964 15.9498 2.39017L21.6066 8.04702ZM15.2427 7.33992L16.6569 8.75413L11.7071 13.7039L10.2929 12.2897L15.2427 7.33992ZM4.28253 16.8859L7.11096 19.7143L5.69674 21.1285L1.4541 19.7143L4.28253 16.8859Z">
                        </path>
                    </svg>
                </div>
            </button>

            <!-- 链接 -->
            <button class="my-editor__toolbar--btn" @click="setLink" :class="{ 'is-active': editor?.isActive('link') }"
                v-tip="'超链接'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M17.6567 14.8284L16.2425 13.4142L17.6567 12C19.2188 10.4379 19.2188 7.90524 17.6567 6.34314C16.0946 4.78105 13.5619 4.78105 11.9998 6.34314L10.5856 7.75736L9.17139 6.34314L10.5856 4.92893C12.9287 2.58578 16.7277 2.58578 19.0709 4.92893C21.414 7.27208 21.414 11.0711 19.0709 13.4142L17.6567 14.8284ZM14.8282 17.6569L13.414 19.0711C11.0709 21.4142 7.27189 21.4142 4.92875 19.0711C2.5856 16.7279 2.5856 12.9289 4.92875 10.5858L6.34296 9.17157L7.75717 10.5858L6.34296 12C4.78086 13.5621 4.78086 16.0948 6.34296 17.6569C7.90506 19.2189 10.4377 19.2189 11.9998 17.6569L13.414 16.2426L14.8282 17.6569ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z">
                    </path>
                </svg>
            </button>

            <!-- 代码 -->
            <button class="my-editor__toolbar--btn" @click="editor?.chain().focus().toggleCode().run()"
                :class="{ 'is-active': editor?.isActive('code') }" v-tip="'代码'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M23 12L15.9289 19.0711L14.5147 17.6569L20.1716 12L14.5147 6.34317L15.9289 4.92896L23 12ZM3.82843 12L9.48528 17.6569L8.07107 19.0711L1 12L8.07107 4.92896L9.48528 6.34317L3.82843 12Z">
                    </path>
                </svg>
            </button>
        </div>

        <!-- 选中气泡菜单 -->
        <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
            <div class="my-editor__bubble-menu">
                <my-select :toggle="true" :showIcon="false" class="my-editor__bubble-menu--select" placeholder="请选择标题">
                    <my-select-item v-for="obj in titleOptions" :label="obj.label" :value="obj.value"
                        :onClick="obj.onClick" :key="obj.label"></my-select-item>
                </my-select>

                <!-- 文字颜色 -->
                <button class="my-editor__bubble-menu__btn" v-tip="'文字颜色'"
                    :style="textColor ? { border: '1px solid ' + textColor + ' !important' } : {}">
                    <el-color-picker style="opacity: 0; z-index: 1;" v-model="textColor"
                        :predefine="predefineTextColors" @change="changeTextColor" />
                    <div class="my-editor__bubble-menu__btn__floating-svg">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            :style="textColor ? { color: textColor + ' !important' } : {}" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M15.2459 14H8.75407L7.15407 18H5L11 3H13L19 18H16.8459L15.2459 14ZM14.4459 12L12 5.88516L9.55407 12H14.4459ZM3 20H21V22H3V20Z">
                            </path>
                        </svg>
                    </div>
                </button>

                <!-- 加粗 -->
                <button class="my-editor__bubble-menu__btn" @click="editor?.chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor?.isActive('bold') }" v-tip="'文本加粗'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z">
                        </path>
                    </svg>
                </button>

                <!-- 斜体 -->
                <button class="my-editor__bubble-menu__btn" @click="editor?.chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor?.isActive('italic') }" v-tip="'文本斜体'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"></path>
                    </svg>
                </button>

                <!-- 删除线 -->
                <button class="my-editor__bubble-menu__btn" @click="editor?.chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor?.isActive('strike') }" v-tip="'删除线'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M17.1538 14C17.3846 14.5161 17.5 15.0893 17.5 15.7196C17.5 17.0625 16.9762 18.1116 15.9286 18.867C14.8809 19.6223 13.4335 20 11.5862 20C9.94674 20 8.32335 19.6185 6.71592 18.8555V16.6009C8.23538 17.4783 9.7908 17.917 11.3822 17.917C13.9333 17.917 15.2128 17.1846 15.2208 15.7196C15.2208 15.0939 15.0049 14.5598 14.5731 14.1173C14.5339 14.0772 14.4939 14.0381 14.4531 14H3V12H21V14H17.1538ZM13.076 11H7.62908C7.4566 10.8433 7.29616 10.6692 7.14776 10.4778C6.71592 9.92084 6.5 9.24559 6.5 8.45207C6.5 7.21602 6.96583 6.165 7.89749 5.299C8.82916 4.43299 10.2706 4 12.2219 4C13.6934 4 15.1009 4.32808 16.4444 4.98426V7.13591C15.2448 6.44921 13.9293 6.10587 12.4978 6.10587C10.0187 6.10587 8.77917 6.88793 8.77917 8.45207C8.77917 8.87172 8.99709 9.23796 9.43293 9.55079C9.86878 9.86362 10.4066 10.1135 11.0463 10.3004C11.6665 10.4816 12.3431 10.7148 13.076 11H13.076Z">
                        </path>
                    </svg>
                </button>

                <!-- 下划线 -->
                <button class="my-editor__bubble-menu__btn" @click="editor?.chain().focus().toggleUnderline().run()"
                    :class="{ 'is-active': editor?.isActive('underline') }" v-tip="'下划线'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z">
                        </path>
                    </svg>
                </button>

                <!-- 下标 -->
                <button class="my-editor__bubble-menu__btn" @click="editor?.chain().focus().toggleSubscript().run()"
                    :class="{ 'is-active': editor?.isActive('subscript') }" v-tip="'下标'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M11 6V19H9V6H3V4H17V6H11ZM19.5507 16.5803C19.7042 16.4345 19.8 16.2284 19.8 16C19.8 15.5582 19.4418 15.2 19 15.2C18.5582 15.2 18.2 15.5582 18.2 16C18.2 16.0762 18.2107 16.15 18.2306 16.2198L17.0765 16.5496C17.0267 16.375 17 16.1906 17 16C17 14.8954 17.8954 14 19 14C20.1046 14 21 14.8954 21 16C21 16.5727 20.7593 17.0892 20.3735 17.4538L18.7441 19H21V20H17V19L19.5507 16.5803V16.5803Z">
                        </path>
                    </svg>
                </button>

                <!-- 上标 -->
                <button class="my-editor__bubble-menu__btn" @click="editor?.chain().focus().toggleSuperscript().run()"
                    :class="{ 'is-active': editor?.isActive('superscript') }" v-tip="'上标'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M11 7V20H9V7H3V5H15V7H11ZM19.5507 6.5803C19.7042 6.43453 19.8 6.22845 19.8 6C19.8 5.55817 19.4418 5.2 19 5.2C18.5582 5.2 18.2 5.55817 18.2 6C18.2 6.07624 18.2107 6.14999 18.2306 6.21983L17.0765 6.54958C17.0267 6.37497 17 6.1906 17 6C17 4.89543 17.8954 4 19 4C20.1046 4 21 4.89543 21 6C21 6.57273 20.7593 7.08923 20.3735 7.45384L18.7441 9H21V10H17V9L19.5507 6.5803V6.5803Z">
                        </path>
                    </svg>
                </button>

                <!-- 代码 -->
                <button class="my-editor__bubble-menu__btn" @click="editor?.chain().focus().toggleCode().run()"
                    :class="{ 'is-active': editor?.isActive('code') }" v-tip="'代码'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M23 12L15.9289 19.0711L14.5147 17.6569L20.1716 12L14.5147 6.34317L15.9289 4.92896L23 12ZM3.82843 12L9.48528 17.6569L8.07107 19.0711L1 12L8.07107 4.92896L9.48528 6.34317L3.82843 12Z">
                        </path>
                    </svg>
                </button>

                <!-- 马克笔 -->
                <button class="my-editor__bubble-menu__btn" v-tip="'马克笔'"
                    :style="markColor ? { border: '1px solid ' + markColor + ' !important' } : {}">
                    <el-color-picker style="opacity: 0; z-index: 1;" v-model="markColor"
                        :predefine="predefineMarkColors" show-alpha @change="changeMarkColor" />
                    <div class="my-editor__bubble-menu__btn__floating-svg">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            :style="markColor ? { color: markColor + ' !important' } : {}" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M15.2427 4.51149L8.50547 11.2487L7.79836 13.37L6.7574 14.411L9.58583 17.2394L10.6268 16.1985L12.7481 15.4913L19.4853 8.75413L15.2427 4.51149ZM21.6066 8.04702C21.9972 8.43755 21.9972 9.07071 21.6066 9.46124L13.8285 17.2394L11.7071 17.9465L10.2929 19.3607C9.90241 19.7513 9.26925 19.7513 8.87872 19.3607L4.63608 15.1181C4.24556 14.7276 4.24556 14.0944 4.63608 13.7039L6.0503 12.2897L6.7574 10.1683L14.5356 2.39017C14.9261 1.99964 15.5593 1.99964 15.9498 2.39017L21.6066 8.04702ZM15.2427 7.33992L16.6569 8.75413L11.7071 13.7039L10.2929 12.2897L15.2427 7.33992ZM4.28253 16.8859L7.11096 19.7143L5.69674 21.1285L1.4541 19.7143L4.28253 16.8859Z">
                            </path>
                        </svg>
                    </div>
                </button>
            </div>
        </bubble-menu>

        <!-- 编辑器 -->
        <div class="my-editor__editor-container" :class="{ 'my-editor__editor-container--disable': !props.editable }">
            <editor-content :editor="editor" class="my-editor__editor-container__content" />

            <!-- 表格悬浮菜单 -->
            <transition name="fade-show">
                <div class="floating-table-menu" :class="['floating-table-menu__arrow-' + tableMenuArrowDirection]"
                    v-if="tableMenuVisible" ref="tableMenuRef"
                    :style="{ top: tableMenuTop + 'px', left: tableMenuLeft + 'px' }">
                    <!-- 多选按钮容器 -->
                    <!-- 处理行 -->
                    <div class="floating-table-menu__select-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M4 8H20V5H4V8ZM14 19V10H10V19H14ZM16 19H20V10H16V19ZM8 19V10H4V19H8ZM3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z">
                            </path>
                        </svg>

                        <!-- 选项容器 -->
                        <div class="floating-table-menu__select-btn__option-container">
                            <div class="floating-table-menu__select-btn__option-container__container">
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().toggleHeaderRow().run()">切换标头行
                                </div>
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().addRowBefore().run()">向上新增行
                                </div>
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().addRowAfter().run()">向下新增行
                                </div>
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().deleteRow().run()">删除当前行
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 处理列 -->
                    <div class="floating-table-menu__select-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M3 3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H3ZM8 5V8H4V5H8ZM4 14V10H8V14H4ZM4 16H8V19H4V16ZM10 16H20V19H10V16ZM20 14H10V10H20V14ZM20 5V8H10V5H20Z">
                            </path>
                        </svg>

                        <!-- 选项容器 -->
                        <div class="floating-table-menu__select-btn__option-container">
                            <div class="floating-table-menu__select-btn__option-container__container">
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().toggleHeaderColumn().run()">切换标头列
                                </div>
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().addColumnBefore().run()">向前新增列
                                </div>
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().addColumnAfter().run()">向后新增列
                                </div>
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().deleteColumn().run()">删除当前列
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 处理单元格 -->
                    <div class="floating-table-menu__select-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M13 10V14H19V10H13ZM11 10H5V14H11V10ZM13 19H19V16H13V19ZM11 19V16H5V19H11ZM13 5V8H19V5H13ZM11 5H5V8H11V5ZM4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3Z">
                            </path>
                        </svg>

                        <!-- 选项容器 -->
                        <div class="floating-table-menu__select-btn__option-container">
                            <div class="floating-table-menu__select-btn__option-container__container">
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().toggleHeaderCell().run()">切换标头单元格
                                </div>
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().mergeCells().run()">合并单元格
                                </div>
                                <div class="floating-table-menu__select-btn__option-container__container--option"
                                    @click="editor?.chain().focus().splitCell().run()">拆分单元格
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 删除单元格 -->
                    <div class="floating-table-menu__select-btn" v-tip="'删除表格'"
                        @click="editor?.chain().focus().deleteTable().run()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z">
                            </path>
                        </svg>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts" name="MyEditor">
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Details from '@tiptap/extension-details'
import DetailsContent from '@tiptap/extension-details-content'
import DetailsSummary from '@tiptap/extension-details-summary'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import ImageResize from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
// 引入自定义扩展
import { CodeBlockWithLang } from './extensions/CodeBlockShikiLight/index'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

// 引入选择组件
import MySelect from '@/components/MySelect/index.vue'
import MySelectItem from '@/components/MySelect/MySelectItem/index.vue'
import { toast } from '../MyToast/toast'

const props = withDefaults(defineProps<{
    modelValue: string | object,
    contentType?: 'html' | 'json',
    editable?: true | false,  // 是否编辑
    uplodeImageApi?: (image: File) => Promise<string>,  // 上传图片的 api
}>(), {
    contentType: 'json',
    editable: true
})
const emits = defineEmits(['update:modelValue', 'update:toc'])

// 初始化编辑器
const editor = useEditor({
    editable: props.editable,
    content: props.modelValue ?? '',
    extensions: [
        StarterKit.configure({
            codeBlock: false, // 禁用默认 CodeBlock
        }),
        CodeBlockWithLang,
        Details.configure({
            persist: true,
            HTMLAttributes: {
                class: 'details',
            },
        }),
        DetailsSummary,
        DetailsContent,
        ImageResize,
        Placeholder.configure({
            includeChildren: true,
            placeholder: ({ node }) => {
                if (node.type.name === 'detailsSummary') {
                    return 'Summary'
                }

                return ''
            },
        }),
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Link.configure({
            openOnClick: false,
            defaultProtocol: 'https',
        }),
        Subscript,
        Superscript,
        Underline,
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
    ],
    editorProps: {
        attributes: {
            class: 'my-editor__editor-area',
            spellcheck: 'false',  // 示例：关闭拼写检查
        },
        handleDrop(_view, event, _slice, _moved) {
            const files = Array.from(event.dataTransfer?.files || [])

            // 如果包含图片文件
            const imageFiles = files.filter(file => file.type.startsWith('image/'))
            if (imageFiles.length > 0) {
                event.preventDefault()  // ✅ 阻止浏览器打开图片

                handleUpdateImages(imageFiles)
                return true // ✅ 告诉 Tiptap 你已经处理了 drop
            }

            return false
        },
        handlePaste(_view, event, _slice) {
            const items = Array.from(event.clipboardData?.items || [])
            const files = items
                .filter(item => item.kind === 'file')
                .map(item => item.getAsFile())
                .filter(file => file !== null) as File[]

            if (files.length > 0) {
                event.preventDefault()
                handleUpdateImages(files)
                return true
            }

            return false
        },
    },
    onUpdate: ({ editor }) => {
        if (props.editable) {
            const content = props.contentType === 'json'
                ? editor.getJSON()
                : editor.getHTML()

            emits('update:modelValue', content)
        }

        generateTOC()
    },
})

// 超链接
function setLink() {
    if (editor.value?.isActive('link')) {
        editor.value?.chain().focus().unsetLink().run()

        return
    }

    const previousUrl = editor.value?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
        return
    }

    // empty
    if (url === '') {
        editor.value?.chain()
            .focus()
            .extendMarkRange('link')
            .unsetLink()
            .run()

        return
    }

    // update link
    editor.value?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
}

// 改变文字颜色
const textColor = ref('')
watch(() => textColor.value, (newValue) => {
    if (!newValue) {
        editor.value?.chain().focus().unsetColor().run()

        return
    }

    // editor.value?.chain().focus().setColor(newValue).run()d
})
const changeTextColor = (value: string) => {
    editor.value?.chain().focus().setColor(value).run()
}
// 预定颜色
const predefineTextColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
])

// 改变马克笔颜色
const markColor = ref('')
watch(() => markColor.value, (newValue) => {
    if (!newValue) {
        editor.value?.chain().focus().unsetHighlight().run()

        return
    }

    // editor.value?.chain().focus().toggleHighlight({ color: newValue }).run()
})
const changeMarkColor = (value: string) => {
    editor.value?.chain().focus().toggleHighlight({ color: value }).run()
}
// 预定颜色
const predefineMarkColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
])

// 处理上传的文本
watch(() => props.modelValue, (newValue) => {
    if (!editor.value) {
        return
    }

    const current = props.contentType === 'json'
        ? editor.value.getJSON()
        : editor.value.getHTML()

    if (JSON.stringify(current) !== JSON.stringify(newValue)) {
        editor.value.commands.setContent(newValue)
    }
})

onMounted(() => {
    // ========= 表格悬浮菜单 =========

    editorContentContainerRef.value = editor.value?.view.dom as HTMLElement

    editor.value?.on('selectionUpdate', () => {
        // 更新表格悬浮菜单位置
        updateTableMenuPosition()
    })
    editor.value?.on('transaction', () => {
        // 更新表格悬浮菜单位置
        updateTableMenuPosition()
    })

    editorContentContainerRef.value?.addEventListener('scroll', () => {
        // 编辑器容器滚动时更新表格悬浮菜单位置
        updateTableMenuPosition()
    })

    window.addEventListener('resize', () => {
        // 窗口大小变化时更新表格悬浮菜单位置
        updateTableMenuPosition()
    })

    // ========= 表格悬浮菜单 =========

    // ==================== 可能错误提示 ==========================

    if (props.editable && !props.uplodeImageApi) {
        console.log('在编辑模式，但是没有上传处理图片上传api');
    }

    // ==================== 可能错误提示 ==========================

    // ====== 生成目录 ======

    generateTOC()

    // ====== 生成目录 ======
})

onUnmounted(() => {
    editor.value?.destroy()  // 销毁编辑器实例
})

// 运用自定义代码块
const toggleCodeBlock = () => {
    if (!editor.value) return  // 重要！

    const isCode = editor.value.isActive('codeBlockWithLang')

    if (isCode) {
        editor.value.chain().focus().setNode('paragraph').run()
    } else {
        editor.value.chain().focus().setNode('codeBlockWithLang').run()
    }
}

// 标题选项
const titleOptions = [
    {
        label: '正标题', value: '标题1', onClick: () => {
            editor.value?.chain().focus().toggleHeading({ level: 1 }).run()
        }
    },
    {
        label: '标题1', value: '标题2', onClick: () => {
            editor.value?.chain().focus().toggleHeading({ level: 2 }).run()
        }
    },
    {
        label: '标题2', value: '标题3', onClick: () => {
            editor.value?.chain().focus().toggleHeading({ level: 3 }).run()
        }
    },
    {
        label: '标题3', value: '标题4', onClick: () => {
            editor.value?.chain().focus().toggleHeading({ level: 4 }).run()
        }
    },
    {
        label: '标题4', value: '标题5', onClick: () => {
            editor.value?.chain().focus().toggleHeading({ level: 5 }).run()
        }
    },
    {
        label: '标题5', value: '标题6', onClick: () => {
            editor.value?.chain().focus().toggleHeading({ level: 6 }).run()
        }
    },
]

// ============================== 表格悬浮菜单 ==============================

// 表格悬浮菜单是否打开
const tableMenuVisible = ref(false)

// 表格悬浮菜单元素
const tableMenuRef = ref<HTMLElement | null>(null)

// 编辑器输入区域容器
const editorContainer = ref<HTMLElement | null>(null)

// 编辑器内容容器
const editorContentContainerRef = ref<HTMLElement | null>(null)

// 当前菜单的三角框朝向
const tableMenuArrowDirection = ref<'top' | 'bottom'>('bottom')

// 当前菜单顶部位置
const tableMenuTop = ref(0)
// 当前菜单左侧位置
const tableMenuLeft = ref(0)

// 更新表格悬浮菜单位置
const updateTableMenuPosition = async () => {
    // 如果是只读模式不开
    if (!props.editable) return

    if (!editor.value || !editorContentContainerRef.value) return;

    // 获取编辑器的状态以及视图
    const { state, view } = editor.value

    // 获取当前选区的起始位置
    const { from } = state.selection

    // 判断是否在表格内
    if (!editor.value.isActive('table')) {
        tableMenuVisible.value = false
        return
    }

    // 激活菜单显示
    tableMenuVisible.value = true

    await nextTick(() => { })  // 确保 DOM 更新完成

    if (!tableMenuRef.value) return

    // 获取当前选区的节点
    let el = view.domAtPos(from).node as HTMLElement

    // 找到最近的table
    while (el && el.nodeName !== 'TABLE') {
        el = el.parentNode as HTMLElement
    }

    // 没有找到表格元素
    if (!el) {
        tableMenuVisible.value = false
        return
    }

    // 获取表格当前的位置
    const rect = el.getBoundingClientRect()

    if (!rect) {
        tableMenuVisible.value = false
        return
    }

    // 获取当前菜单的高度
    const menuHeight = tableMenuRef.value?.offsetHeight || 0

    // 菜单和表格间隔的距离
    const gap = 10

    // 计算表格下方的位置
    const spaceBelow = window.innerHeight - rect.bottom - gap
    // 计算表格上方的位置
    const spaceAbove = rect.top - gap

    const ce = document.querySelector('.my-editor__editor-container')
    if (!ce) return
    const ceRect = ce.getBoundingClientRect()

    if (menuHeight < spaceBelow) {
        // 如果下方空间足够，则显示在下方
        tableMenuTop.value = rect.bottom - ceRect.top + gap

        tableMenuArrowDirection.value = 'bottom'  // 设置箭头朝下

    } else if (menuHeight < spaceAbove) {
        // 如果上方空间足够，则显示在上方
        tableMenuTop.value = rect.top - menuHeight - ceRect.top - gap

        tableMenuArrowDirection.value = 'top'  // 设置箭头朝上
    } else {
        // 如果上下空间都不够，默认显示在下方
        tableMenuTop.value = rect.bottom - ceRect.top + gap

        tableMenuArrowDirection.value = 'bottom'  // 设置箭头朝下
    }

    // 获取表格宽度
    const tableWidth = rect.width

    // 获取菜单宽度
    const menuWidth = tableMenuRef.value?.offsetWidth || 150  // 默认宽度150px，防止菜单没渲染

    // 计算让菜单水平居中于表格
    // 表格左边距离 + 表格宽度的一半 - 菜单宽度的一半
    tableMenuLeft.value = rect.left - ceRect.left + editorContentContainerRef.value.scrollLeft + (tableWidth / 2) - (menuWidth / 2)
}

// ============================== 表格悬浮菜单 ==============================

// =============================================== 上传图片 ===============================================

// 点击上传图片
const clickUpdateImage = () => {
    // 创建input元素
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'  // 限制只能选择图片
    input.style.display = 'none'  // 隐藏input元素
    document.body.appendChild(input)
    input.click()  // 模拟点击input元素

    input.onchange = async (event: Event) => {
        // 获取选择的文件
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file) {
            toast({
                message: '未获取图片',
                type: 'error'
            })
            return
        }

        if (!props.uplodeImageApi) {
            return console.log('未提供上传图片函数');
        }

        if (!editor.value) return

        const image_url = await props.uplodeImageApi(file)

        if (image_url) {
            editor.value.chain().focus().setImage({ src: image_url }).run()
        }

        document.body.removeChild(input)  // 点击后移除input元素
    }
}

// 处理复制或者拖动移入图片上传
const handleUpdateImages = (images: Array<File>) => {
    let index = 0

    images.forEach(async (image) => {
        if (!props.uplodeImageApi) {
            return console.log('未提供上传图片函数');
        }
        if (!editor.value) return

        if (!image.type.startsWith('image/')) return

        // 上传图片
        const image_url = await props.uplodeImageApi(image)

        if (image_url) {
            index++

            if (index < images.length) {
                editor.value
                    .chain()
                    .focus()
                    .insertContent([
                        {
                            type: 'image',
                            attrs: { src: image_url },
                        },
                        {
                            type: 'paragraph',
                        },
                    ])
                    .run()
            } else {
                editor.value.chain().focus().setImage({ src: image_url }).run()
            }
        }
    })
}

// =============================================== 上传图片 ===============================================

// ============== 右侧目录 ==============

// 存放目录
// const toc = ref<{ id: string, level: number, content: string }[]>([])

// 生成目录
const generateTOC = (): { id: string, level: number, content: string }[] => {
    if (!editor.value) return []

    const headings: { id: string, level: number, content: string }[] = []

    nextTick(() => {
        editor.value?.state.doc.descendants((node, pos) => {
            if (node.type.name === 'heading' && node.attrs.level > 1) {
                const id = `heading-${pos}`
                const dom = editor.value?.view.nodeDOM(pos) as HTMLElement
                if (dom) {
                    dom.id = id
                    dom.classList.add('article')
                }
                headings.push({
                    id,
                    content: node.textContent || '',
                    level: node.attrs.level,
                })
            }
        })
        emits('update:toc', headings)
    })

    return headings
}


watch(
    () => props.modelValue,
    () => {
        if (props.editable === false) {
            const tocValue = generateTOC()
            emits('update:toc', tocValue)
        }
    },
    { immediate: true }
)

// ============== 右侧目录 ==============
</script>

<style scoped lang="scss">
.fade-show-enter-active {
    animation: bounceIn 0.5s;
}

.fade-show-leave-active {
    animation: bounceOut 0.3s;
}


.my-editor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    // 顶部工具栏
    .my-editor__toolbar {
        position: sticky;
        top: 0;
        z-index: 1;
        flex-shrink: 0;
        padding: 7px;
        border: 1px solid var(--border-color-gray-dark);
        display: flex;
        gap: 12px;
        transition: all var(--transition-duration-default);
        background-color: var(--background-color-white-transparent);
        backdrop-filter: blur(10px);

        &:hover {
            border: 1px solid var(--primary-color-100);
        }

        // 被选中
        .is-active {
            border: solid 1px var(--primary-color-100) !important;

            svg {
                color: var(--text-color-primary) !important;
            }
        }

        // 按钮项
        .my-editor__toolbar--btn {
            position: relative;
            width: 26px;
            height: 26px;
            border: 1px solid var(--border-color-gray-dark);
            border-radius: 3px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all var(--transition-duration-default);
            background-color: transparent;
            padding: 3px;

            &:disabled {
                cursor: not-allowed;
                opacity: 0.7;
            }

            &:hover {
                border: solid 1px var(--primary-color-100);
                transform: scale(.95);

                svg {
                    color: var(--text-color-primary);
                }
            }

            &:active {
                transform: scale(1);
            }

            svg {
                width: 20px;
                height: 20px;
                color: var(--text-color-gray-default);
                transition: all var(--transition-duration-default);
            }

            // 悬浮svg
            .my-editor__toolbar--btn__floating-svg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                user-select: none;
                z-index: -1;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        // 选择按钮项
        .my-editor__toolbar--select {
            max-width: 200px;
            min-width: 100px;
            height: 26px;
            font-size: 13px;

            :deep(.my-select__select-display) {
                border: 1px solid var(--border-color-gray-dark);
                color: var(--text-color-gray-default);

                &:hover {
                    border: solid 1px var(--primary-color-100);
                    color: var(--text-color-primary);
                }
            }

            :deep(.my-select__select-display--focused) {
                color: var(--text-color-primary);
                border: solid 1px var(--primary-color-100);
            }
        }
    }

    // 选中气泡菜单
    .my-editor__bubble-menu {
        display: flex;
        align-items: center;
        gap: 8px;

        // 被选中
        .is-active {
            background-color: rgb(77, 77, 77) !important;

            svg {
                color: var(--text-color-primary) !important;
            }
        }

        // 按钮项
        .my-editor__bubble-menu__btn {
            position: relative;
            width: 22px;
            height: 22px;
            border-radius: 5px;
            background-color: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border: none;
            padding: 1px;
            box-sizing: border-box;
            transition: all var(--transition-duration-default);

            &:hover {
                background-color: rgb(77, 77, 77);

                svg {
                    color: var(--text-color-primary);
                }
            }

            svg {
                width: 100%;
                height: 100%;
                color: white;
            }

            .my-editor__bubble-menu__btn__floating-svg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                user-select: none;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1px;
                box-sizing: border-box;
            }
        }

        // 选择按钮项
        .my-editor__bubble-menu--select {
            width: auto;
            height: 20px;
            font-size: 13px;

            :deep(.my-select__select-display) {
                border: none;
                color: white;
                padding-left: 0;

                &:hover {
                    border: none;
                    color: var(--text-color-primary);
                }
            }

            :deep(.my-select__select-display--focused) {
                color: var(--text-color-primary);
                border: none;
            }
        }
    }

    // 编辑器外层容器
    .my-editor__editor-container {
        position: relative;
        flex: 1;
        box-sizing: border-box;
        overflow: hidden;
        height: 100%;
        border: 1px solid var(--border-color-gray-dark);
        transition: all var(--transition-duration-default);

        &:focus-within {
            border: 1px solid var(--primary-color-100);
        }

        .my-editor__editor-container__content {
            height: 100%;
            box-sizing: border-box;

            // 编辑器区域
            :deep(.my-editor__editor-area) {
                height: 100%;
                min-height: 300px;
                box-sizing: border-box;
                overflow-y: auto;
                padding: 15px;
                position: relative;

                &:focus {
                    outline: none;
                }
            }
        }

        // 浮动表格菜单
        .floating-table-menu {
            position: absolute;
            display: flex;
            box-shadow: 0 0 15px rgba(48, 48, 48, 0.365);
            padding: 6px;
            gap: 6px;
            border-radius: 4px;
            user-select: none;
            background-color: var(--background-color-white);
            z-index: 1000;

            // 多选按钮容器
            .floating-table-menu__select-btn {
                position: relative;
                width: 26px;
                height: 26px;
                border: 1px solid var(--border-color-gray-dark);
                border-radius: 3px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all var(--transition-duration-default);
                background-color: transparent;
                padding: 2px;
                box-sizing: border-box;

                &:hover {
                    border: solid 1px var(--primary-color-100);

                    svg {
                        color: var(--text-color-primary);
                    }

                    .floating-table-menu__select-btn__option-container {
                        display: block;
                    }
                }

                svg {
                    width: 100%;
                    height: 100%;
                    color: var(--text-color-gray-light);
                    transition: all var(--transition-duration-default);
                }

                // 选项容器
                .floating-table-menu__select-btn__option-container {
                    position: absolute;
                    top: 0;
                    transform: translateY(-100%);
                    padding: 10px;
                    width: 170px;
                    z-index: 1;
                    display: none;
                    animation: fadeIn 0.3s ease-in-out;

                    .floating-table-menu__select-btn__option-container__container {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        box-sizing: border-box;
                        background-color: var(--background-color-black-default);
                        padding: 5px;
                        box-shadow: 0 0 10px rgba(48, 48, 48, 0.365);
                        border-radius: 5px;
                        color: var(--background-color-white);

                        &--option {
                            width: 100%;
                            font-size: 15px;
                            transition: all var(--transition-duration-default);
                            box-sizing: border-box;
                            padding: 6px;
                            border-radius: 5px;

                            &:hover {
                                background-color: var(--background-color-black-deep);
                                color: var(--text-color-primary-light-more);
                            }
                        }
                    }
                }

            }

            &__arrow-bottom::before {
                content: '';
                position: absolute;
                top: -8px;
                /* 箭头位于 popover 外面一点 */
                left: 50%;
                transform: translateX(-50%);

                /* 构造一个向下的箭头 */
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid var(--background-color-white);

                /* 添加边框，使箭头边和 popover 边框连贯 */
                z-index: 1;
            }

            &__arrow-top::before {
                content: '';
                position: absolute;
                bottom: -8px;
                /* 箭头位于 popover 外面一点 */
                left: 50%;
                transform: translateX(-50%);

                /* 构造一个向下的箭头 */
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid var(--background-color-white);

                /* 添加边框，使箭头边和 popover 边框连贯 */
                z-index: 1;
            }
        }
    }

    // 编辑器只读
    .my-editor__editor-container--disable {
        border: none;
    }
}
</style>