<template>
    <div
        class="fullscreen-image"
        v-swiper:swiper="swiperOption"
        @click.stop
    >
        <div class="fullscreen-image__blackout" @click="emitClose"></div>
        <div
            class="fullscreen-image__wrapper swiper-wrapper"
            :class="{ 'fullscreen-image__wrapper_disabled': images.length < 2 }"
            @click="emitClose"
        >
            <div
                v-for="image in images"
                class="fullscreen-image__slide swiper-slide"
            >
                <img :src="image" class="fullscreen-image__slide-img">
            </div>
        </div>
        <div class="fullscreen-image__close" @click="emitClose"></div>
        <template v-if="images.length > 1">
            <div class="fullscreen-image__nav fullscreen-image__nav_prev"></div>
            <div class="fullscreen-image__nav fullscreen-image__nav_next"></div>
        </template>
    </div>
</template>

<script>
    import { directive as swiperDirective } from 'vue-awesome-swiper';

    export default {
        directives: {
            swiper: swiperDirective
        },
        props: {
            images: {
                type: Array,
                default: () => [],
            },
            initialImageIndex: {
                type: Number,
                default: 0,
            },
        },
        destroyed() {
            this.$emit('after-close');
        },
        computed: {
            swiperOption() {
                return {
                    slidesPerView: 1,
                    loop: true,
                    initialSlide: this.initialImageIndex,
                    navigation: {
                        prevEl: '.fullscreen-image__nav_prev',
                        nextEl: '.fullscreen-image__nav_next',
                        // disabledClass: 'fullscreen-image__nav_disabled',
                    },
                };
            },
        },
        methods: {
            emitClose() {
                this.$emit('close');
            },
        },
    }
</script>

<style src="./fullscreen-image.less" lang="less"></style>
