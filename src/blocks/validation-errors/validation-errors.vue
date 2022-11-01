<template>
    <ul v-if="(validator && validator.$error) || customErrors.length" class="validation-errors">
        <template v-if="validator && validator.$error">
            <li class="validation-errors__error" v-if="renderError('required')">
                Это поле необходимо для заполнения
            </li>
            <li class="validation-errors__error" v-if="renderError('minLength')">
                Минимальная длина поля: {{ validator.$params.minLength.min }} символов
            </li>
            <li class="validation-errors__error" v-if="renderError('maxLength')">
                Максимальная длина поля: {{ validator.$params.maxLength.max }} символов
            </li>
            <li class="validation-errors__error" v-if="renderError('alpha')">
                Это поле может содержать только символы алфавита
            </li>
            <li
                class="validation-errors__error"
                v-if="renderError('email') || renderError('multipleEmail')"
            >
                Введите правильный email адрес
            </li>
            <li
                class="validation-errors__error"
                v-if="renderError('phone') || renderError('multiplePhone')"
            >
                Введите телефон полностью
            </li>
            <li class="validation-errors__error" v-if="renderError('multipleUnique')">
                Значение уже используется
            </li>
            <li class="validation-errors__error" v-if="renderError('hash')">
                Это поле не может содержать русские символы или пробелы
            </li>
            <li class="validation-errors__error" v-if="renderError('numberRange')">
                Введите корректные значения
            </li>
            <li class="validation-errors__error" v-if="renderError('atLeastOneLetter')">
                Должна быть хотя бы одна английская буква
            </li>
            <li class="validation-errors__error" v-if="renderError('atLeastOneNumber')">
                Должна быть хотя бы одна цифра
            </li>
            <li class="validation-errors__error" v-if="renderError('password')">
                Слишком простой пароль
            </li>
            <li class="validation-errors__error" v-if="renderError('sameAsPassword')">
                Пароли должны совпадать
            </li>
            <li class="validation-errors__error" v-if="renderError('privacyAccept')">
                Необходимо согласие на обработку персональных данных
            </li>
            <li class="validation-errors__error" v-if="renderError('phoneVerifyCode')">
                Код должен состоять из 6 цифр
            </li>
        </template>
        <template v-if="customErrors.length">
            <li class="validation-errors__error" v-for="error in customErrors" :key="error">
                {{ error }}
            </li>
        </template>
    </ul>
</template>

<script>

export default {
    name: 'ValidationErrors',
    props: {
        validator: Object,
        customErrors: {
            type: Array,
            default: () => ([]),
        },
    },
    methods: {
        renderError(property) {
            const hasProperty = this.validator.hasOwnProperty(property);
            return hasProperty ? !this.validator[property] : false;
        },
    },
};
</script>

<style src="./validation-errors.less" lang="less"/>
