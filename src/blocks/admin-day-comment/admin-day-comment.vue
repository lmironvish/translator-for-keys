<template>
    <div class="admin-day-comment">
        <transition name="slide-from-right">
            <slide-right v-if="isVisible" class="admin-day-comment__slide" @close="$emit('close')">
                <template #title>Комментарий</template>

                <div class="admin-day-comment__content">
                    <form-field :validator="$v.comment">
                        <textarea-block :field="{ value: comment }" @input="comment = $event.value"/>
                    </form-field>
                    <button-block
                        class="admin-day-comment__button"
                        color="black"
                        padding="50"
                        :disabled="!canSave"
                        @click="save()"
                    >Сохранить</button-block>
                </div>
            </slide-right>
        </transition>
        <transition name="fade-animation">
            <div v-if="isVisible" class="admin-day-comment__blackout"></div>
        </transition>
    </div>
</template>

<script>
    import SlideRight from '../slide-right';
    import ButtonBlock from '../button';
    import TextareaBlock from '../textarea';
    import FormField from '../form-field';
    import api from '@/api';
    import { validationMixin } from 'vuelidate';
    import { required } from 'vuelidate/lib/validators';

    export default {
        components: {
            SlideRight,
            ButtonBlock,
            TextareaBlock,
            FormField,
        },
        props: {
            params: {
                type: Object,
                default: () => ({}),
            },
        },
        mixins: [validationMixin],
        validations: {
            comment: { required },
        },
        data: () => ({
            comment: null,
            isSaving: false,
        }),
        computed: {
            isVisible() {
                return !!(this.params && this.params.id);
            },
            canSave() {
                return this.params.comment !== this.comment && !this.isSaving;
            },
        },
        methods: {
            async save() {
                this.$v.$touch();
                if (this.$v.$error) return;
                try {
                    this.isSaving = true;
                    await api.training.setAdminDayComment({
                        id: this.params.id,
                        comment: this.comment,
                    });
                    this.addActionSuccess({
                        title: 'Успешное сохранение',
                        text: 'Комментарий сохранен',
                    });
                    this.$emit('close');
                    this.$v.$reset();
                } catch (error) {
                    this.addActionError({
                        title: 'Ошибка!',
                        response: error,
                    });
                } finally {
                    this.isSaving = false;
                }
            },
        },
        watch: {
            params: {
                deep: true,
                handler({ id, comment }) {
                    if (id) {
                        this.comment = comment;
                    }
                },
            },
        },
    }
</script>

<style src="./admin-day-comment.less" lang="less"/>
