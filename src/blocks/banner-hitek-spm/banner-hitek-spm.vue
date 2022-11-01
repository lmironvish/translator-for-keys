<template>
    <div :class="getBemClass('banner-hitek-spm', { [name]: true })">
        <div :class="getBemClass('banner-hitek-spm__image', { [name]: true })"></div>
        <div class="banner-hitek-spm__title">{{ title }}</div>
        <div class="banner-hitek-spm__promocodes-container">
            <div v-for="promocode in promocodes" class="banner-hitek-spm__promocode-holder">
                <promocode-copy class="banner-hitek-spm__promocode-left" :color="promoCodeColor" :promocode="promocode.code"/>
                <div class="banner-hitek-spm__promocode-right" v-html="promocode.title"></div>
            </div>
        </div>
        <button-block
            color="white"
            font-size="50"
            padding="55"
            class="banner-hitek-spm__button"
            @click="buyButtonClick"
        >Купить</button-block>
    </div>
</template>

<script>
    import ButtonBlock from '../button';
    import PromocodeCopy from '../promocode-copy';

    export default {
        components: {
            ButtonBlock,
            PromocodeCopy,
        },
        props: {
            title: String,
            promocodes: Array,
            buyPromocodeUrl: String,
            name: String,
        },
        computed: {
            promoCodeColor() {
                switch (this.name) {
                    case 'hitek':
                        return 'gold';
                    case 'spm':
                        return 'orange';
                }
            },
        },
        methods: {
            buyButtonClick() {
                window.open(this.buyPromocodeUrl, '_blank');
                this.$gtag.event(this.name);
            },
        },
    }
</script>

<style src="./banner-hitek-spm.less" lang="less"/>
