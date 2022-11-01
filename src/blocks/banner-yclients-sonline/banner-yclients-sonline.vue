<template>
    <div class="banner-yclients-sonline">
        <div :class="getBemClass('banner-yclients-sonline__title', { name })"><slot name="title"/></div>
        <div class="banner-yclients-sonline__description"><slot name="description"/></div>
        <promocode-copy
            class="banner-yclients-sonline__promocode"
            :promocode="promocode"
            :color="name === 'yclients' ? 'yellow' : 'blue'"
        />
        <div class="banner-yclients-sonline__right">
            <div :class="getBemClass('banner-yclients-sonline__discount', { name })">{{ discount }}%</div>
            <div :class="getBemClass('banner-yclients-sonline__logo-holder', { name })">
                <div :class="getBemClass('banner-yclients-sonline__logo', { name })"></div>
            </div>
        </div>
    </div>
</template>

<script>
import PromocodeCopy from '../promocode-copy';

export default {
    components: {
        PromocodeCopy,
    },
    props: {
        title: String,
        promocode: String,
        discount: Number,
        name: String,
    },
    methods: {

    },
}
</script>

<style src="./banner-yclients-sonline.less" lang="less"/>
