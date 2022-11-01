<template>
    <div class="banner-e-learning" :style="style">
        <div class="banner-e-learning__content">
            <p class="banner-e-learning__title">Дистанционное обучение</p>
            <p class="banner-e-learning__text">
                Обучение на международной платформе ASK&nbsp;<nobr>e-learning</nobr>
            </p>
            <button-block
                class="banner-e-learning__button"
                color="white"
                padding="55"
                font-size="50"
                @click="onButtonClick"
            >
                Зарегистрироваться
            </button-block>
        </div>
        <div class="banner-e-learning__image"></div>
    </div>
</template>

<script>
import ButtonBlock from '../button';

export default {
    components: {
        ButtonBlock
    },
    props: {
        width: Number,
    },
    computed: {
        horizontalMargin() {
            return typeof this.width === 'number' ? 10 : 0;
        },
        internalWidth() {
            if (this.$mq === 'desktop') {
                if (typeof this.width === 'number') {
                    return `calc(${this.width}% - ${this.horizontalMargin * 2}px)`;
                }

                return this.width;
            }

            return '100%';
        },
        style() {
            return {
                width: this.internalWidth,
                marginLeft: this.horizontalMargin + 'px',
                marginRight: this.horizontalMargin + 'px'
            };
        },
    },
    methods: {
        onButtonClick() {
            window.open('https://ask-elearning.com/', '_target');
        }
    }
}
</script>

<style src="./banner-e-learning.less" lang="less"/>
