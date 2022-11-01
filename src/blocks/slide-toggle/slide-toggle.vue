<template>
    <component
        :is="group ? 'transition-group' : 'transition'"
        v-bind="$attrs"
        class="slide-toggle"
        name="slide-toggle"
        @enter="extend"
        @after-enter="onAfterEnter"
        @before-leave="extend"
        @after-leave="onAfterLeave"
    >
        <slot />
    </component>
</template>

<script>
export default {
    name: 'AppSlideToggle',
    inheritAttrs: false,
    props: {
        group: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        extend(el) {
            el.style.height = `${el.scrollHeight}px`;
        },
        reset(el) {
            el.style.height = '';
        },
        onAfterEnter(el) {
            this.reset(el);
            this.$emit('extended');
        },
        onAfterLeave(el) {
            this.reset(el);
            this.$emit('collapsed');
        },
    },
};
</script>

<style src="./slide-toggle.less" lang="less" />
