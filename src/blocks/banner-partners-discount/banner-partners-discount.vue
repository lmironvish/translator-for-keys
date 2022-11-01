<template>
    <div class="banner-partners-discount">
        <div class="banner-partners-discount__content">
            <p class="banner-partners-discount__title">Скидки от партнеров</p>
            <p class="banner-partners-discount__text">
                Воспользуйтесь скидками от партнеров на покупку оборудования и мебели для
                {{ !isStylistIndividual ? 'салонов' : 'торговых точек' }}, а также на услуги для вашего бизнеса
            </p>
            <button-block
                class="banner-partners-discount__button"
                color="black"
                padding="55"
                font-size="50"
                @click="$router.push({ name: 'dashboard.PartnersPromo' })"
            >
                Получить промокоды
            </button-block>
        </div>
        <div class="banner-partners-discount__image"></div>
    </div>
</template>

<script>
import ButtonBlock from '../button';

export default {
    components: {
        ButtonBlock,
    },
    computed: {
        isStylistIndividual() {
            const user = this.$store.state.user.data;
            return user.role === 'ROLE_STYLIST' && user.profile && user.profile.isIndividual;
        },
    },
}
</script>

<style src="./banner-partners-discount.less" lang="less"/>
