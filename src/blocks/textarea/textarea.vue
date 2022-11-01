<template>
    <textarea
        class="textarea"
        :class="classes"
        v-model="field.value"
        :height="field.height"
        :placeholder="field.langKeyPlaceholder ? $t(`global.${field.langKeyPlaceholder}`) : field.placeholder || false"
        :disabled="field.disabled"
        @input="handleInput($event, field.code)"
    ></textarea>
</template>

<script>
export default {
    name: 'Textarea',
    inheritAttrs: false,
    props: {
        field: {
            type: Object,
            default: () => {},
        },
        hasError: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        classes() {
            const classes = [];
            if (this.hasError) classes.push('textarea_error');
            return classes;
        },
    },
    methods: {
        handleInput(event, code) {
            this.$emit('input', { value: event.target.value, code });
        },
    },
};
</script>

<style src="./textarea.less" lang="less"/>
