<template>
    <router-link class="link" :to="to">
        <slot/>
    </router-link>
</template>

<script>
export default {
    name: 'Link',
    inheritAttrs: false,
    props: {
        to: {
            type: String,
            default: "",
        },
    }
}
</script>

<style src="./link.less" lang="less"/>
