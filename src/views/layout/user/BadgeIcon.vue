<!-- BadgeIcon.vue -->
<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'bronze' | 'silver' | 'gold' | 'diamond' | 'crown';
const props = defineProps<{ variant: Variant; size?: number }>();
const sizePx = computed(() => (props.size ?? 64) + 'px');
</script>

<template>
    <!-- 青铜（Bronze） -->
    <svg v-if="variant === 'bronze'" :width="sizePx" :height="sizePx" viewBox="0 0 64 64" fill="none"
        aria-label="Bronze badge">
        <defs>
            <linearGradient id="br-metal" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stop-color="#C9833A" />
                <stop offset="1" stop-color="#8A5424" />
            </linearGradient>
            <radialGradient id="br-gloss" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                :gradientTransform="'translate(22 20) rotate(45) scale(28)'">
                <stop stop-color="#FFFFFF" stop-opacity="0.55" />
                <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
            </radialGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.18" />
            </filter>
        </defs>
        <!-- ribbon -->
        <path d="M20 54l6-8 6 4 6-4 6 8-9-2-3 4-3-4-9 2z" fill="#7A4B22" opacity=".9" filter="url(#softShadow)" />
        <!-- medal body -->
        <circle cx="32" cy="28" r="18" fill="url(#br-metal)" filter="url(#softShadow)" />
        <circle cx="32" cy="28" r="14" fill="url(#br-gloss)" />
        <!-- star -->
        <path d="M32 19l2.6 6.2 6.7.6-5.1 4.3 1.6 6.6L32 34l-5.8 2.7 1.6-6.6-5.1-4.3 6.7-.6L32 19z" fill="#F2D2A6" />
    </svg>

    <!-- 白银（Silver） -->
    <svg v-else-if="variant === 'silver'" :width="sizePx" :height="sizePx" viewBox="0 0 64 64" fill="none"
        aria-label="Silver badge">
        <defs>
            <linearGradient id="sv-metal" x1="0" y1="0" x2="64" y2="64">
                <stop stop-color="#E6E9EF" />
                <stop offset="1" stop-color="#A9B2C1" />
            </linearGradient>
            <radialGradient id="sv-gloss" cx="0" cy="0" r="1"
                :gradientTransform="'translate(22 20) rotate(45) scale(28)'">
                <stop stop-color="#FFFFFF" stop-opacity="0.6" />
                <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
            </radialGradient>
            <filter id="softShadow2" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.16" />
            </filter>
        </defs>
        <!-- ribbon -->
        <path d="M20 54l6-8 6 4 6-4 6 8-9-2-3 4-3-4-9 2z" fill="#8F97A6" opacity=".9" filter="url(#softShadow2)" />
        <!-- medal body -->
        <circle cx="32" cy="28" r="18" fill="url(#sv-metal)" filter="url(#softShadow2)" />
        <circle cx="32" cy="28" r="14" fill="url(#sv-gloss)" />
        <!-- laurel -->
        <path d="M22 28c0 4 3 8 7 9M42 28c0 4-3 8-7 9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"
            opacity=".85" />
    </svg>

    <!-- 黄金（Gold） -->
    <svg v-else-if="variant === 'gold'" :width="sizePx" :height="sizePx" viewBox="0 0 64 64" fill="none"
        aria-label="Gold badge">
        <defs>
            <linearGradient id="gd-metal" x1="6" y1="6" x2="58" y2="58">
                <stop stop-color="#FFD76A" />
                <stop offset="1" stop-color="#E5A300" />
            </linearGradient>
            <radialGradient id="gd-glow" cx="0" cy="0" r="1" :gradientTransform="'translate(32 28) scale(20)'">
                <stop stop-color="#FFF3B0" stop-opacity=".9" />
                <stop offset="1" stop-color="#FFF3B0" stop-opacity="0" />
            </radialGradient>
            <filter id="softShadow3" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2" />
            </filter>
        </defs>
        <!-- ribbon -->
        <path d="M20 54l6-8 6 4 6-4 6 8-9-2-3 4-3-4-9 2z" fill="#C18400" opacity=".95" filter="url(#softShadow3)" />
        <!-- medal body -->
        <circle cx="32" cy="28" r="18" fill="url(#gd-metal)" filter="url(#softShadow3)" />
        <circle cx="32" cy="28" r="16" fill="url(#gd-glow)" />
        <!-- star -->
        <path d="M32 17l3.2 7.4 8 .7-6.1 5.2 2 7.8-7.1-3.6-7.1 3.6 2-7.8-6.1-5.2 8-.7L32 17z" fill="#FFF2C7" />
    </svg>

    <!-- 钻石（Diamond） -->
    <svg v-else-if="variant === 'diamond'" :width="sizePx" :height="sizePx" viewBox="0 0 64 64" fill="none"
        aria-label="Diamond badge">
        <defs>
            <linearGradient id="dm-blue" x1="12" y1="12" x2="52" y2="52">
                <stop stop-color="#9AE8FF" />
                <stop offset="1" stop-color="#35B7FF" />
            </linearGradient>
            <filter id="softShadow4" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.18" />
            </filter>
        </defs>
        <!-- gem -->
        <path d="M16 26l8-10h16l8 10-16 22L16 26z" fill="url(#dm-blue)" filter="url(#softShadow4)" />
        <path d="M24 16l8 10 8-10M16 26h32M32 48V26" stroke="#FFFFFF" stroke-opacity=".8" stroke-linecap="round" />
        <!-- sparkles -->
        <path d="M48 16l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5 1.5-3.5z" fill="#E9FBFF" />
    </svg>

    <!-- 王者（Crown） -->
    <svg v-else :width="sizePx" :height="sizePx" viewBox="0 0 64 64" fill="none" aria-label="Crown badge">
        <defs>
            <linearGradient id="cr-gold" x1="8" y1="8" x2="56" y2="56">
                <stop stop-color="#FFE37A" />
                <stop offset="1" stop-color="#F3B10C" />
            </linearGradient>
            <filter id="softShadow5" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.2" />
            </filter>
        </defs>
        <path d="M10 46l4-20 12 10 6-16 6 16 12-10 4 20H10z" fill="url(#cr-gold)" filter="url(#softShadow5)" />
        <rect x="10" y="46" width="44" height="6" rx="2" fill="#E2A300" />
        <circle cx="20" cy="24" r="3" fill="#FF6EA7" />
        <circle cx="32" cy="20" r="3" fill="#7CFB9F" />
        <circle cx="44" cy="24" r="3" fill="#83B6FF" />
    </svg>
</template>
