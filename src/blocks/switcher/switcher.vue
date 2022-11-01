<template>
    <div :class="getBemClass('switcher', { on: value })" @click="$emit('input', !value)">
        <div class="switcher__handle"></div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Boolean,
                default: false,
            },
        },
    }
</script>

<style src="./switcher.less" lang="less"/>
