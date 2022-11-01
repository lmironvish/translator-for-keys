<template>
    <div :class="getBemClass('checkbox', { checked: internalValue })">
        <div :class="getBemClass('checkbox__marker', {disabled})" @click="!disabled && $emit('input', !internalValue)"></div>
        <div :class="getBemClass('checkbox__label', {disabled})" @click="!disabled && $emit('input', !internalValue)">
            <slot>{{ field ? field.label : '' }}</slot>
        </div>
    </div>
</template>

<script>
    export default {
        inheritAttrs: false,
        props: {
            value: {
                type: Boolean,
                default: false
            },
            field: Object,
            disabled: Boolean,
        },
        computed: {
            internalValue() {
                return this.field ? this.field.value : this.value;
            }
        }
    }
</script>

<style src="./checkbox.less" lang="less"/>
