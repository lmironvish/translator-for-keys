<template>
    <div class="form-buttons">
        <button-block
            class="form-buttons__button"
            color="linear-black"
            padding="50"
            @click="$emit('back')"
        >Назад</button-block>
        <button-block
            class="form-buttons__button"
            color="black"
            padding="50"
            :disabled="hasError || submitDisabled"
            is-submit
            @click="$emit('submit')"
        >{{ confirmText }}</button-block>
    </div>
</template>

<script>
import ButtonBlock from '@/blocks/button';

export default {
    name: 'FormButtons',
    props: {
        hasError: {
            type: Boolean,
            default: false,
        },
        confirmText: {
            type: String,
            default: 'Сохранить',
        },
        submitDisabled: Boolean,
    },
    components: {
        ButtonBlock,
    },
};
</script>

<style src="./form-buttons.less" lang="less"/>
