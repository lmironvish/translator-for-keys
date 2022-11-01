<template>
    <div class="banner-osis">
        <div class="banner-osis__left-image"></div>
        <div class="banner-osis__content">
            <div class="banner-osis__title">Do you dare to shine?</div>
            <div class="banner-osis__head">
                <img class="banner-osis__logo" :src="createStaticUrl('images/osis-logo-red.svg')">
                Made to create 2021
            </div>
            <div class="banner-osis__text">
                Международный парикмахерский конкурс, пятый год подряд собирающий
                лучших мастеров индустрии. Выберите свою категорию и бросьте вызов
                ежедневной салонной рутине!
            </div>
            <a class="banner-osis__button" href="http://www.osismadetocreate.com" target="_blank">
                <button-block color="red-2" font-size="50" padding="50">
                    Принять участие в конкурсе
                </button-block>
            </a>
        </div>

        <div class="banner-osis__right-image"></div>
    </div>
</template>

<script>
    import ButtonBlock from '@/blocks/button';

    export default {
        components: {
            ButtonBlock,
        },
    }
</script>

<style src="./banner-osis.less" lang="less"/>
