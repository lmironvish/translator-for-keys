<template>
    <div class="cookies-modal">
        <transition name="cookies-modal__transition">
            <div class="cookies-modal__inner" v-if="isVisible">
                <p class="cookies-modal__content">
                    {{ content.content }}
                </p>
                <button-block
                    class="cookies-modal__button"
                    padding="55"
                    font-size="50"
                    color="black"
                    @click="$emit('close')"
                >
                    {{ content.button }}
                </button-block>
            </div>
        </transition>
    </div>
</template>

<script>
import ButtonBlock from '@/blocks/button';

export default {
    name: 'CookiesModal',
    components: {
        ButtonBlock,
    },
    props: {
        isVisible: Boolean,
        content: {
            type: Object,
            required: false,
            default: () => ({
                content:
                    'Я соглашаюсь с тем, что владелец сайта использует файлы cookie для повышения удобства работы на сайте и сервисы Яндекс.Метрика и Google Analytics. Оставаясь на сайте, я соглашаюсь с политикой их применения.',
                button: 'Принять',
            }),
        },
    },
};
</script>

<style src="./cookies-modal.less" lang="less" />
