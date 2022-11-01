<template>
    <modal
        class="info-modal"
        height="auto"
        width="100%"
        :name="name"
        :maxWidth="375"
        :adaptive="true"
        :dynamic="false"
        @before-open="beforeOpen"
    >
        <div class="info-modal__content">
            <div class="info-modal__title">
                <slot name="title">Информация</slot>
            </div>
            <div class="info-modal__content">
                <slot name="default">Контент</slot>
            </div>
            <div class="info-modal__buttons">
                <button-block
                    class="info-modal__button"
                    color="linear-black"
                    font-size="50"
                    padding="55"
                    @click="closeModal"
                >
                    закрыть
                </button-block>
            </div>
        </div>
    </modal>
</template>

<script>
import ButtonBlock from '@/blocks/button';

export default {
    name: 'InfoModal',
    props: {
        name: {
            type: String,
            default: 'info',
        },
    },
    data: () => ({
        params: {},
    }),
    components: {
        ButtonBlock,
    },
    methods: {
        beforeOpen(e) {
            this.params = e.params ? e.params : {};
        },
        closeModal() {
            this.$modal.hide(this.name);
        },
        confirm() {
            this.$emit('info', this.params);
            this.closeModal();
        },
    },
};
</script>

<style src="./info-modal.less" lang="less" />
