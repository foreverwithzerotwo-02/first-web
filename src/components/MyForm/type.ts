// 表单验证类型
export interface FormRule {
    required?: Boolean,
    message?: string,
    min?: number,
    max?: number,
    trigger?: 'blur' | 'change',
}
export type FormRules = FormRule[]
export type FormRuleMap = Record<string, FormRule[]>

// 表单子组件注册类型
export interface FormContext {
    registerFormItem: (name: string, validateFn: () => Promise<boolean>) => void,
    deleteRegisterFormItem: (name: string) => void
}