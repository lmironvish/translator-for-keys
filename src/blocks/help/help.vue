<template>
    <div
        v-if="!isLoading"
        class="help"
    >
        <slide-right
            @close="$emit('close')"
        >
            <template v-slot:title>
                Помощь
            </template>
            <template v-slot:default>
                <transition name="help__form-and-support-animation">
                    <div
                        v-if="!isFormSent"
                        class="help__form-and-support"
                    >
                        <div
                            v-if="contacts"
                            class="help__tabs-holder"
                        >
                            <tabs-block
                                :tabs="tabs"
                                :active-tab-id="activeTabId"
                                @tab-click="onTabClick"
                            />
                        </div>
                        <transition name="help__support-animation">
                            <div
                                class="help__body help__body_support"
                                v-if="activeTabId === 1 && contacts"
                            >
                                <div class="help__support">
                                    <div
                                        v-for="item in help"
                                        :key="item.id"
                                        class="help__support-staff"
                                    >
                                        <div class="help__role">{{ item.prettyRole }}</div>
                                        <div class="help__name">{{ item.fio }}</div>
                                        <div class="help__phone">{{ item.prettyPhone }}</div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                        <transition name="help__form-animation">
                            <form
                                v-if="activeTabId === 2 && !isFormSent"
                                class="help__body help__body_form"
                                @submit.prevent="onSubmit"
                            >
                                <form-field label="ФИО" :validator="$v.fullName" class="help__item">
                                    <filter-input
                                        :field="{ value: fullName, placeholder: 'Введите ФИО' }"
                                        @input="fullName = $event.value"
                                        :has-error="$v.fullName.$error"
                                    />
                                </form-field>
                                <form-field label="Email" :validator="$v.email" class="help__item">
                                    <filter-input
                                        :field="{ value: email, placeholder: 'Введите email', type: 'email' }"
                                        @input="email = $event.value"
                                        :has-error="$v.email.$error"
                                    />
                                </form-field>
                                <form-field label="Телефон" :validator="$v.phone" class="help__item">
                                    <filter-input
                                        :field="{ value: phone, placeholder: '+7 (___) ___ __ __', type: 'phone' }"
                                        @input="phone = $event.value"
                                        :has-error="$v.phone.$error"
                                    />
                                </form-field>
                                <form-field label="Текст сообщения" :validator="$v.message" class="help__item">
                                    <textarea-block
                                        :field="{ value: message, placeholder: 'Введите сообщение' }"
                                        @input="message = $event.value"
                                        :has-error="$v.message.$error"
                                    />
                                </form-field>
                                <div class="help__item help__item_files">
                                    <label for="files" class="help__item-label help__item-label_files">Прикрепите файл</label>
                                    <div class="help__files-holder">
                                        <div
                                            v-for="file in files"
                                            class="help__file"
                                        >
                                            <div
                                                class="help__file-image"
                                                :style="{backgroundImage: `url(${createFileThumbnail(file)})`}"
                                            ></div>
                                            <div
                                                class="help__file-delete"
                                                @click="deleteFile(file)"
                                            ></div>
                                        </div>
                                        <div class="help__file help__file_input">
                                            <input
                                                type="file"
                                                id="files"
                                                multiple
                                                @change="onFilesChange"
                                                ref="fileInput"
                                                class="help__file-input"
                                            >
                                            <label
                                                for="files"
                                                class="help__add-file"
                                            ></label>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="error"
                                    class="help__error"
                                    v-html="getErrorText(error)"
                                ></div>
                                <button-block
                                    class="help__button"
                                    :is-submit="true"
                                    :disabled="isEmailSending"
                                    padding="55"
                                    font-size="50"
                                    color="black"
                                >
                                    {{ isEmailSending ? 'Отправка сообщения' : 'Отправить' }}
                                </button-block>
                            </form>
                        </transition>
                    </div>
                </transition>
                <transition name="help__success-animation">
                    <div
                        v-show="isFormSent"
                        class="help__body help__body_success"
                        ref="bodySuccess"
                    >
                        <div class="help__checkmark"></div>
                        <div class="help__success-text">Ваш вопрос отправлен</div>
                        <button
                            class="help__one-more"
                            @click="resetForm"
                        >Отправить ещё один</button>
                        <button-block
                            class="help__button"
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
import { required, minLength, email } from 'vuelidate/lib/validators';
import { phone } from '@/validators';
import { TheMask } from 'vue-the-mask'
import Stickyfill from 'stickyfilljs';
import { mapState } from 'vuex';

