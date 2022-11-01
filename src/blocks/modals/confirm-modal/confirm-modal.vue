<template>
    <modal
        class="confirm-modal"
        height="auto"
        width="100%"
        :name="name"
        :maxWidth="375"
        :adaptive="true"
        :dynamic="false"
        @before-open="beforeOpen"
    >
        <div class="confirm-modal__content">
            <p class="confirm-modal__title">
                <slot>Вы уверены?</slot>
            </p>
            <p class="confirm-modal__buttons">
                <button-block
                    class="confirm-modal__button"
                    color="linear-black"
                    font-size="50"
                    padding="55"
                    @click="closeModal"

                >
                    Нет
                </button-block>
                <button-block
                    class="confirm-modal__button"
                    color="black"
                    font-size="50"
                    padding="55"
                    @click="confirm"
                >
                    Да
                </button-block>
            </p>
        </div>
    </modal>
</template>

<script>
import ButtonBlock from '@/blocks/button';

export default {
    name: 'ConfirmModal',
    props: {
        name: {
            type: String,
            default: 'confirm',
        }
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
            this.$emit('confirm', this.params);
            this.closeModal();
        },
    },
};
</script>

<style src="./confirm-modal.less" lang="less"/>
