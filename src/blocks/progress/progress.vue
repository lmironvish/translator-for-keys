<template>
    <div class="progress">
        <div class="progress__value" :style="{ width: normalizedValue * 100 + '%' }"></div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Number,
                default: 0,
            }
        },
        computed: {
            normalizedValue() {
                return Math.min(Math.max(this.value, 0), 1);
            }
        }
    }
</script>

<style src="./progress.less" lang="less"/>
