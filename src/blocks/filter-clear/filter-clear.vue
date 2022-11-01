<template>
    <button
        class="filter-clear"
        type="button"
        aria-label="Очистить фильтр"
        tabindex="-1"
        :disabled="disabled"
        @click="$emit('clear')"
    ></button>
</template>

<script>
export default {
    name: 'FilterClear',
    inheritAttrs: false,
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style src="./filter-clear.less" lang="less"/>
