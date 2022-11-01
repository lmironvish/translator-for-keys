<template>
    <div class="profile">
        <slide-right @close="$emit('close')">
            <template v-slot:title>
                Профиль
            </template>
            <template v-slot:default>
                <div class="profile__content">
                    <div class="profile__user">
                        <user-avatar
                            class="profile__avatar"
                            :img="avatar"
                            :canUpload="user.meta.permissions.canUploadAvatar"
                            :maxWidth="300"
                            @input="updateAvatar"
                        />
                        <div class="profile__user-info">
                            <p class="profile__role">{{ user.prettyRole }}</p>
                            <p
                                class="profile__brands"
                                v-if="user.profile.brands"
                            >
                                <img
                                    v-for="brand in user.profile.brands"
                                    :key="brand"
                                    class="profile__brand-img"
                                    :src="getBrandImg(brand)"
                                    :alt="brand"
                                    width="92.5"
                                />
                            </p>
                            <p class="profile__second-name">
                                {{ user.lastName }}
                            </p>
                            <p class="profile__name">
                                {{ user.firstName }} {{ user.middleName }}
                            </p>
                            <p class="profile__phone">{{ user.prettyPhone }}</p>
                        </div>
                    </div>
                    <router-link
                        :to="routerPath"
                        v-if="routerPath"
                        @click.native="$emit('close')"
                    >
                        <button-block
                            class="profile__button"
                            color="black"
                            padding="60"
                        >
                            Карточка
                        </button-block>
                    </router-link>
                    <p class="profile__title">Персональные данные</p>
                    <div class="profile__items-holder">
                        <div class="profile__item">
                            <!--                            <p class="profile__item-label">E-mail</p>
                                                        <p class="profile__item-value">{{ user.email }}</p>-->
                            <input
                                class="profile__input"
                                :class="{
                                    profile__input_error: $v.email.$error
                                }"
                                id="email"
                                type="email"
                                autocomplete="off"
                                placeholder="Укажите E-mail"
                                v-model="email"
                                ref="emailInput"
                            />
                            <validation-errors
                                v-if="$v.email"
                                :validator="$v.email"
                            />

                            <button-block
                                class="profile__button"
                                color="black"
                                padding="60"
                                :disabled="!canEmailUpdate"
                                @click="handleEmailUpdate"
                            >
                                Обновить Email
                            </button-block>
                        </div>
                        <div
                            class="profile__item"
                            v-if="
                                user.profile.salons &&
                                    user.profile.salons.length
                            "
                        >
                            <p class="profile__item-label">Салоны</p>
                            <ul class="profile__links">
                                <li
                                    v-for="salon in user.profile.salons"
                                    :key="salon.id"
                                >
                                    <router-link
                                        v-if="
                                            user.meta.permissions
                                                .canViewSectionSalons
                                        "
                                        class="profile__item-value profile__link"
                                        :to="{
                                            name: 'dashboard.Salon',
                                            params: { id: salon.id }
                                        }"
                                        @click.native="$emit('close')"
                                        >{{ salon.title }}
                                    </router-link>
                                    <span v-else class="profile__item-value">{{
                                        salon.title
                                    }}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="profile__item" v-if="user.profile.city">
                            <p class="profile__item-label">Город</p>
                            <p class="profile__item-value">
                                {{ user.profile.city.title }}
                            </p>
                        </div>
                    </div>
                    <p class="profile__info">
                        Для изменения данных обратитесь к ответственному лицу c
                        помощью Обратной связи
                    </p>
                    <p class="profile__title">Сменить пароль</p>

                    <input
                        class="profile__input"
                        :class="{ profile__input_error: $v.password.$error }"
                        id="password"
                        type="password"
                        autocomplete="off"
                        placeholder="Укажите новый пароль"
                        v-model="password"
                    />
                    <validation-errors
                        v-if="$v.password"
                        :validator="$v.password"
                    />
                    <input
                        class="profile__input"
                        :class="{
                            profile__input_error: $v.passwordRepeat.$error
                        }"
                        id="repeat-password"
                        type="password"
                        autocomplete="off"
                        placeholder="Повторите новый пароль"
                        v-model="passwordRepeat"
                    />
                    <validation-errors
                        v-if="$v.passwordRepeat"
                        :validator="$v.passwordRepeat"
                    />

                    <button-block
                        class="profile__button"
                        color="black"
                        padding="60"
                        :disabled="!canUpdate"
                        @click="handleUpdate"
                    >
                        Обновить профиль
                    </button-block>
                    <button-block
                        class="profile__button"
                        color="linear-black"
                        padding="60"
                        @click="logout"
                    >
                        Выйти из профиля
                    </button-block>

                    <button-block
                        class="profile__button"
                        color="linear-black"
                        padding="60"
                        v-if="hasZoomAuth && webinarsShow && isInnerRole"
                        @click="zoomLogout"
                    >
                        Выйти из Zoom
                    </button-block>
                    <button-block
                        class="profile__button"
                        color="linear-black"
                        padding="60"
                        v-if="!hasZoomAuth && webinarsShow && isInnerRole"
                        @click="handleZoomAuth()"
                    >
                        Войти через Zoom
                    </button-block>

                </div>
            </template>
        </slide-right>
    </div>
