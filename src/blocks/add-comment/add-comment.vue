<template>
    <div class="add-comment">
        <slide-right
            @close="$emit('close')"
        >
            <template v-slot:title>
                Добавление комментария
            </template>
            <template v-slot:default>
                <transition name="add-comment__form-animation">
                    <form v-if="!isFormSent" class="add-comment__form" @submit.prevent="onSubmit">
                        <form-field :validator="$v.comment">
                            <textarea-block
                                :field="{value: comment, placeholder: 'Комментарий'}"
                                @input="comment = $event.value"
                            />
                        </form-field>
                        <button-block
                            color="black"
                            padding="55"
                            font-size="55"
                            class="add-comment__button"
                            is-submit
                            :disabled="isEmailSending"
                        >
                            Отправить
                        </button-block>
                    </form>
                </transition>
                <transition name="add-comment__success-animation">
                    <div v-if="isFormSent" class="add-comment__success">
                        <div class="add-comment__checkmark"></div>
                        <div class="add-comment__success-text">Ваш комментарий отправлен</div>
                        <button
                            class="add-comment__one-more"
                            @click="resetForm"
                        >Отправить ещё один</button>
                        <button-block
                            class="add-comment__button add-comment__button_success"
                            padding="55"
                            font-size="50"
                            color="black"
                            @click="$emit('close')"
                        >
                            Продолжить
                        </button-block>
                    </div>
                </transition>
            </template>
        </slide-right>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import SlideRight from '@/blocks/slide-right';
import FormField from '@/blocks/form-field';
import TextareaBlock from '@/blocks/textarea';
import ButtonBlock from '@/blocks/button';

import api from '@/api';

export default {
    name: 'AddComment',
    mixins: [validationMixin],
    validations: {
        comment: {
            required
        }
    },
    components: {
        SlideRight,
        FormField,
        TextareaBlock,
        ButtonBlock
    },
    props: {
        id: Number
    },
    data: () => ({
        comment: null,
        isEmailSending: false,
        isFormSent: false
    }),
    async mounted() {

    },
    computed: {
        user() {
            return this.$store.state.user.data;
        }
    },
    methods: {
        async onSubmit() {
            this.$v.$touch();
            if (!this.$v.$error) {
                try {
                    this.isEmailSending = true;
                    await api.comments.addItem({id: this.id, message: this.comment});
                    this.$emit('comment-added');
                    this.isFormSent = true;
                } catch (error) {
                    this.addActionError({
                        title: 'Ошибка!',
                        response: error
                    })
                } finally {
                    this.isEmailSending = false;
                }
            }
        },
        resetForm() {
            this.isFormSent = false;
            this.$v.$reset();
            this.comment = null;
        }
    }
}
</script>

<style src="./add-comment.less" lang="less"/>
