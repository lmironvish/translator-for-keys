<template>
    <form
        class="auth-form"
        @submit.prevent="$emit('submit')"
    >
        <h1 class="auth-form__title" v-if="$slots.title">
            <slot name="title"/>
        </h1>
        <div class="auth-form__body">
            <slot name="text"/>
            <slot/>

            <div
                class="auth-form__error-message"
                :class="{'auth-form__error-message_static': isRegistration,
                         'auth-form__error-message_two-line': twoLineError}"
            ><slot name="error"/></div>
        </div>

        <button-block
            v-if="$slots.button"
            class="auth-form__button"
            color="black"
            :padding="$mq !== 'mobile' ? '60' : '55'"
            font-size="55"
            :isSubmit="true"
        >
            <slot name="button"/>
        </button-block>

        <div
            v-if="canBack"
            class="auth-form__back"
            @click="$emit('back')"
        >
            Назад
        </div>

        <slot name="footer"/>
    </form>
</template>

<script>
import ButtonBlock from '../button';

export default {
    name: 'AuthForm',
    props: {
        canBack: Boolean,
        twoLineError: Boolean,
        staticError: Boolean
    },
    components: {
        ButtonBlock
    },
    computed: {
        isRegistration() {
            return this.$route.name === 'auth.Registration' || this.staticError === true;
        }
    }
}
</script>

<style src="./auth-form.less" lang="less"/>