</template>

<script>
import UserAvatar from "@/blocks/user-avatar";
import SlideRight from "../slide-right";
import ButtonBlock from "../button";
import FormField from "@/blocks/form-field";
import FilterInput from "@/blocks/filter-input";
import ValidationErrors from "../validation-errors";

import api from "@/api";
import { mapActions, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { email, required, sameAs } from "vuelidate/lib/validators";
import { passwordValidators } from "@/validators";
import zoomAuth from "@/mixins/zoom-auth";
import { RolesRoutes } from "@/blocks/profile/RolesRoute";

export default {
    name: "Profile",
    mixins: [zoomAuth, validationMixin],
    components: {
        UserAvatar,
        SlideRight,
        ButtonBlock,
        FormField,
        FilterInput,
        ValidationErrors
    },
    props: {
        focusOnEmail: Boolean
    },
    data: () => ({
        password: "",
        passwordRepeat: "",
        avatar: null,
        email: null
    }),
    created() {
        this.email = this.user.email;
    },
    computed: {
        ...mapState("user", {
            isParticipant: state =>
                !state.data.meta.permissions.canCreateWebinar,
            userId: state => state.data.id
        }),
        user() {
            return this.$store.state.user.data;
        },
        isInnerRole() {
            return this.$store.getters['user/isInnerRole']
        },
        fieldsAreDirty() {
            return this.password.length > 0 || this.passwordRepeat.length > 0;
        },
        canUpdate() {
            if (this.$v.$error) return false;
            return this.fieldsAreDirty || this.avatar;
        },
        canEmailUpdate() {
            return this.email !== this.user.email;
        },
        routerPath() {
            return new RolesRoutes(this.user.role, this.userId).getUserRoute();
        }
    },
    validations: {
        password: {
            required,
            ...passwordValidators
        },
        passwordRepeat: {
            sameAsPassword: sameAs("password")
        },
        email: { email }
    },
    methods: {
        ...mapActions({
            addActionSuccess: "notifications/addActionSuccess",
            addActionError: "notifications/addActionError",
            logout: "user/logout"
        }),
        getBrandImg(name) {
            const images = {
                SKP: "images/skp-logo-black-cropped.png",
                INDOLA: "images/indola-logo-black.svg",
                STMNT: "images/STMNT-logo-black.png",
                ABC: "images/ABC_logo_black.png"
            };
            return this.createStaticUrl(images[name]);
        },
        updateAvatar(avatar) {
            this.avatar = avatar;
        },
        async handleUpdate() {
            const params = {};
            // Проверяет и добавляет аватарку, если она изменяется
            if (this.avatar) Object.assign(params, { avatar: this.avatar.id });
            // Проверяет и добавляет пароль, если он изменяется
            if (this.password || this.passwordRepeat) {
                this.$v.$touch();
                if (this.$v.$error) return;
                Object.assign(params, { password: this.password });
            } else {
                this.$v.$reset();
            }

            try {
                await api.user.putUser(params);
                this.addActionSuccess({
                    title: "Успешное обновление",
                    text: "Профиль успешно обновлен"
                });
                await this.$store.dispatch("user/updateData");
            } catch (error) {
                this.addActionError({
                    title: "Ошибка!",
                    response: error || "Произошла ошибка"
                });
            }
            this.$v.$reset();
            this.avatar = null;
            this.password = "";
            this.passwordRepeat = "";
        },
        async handleEmailUpdate() {
            this.$v.email.$touch();
            if (this.$v.email.$error) return;

            try {
                await api.user.putUser({ email: this.email });
                await this.$store.dispatch("user/updateData");
                this.email = this.user.email;
                this.addActionSuccess({
                    title: "Успешно",
                    text: "Email изменен"
                });
            } catch (e) {
                this.addActionError({
                    title: "Ошибка!",
                    response: e
                });
            }
        },
        focusEmail() {
            this.$refs.emailInput.focus();
        },
        handleCardButtonClick() {
            console.log(this.$store.state.resource.roles.map(r => r.value));
        }
    },
    watch: {
        focusOnEmail: {
            handler(newVal) {
                if (newVal) {
                    this.focusEmail();
                    this.$emit("clearFocusValue");
                }
            },
            immediate: true
        }
    }
};
</script>

<style src="./profile.less" lang="less" />
