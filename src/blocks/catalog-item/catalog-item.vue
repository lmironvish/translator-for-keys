<template>
    <div class="catalog-item">
        <component v-bind="componentBind" class="catalog-item__image-area">
            <div class="catalog-item__card" :style="{ backgroundImage: backgroundStyle }">
                <div :class="getBemClass('catalog-item__content', { size })">
                    <div :class="getBemClass('catalog-item__title', { size })" v-html="title"></div>
                    <div v-if="subtitle" class="catalog-item__subtitle" v-html="subtitle"></div>
                    <img
                        v-if="brand"
                        :src="createStaticUrl(brandBind)"
                        :class="getBemClass('catalog-item__logotype', { size })"
                    >
                    <div v-if="time" class="catalog-item__time">{{ time }}</div>
                    <div
                        v-if="disabled || withEye"
                        :class="getBemClass('catalog-item__status', { lock: disabled, eye: withEye })"
                    >
                        <div :class="getBemClass('catalog-item__status-icon', { lock: disabled, eye: withEye })"></div>
                    </div>
                    <div v-if="disableTooltip && disabled" class="catalog-item__lock-tooltip">
                        <div class="catalog-item__lock-tooltip-title">{{ disableTooltip.title }}</div>
                        <div class="catalog-item__lock-tooltip-text">{{ disableTooltip.text }}</div>
                    </div>
                    <div class="catalog-item__left-top">
                        <slot name="left-top"/>
                    </div>
                </div>
            </div>
        </component>
        <div v-if="text" class="catalog-item__text">{{ text }}</div>
    </div>
</template>

<script>
export default {
    props: {
        imageUrl: String,
        title: String,
        subtitle: String,
        brand: String,
        route: Object,
        size: String,
        text: String,
        disabled: Boolean,
        withEye: Boolean,
        disableTooltip: Object,
        withoutGradient: Boolean,
        time: String,
        type: String
    },
    computed: {
        componentBind() {
            if (this.route && !this.disabled) {
                return {
                    is: 'router-link',
                    to: this.route,
                }
            }
            return {
                is: 'div',
            };
        },
        backgroundStyle() {
            const result = [];
            if (!this.withoutGradient) {
                result.push('linear-gradient(0deg, #000000, rgba(0, 0, 0, 0))');
            }
            result.push(`url(${ this.imageUrl })`);
            return result.join(', ');
        },
        brandBind() {
             switch (this.brand) {
                case "skp":
                    return this.type === "video" || this.type === "media"
                        ? "images/skp-logo-black.png"
                        : "images/skp-logo-white.png";
                case "indola":
                    return "images/indola-logo.svg";
                case "abc":
                    return "images/ABC-logo-white.png";
                case "stmnt":
                    return "images/STMNT-logo-white.png";
            }
        }
    },
}
</script>

<style src="./catalog-item.less" lang="less"/>
