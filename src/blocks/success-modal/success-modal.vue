<template>
    <div class="success-modal">
        <transition
            :name="$mq !== 'mobile' ? 'slide-from-right' : 'slide-from-bottom'"
        >
            <slide-right
                v-if="isVisible"
                @close="$emit('close')"
                class="success-modal__slide-right"
            >
                <template #title>
                    <slot name="title" />
                </template>
                <template #default>
                    <div class="success-modal__body">
                        <div class="success-modal__checkmark"></div>
                        <div class="success-modal__success-text">
                            <slot name="text" />
                        </div>
                        <button-block
                            class="success-modal__button"
                            padding="55"
                            font-size="50"
                            color="black"
                            @click="$emit('close')"
                        >
                            Продолжить
                        </button-block>
                    </div>
                </template>
            </slide-right>
        </transition>
        <transition name="success-modal__fade-animation">
            <div
                v-if="isVisible"
                class="success-modal__blackout"
                @click="$emit('close')"
            ></div>
        </transition>
    </div>
</template>

<script>
import SlideRight from '@/blocks/slide-right';
import ButtonBlock from '@/blocks/button';

export default {
    name: 'SuccessModal',
    components: {
        SlideRight,
        ButtonBlock,
    },
    props: {
        isVisible: Boolean,
    },
};
</script>

<style src="./success-modal.less" lang="less" />
