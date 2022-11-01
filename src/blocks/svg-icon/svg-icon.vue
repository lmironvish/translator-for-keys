<template>
    <svg class="svg-icon" :fill="fill" :stroke="stroke">
        <use :xlink:href="`#${name}`"></use>
    </svg>
</template>

<script>
    export default {
        props: {
            name: String,
            fill: String,
            stroke: String,
        },
    }
</script>

<style src="./svg-icon.less" lang="less"/>