import TabsBlock from '@/blocks/tabs';
import SlideRight from '@/blocks/slide-right';
import FormField from '@/blocks/form-field';
import FilterInput from '@/blocks/filter-input';
import TextareaBlock from '@/blocks/textarea';
import ButtonBlock from '@/blocks/button';

import api from '@/api';

import { getErrorText } from '@/tools';

export default {
    name: 'Help',
    mixins: [validationMixin],
    validations: {
        fullName: {
            required
        },
        email: {
            required,
            email
        },
        phone: {
            phone,
            required
        },
        message: {
            required
        }
    },
    components: {
        TabsBlock,
        SlideRight,
        TheMask,
        FormField,
        FilterInput,
        TextareaBlock,
        ButtonBlock
    },
    props: {
        withContacts: Boolean
    },
    data: () => ({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        files: [],
        phoneTokens: {
            J: {
                pattern: /[0-79]/
            },
            '#': {
                pattern: /\d/
            },
        },
        isFormSent: false,
        bodyScroll: 0,
        tabs: [
            {
                id: 1,
                text: 'Контакты'
            },
            {
                id: 2,
                text: 'Задать вопрос'
            }
        ],
        activeTabId: null,
        help: [],
        error: null,
        contacts: null,
        isLoading: true,
        isEmailSending: false
    }),
    async mounted() {
        if (this.withContacts) {
            this.help = await api.user.getStaffList();
            if (this.help && this.help.length > 0) {
                this.contacts = true;
            }
            this.activeTabId = this.contacts ? 1 : 2;
            if (this.user) {
                this.fullName = this.user.fio;
                this.email = this.user.email;
                this.phone = this.user.prettyPhone;
            }
        } else {
            this.activeTabId = 2;
        }
        this.isLoading = false;
        await this.$nextTick();
        Stickyfill.addOne(this.$refs.bodySuccess);
    },
    computed: {
        ...mapState({
            user: state => state.user.data
        })
    },
    methods: {
        async onSubmit() {
            this.$v.$touch();
            if (!this.$v.$error) {
                try {
                    this.isEmailSending = true;
                    await api.feedback.send({
                        name: this.fullName,
                        email: this.email,
                        phone: `+${this.phone}`,
                        message: this.message,
                        files: this.files
                    })
                    this.isFormSent = true;
                } catch (error) {
                    this.error = error;
                } finally {
                    this.isEmailSending = false;
                }
            }
        },
        onFilesChange() {
            Array.from(this.$refs.fileInput.files).forEach((file) => {
                if (!this.files.find(currentFile => currentFile.name === file.name)) {
                    this.files.push(file);
                }
            });
        },
        createFileThumbnail(file) {
            return URL.createObjectURL(file);
        },
        deleteFile(file) {
            const index = this.files.indexOf(file);
            this.files.splice(index, 1);
        },
        onBodyScroll(e) {
            this.bodyScroll =  e.target.scrollTop;
        },
        onTabClick(id) {
            this.activeTabId = id;
        },
        resetForm() {
            if (this.user) {
                this.fullName = this.user.fio;
                this.email = this.user.email;
                this.phone = this.user.phone;
            } else {
                this.fullName = '';
                this.email = '';
                this.phone = '';
            }
            this.files = [];
            this.message = '';
            this.$v.$reset();
            this.isFormSent = false;
        },
        getErrorText
    }
}
</script>

<style src="./help.less" lang="less"/>
