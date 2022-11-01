<template>
    <div v-if="brand" class="banner-new-clients">
        <div class="banner-new-clients__content">
            <p class="banner-new-clients__title">Ваша заявка на сотрудничество с брендом {{ brand }} принята</p>
            <p class="banner-new-clients__text">
                Представитель {{ brand }} свяжется с вами в течение 24&nbsp;часов. Если с вами не связался наш
                официальный
                представитель, все&nbsp;вопросы по сотрудничеству вы можете задать по номеру телефона
                <a href="https://wa.me/message/YERTEO2XCIU3G1" target="_blank">+7 916 350-82-96</a> в WhatsApp.
            </p>
            <button-block
                v-if="brand !== 'STMNT'"
                class="banner-new-clients__button"
                color="black"
                padding="55"
                font-size="50"
                @click="onButtonClick"
            >
                Узнать о бренде
            </button-block>
        </div>
        <img
            class="banner-new-clients__logo"
            :src="createStaticUrl(`images/landing/${user.brand.toLowerCase()}-${$mq !== 'mobile' ? 'head.jpg' : 'head-mobile.png'}`)"
        >
    </div>
</template>

<script>
import ButtonBlock from '../button';

export default {
    components: {
        ButtonBlock,
    },
    computed: {
        brands() {
            return this.$store.state.resource.brands;
        },
        user() {
            return this.$store.state.user.data;
        },
        brand() {
            if (!this.user || this.brands.length === 0) {
                return;
            }
            const brand = this.user.brand;
            const option = this.brands.find(option => option.value === brand);
            return option.index;
        },
    },
    methods: {
        onButtonClick() {
            switch (this.brand) {
                case 'INDOLA':
                    window.open(this.createStaticUrl('documents/INDOLA_2021_about_brand.pdf'), '_blank');
                    return
                default:
                    window.open('#',  '_blank')
            }

        },
    },
}
</script>

<style src="./banner-new-clients.less" lang="less"/>
