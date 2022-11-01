<template>
    <div class="banner-act-now">
        <div class="banner-act-now__content">
            <img :src="createStaticUrl('images/indola-logo-black.svg')" class="banner-act-now__logo">
            <p class="banner-act-now__title">
                Новая гамма веганских <span class="banner-act-now__no-wrap">эко-продуктов</span> ACT NOW!
            </p>
            <p class="banner-act-now__text">Узнай больше в чат-боте</p>
            <div class="banner-act-now__bots">
                <a
                    class="banner-act-now__bot banner-act-now__bot_vk"
                    target="_blank"
                    href="https://vk.com/indolaru"
                    @click="sendGtagEvent('vk')"
                ></a>
                <a
                    class="banner-act-now__bot banner-act-now__bot_fb"
                    target="_blank"
                    href="https://www.facebook.com/indola.russia"
                    @click="sendGtagEvent('fb')"
                ></a>
                <a
                    class="banner-act-now__bot banner-act-now__bot_tg"
                    target="_blank"
                    href="https://t.me/indolachatbot"
                    @click="sendGtagEvent('tg')"
                ></a>
            </div>
            <div class="banner-act-now__fire banner-act-now__fire_left"></div>
            <div class="banner-act-now__fire banner-act-now__fire_right"></div>
        </div>
        <div class="banner-act-now__products"></div>
    </div>
</template>

<script>
export default {
    methods: {
        sendGtagEvent(name) {
            this.$gtag.event(`banner-act-${ name }`);
        },
    },
}
</script>

<style src="./banner-act-now.less" lang="less"/>
