<template>
    <div class="range-input">
        <filter-input
            class="range-input__min"
            :field="min"
            :has-error="hasError"
            @input="update($event.value, 'min')"
        />
        <div class="range-input__dash"></div>
        <filter-input
            class="range-input__max"
            :field="max"
            :has-error="hasError"
            @input="update($event.value, 'max')"
        />
    </div>
</template>

<script>
    import FilterInput from '../filter-input';

    export default {
        name: 'RangeInput',
        inheritAttrs: false,
        props: {
            code: {
                type: String,
                default: '',
            },
            min: {
                type: Object,
                default: () => {
                    return {
                        code: '',
                        type: 'number',
                        value: 5,
                        placeholder: '',
                    };
                },
            },
            max: {
                type: Object,
                default: () => {
                    return {
                        code: '',
                        type: 'number',
                        value: null,
                        placeholder: '',
                    };
                },
            },
            hasError: Boolean,
        },
        components: {
            FilterInput,
        },
        methods: {
            update(value, param) {
                this[param].value = value;
                this.$emit('input', { value: [this.min.value, this.max.value], code: this.code });
            },
        },
    };
</script>

<style src="./range-input.less" lang="less"/>
