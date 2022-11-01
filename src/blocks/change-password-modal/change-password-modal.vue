<template>
    <div class="change-password-modal">
        <slide-right @close="$emit('close')">
            <template v-slot:title>
                Смена пароля
            </template>
            <template v-slot:default>
                <div class="change-password-modal__content">
                    <p class="change-password-modal__title">
                        Вы можете сменить ваш пароль или сделать это позднее.
                    </p>
                    <form-field label="Пароль" :validator="$v.fields.password">
                        <filter-input
                            :field="{
                                value: fields.password,
                                type: passwordType,
                                placeholder: 'Ваш новый пароль'
                            }"
                            :has-error="$v.fields.password.$error"
                            @input="fields.password = $event.value.trim()"
                            :is-type-toggle="true"
                            @type-toggle="typeToggle('passwordType')"
                        />
                    </form-field>

                    <form-field
                        label="Подтвердите пароль"
                        :validator="$v.fields.repeatPassword"
                    >
                        <filter-input
                            :field="{
                                value: fields.repeatPassword,
                                type: passwordRepeatType,
                                placeholder: 'Повторите новый пароль'
                            }"
                            :has-error="$v.fields.repeatPassword.$error"
                            @input="onRepeatPassword"
                            :is-type-toggle="true"
                            @type-toggle="typeToggle('passwordRepeatType')"
                        />

                        <template #hint>
                            Пароль должен содержать не менее 6 латинских
                            символов и 1 цифры
                        </template>
                    </form-field>
                    <button-block
                        class="change-password-modal__button"
                        color="black"
                        padding="60"
                        :disabled="$v.$invalid"
                        @click.native="changePassword"
                    >
                        Изменить пароль
                    </button-block>
                    <button-block
                        class="change-password-modal__button"
                        color="black"
                        padding="60"
                        @click.native="$emit('close')"
                    >
                        Позднее
                    </button-block>
                </div>
            </template>
        </slide-right>
    </div>
</template>

<script>
import ButtonBlock from "../button";
import SlideRight from "../slide-right";
import FormField from "@/blocks/form-field/form-field";
import FilterInput from "@/blocks/filter-input/filter-input";
import { validationMixin } from "vuelidate";
import { required, sameAs } from "vuelidate/lib/validators";
import { passwordValidators } from "@/validators";

import api from "@/api";

export default {
    name: "ChangePasswordModal",
    mixins: [validationMixin],
    components: {
        SlideRight,
        ButtonBlock,
        FormField,
        FilterInput
    },
    props: {},
    data: () => ({
        fields: {
            password: "",
            repeatPassword: ""
        },
        passwordType: "password",
        passwordRepeatType: "password"
    }),
    validations() {
        const fields = {
            password: { required, ...passwordValidators },
            repeatPassword: { required, sameAsPassword: sameAs("password") }
        };

        return { fields };
    },
    methods: {
        onRepeatPassword(e) {
            this.fields.repeatPassword = e.value.trim();
            this.$v.fields.repeatPassword.$touch();
        },
        typeToggle(type) {
            this[type] = this[type] === "password" ? "text" : "password";
        },
        async changePassword() {
            this.$v.$touch();
            if (this.$v.$error) {
                return;
            }

            try {
                await api.user.putUser({ password: this.fields.password });
                this.addActionSuccess({
                    title: "Успешное изменение пароля",
                    text: "Пароль успешно изменен"
                });
            } catch (error) {
                this.addActionError({
                    title: "Ошибка!",
                    response: error || "Произошла ошибка"
                });
            }
            this.$emit("close");
        }
    }
};
</script>

<style src="./change-password-modal.less" lang="less" />
