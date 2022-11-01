<template>
    <section class="event-head event-head_inner">
        <div class="event-head__head">
            <div
                class="event-head__back-button"
                @click="goBack({name: 'dashboard.Main'})"
            ></div>
            <div
                v-if="eventData.oldPrice"
                class="event-head__discount"
            >-{{ Math.round((1 - eventData.price / eventData.oldPrice) * 100) }}%</div>
        </div>
        <img
            v-if="eventData.brand"
            :src="createStaticUrl(logo)"
            class="event-head__logo event-head__logo_mobile"
            :class="eventData.brand === 'INDOLA' || eventData.brand.index === 'INDOLA' ? 'event-head__logo_indola' : 'event-head__logo_skp'"
        >
        <div
            class="event-head__image-block event-head__image-block_inner"
            :class="{'event-head__image-block_with-pagination': eventData.images && eventData.images.length > 0}"
        >
            <div
                v-if="eventData.images && eventData.images.length > 0"
                class="event-head__swiper"
                :class="{'event-head__swiper_disabled': eventData.images.length === 1}"
                v-swiper:swiper="swiperOption"
            >
                <div class="event-head__swiper-wrapper swiper-wrapper">
                    <div
                        v-for="image in eventData.images"
                        class="event-head__swiper-slide swiper-slide"
                        :style="{backgroundImage: createUploadUrl(image.path, true)}"
                    ></div>
                </div>
                <div
                    v-if="eventData.images && eventData.images.length > 1"
                    class="event-head__swiper-nav event-head__swiper-nav_prev"
                ></div>
                <div
                    v-if="eventData.images && eventData.images.length > 1"
                    class="event-head__swiper-nav event-head__swiper-nav_next"
                ></div>
            </div>
            <div
                v-if="eventData.images && eventData.images.length > 1"
                class="event-head__swiper-pagination"
            ></div>
            <div
                v-if="eventData.alert && !isAlertTypeConditions"
                class="event-head__alert-holder"
            >
                <event-alert
                    class="event-head__alert"
                    :alert="eventData.alert"
                    @cancel-invite="$emit('cancel-invite')"
                    @click="onAlertClick"
                />
            </div>
        </div>
        <div class="event-head__info event-head__info_inner">
            <div class="event-head__info-head event-head__info-head_inner">
                <img
                    v-if="eventData.brand"
                    :src="createStaticUrl(logo)"
                    class="event-head__logo"
                    :class="eventData.brand === 'INDOLA' || eventData.brand.index === 'INDOLA' ? 'event-head__logo_indola' : 'event-head__logo_skp'"
                >
                <div
                    v-if="$mq === 'desktop'"
                    class="event-head__date"
                >
                    {{ eventData.date }}
                    <div v-if="eventData.timeZone && user.timeZoneOffset" class="event-head__date-note">
                        По вашему местному времени
                    </div>
                </div>
            </div>
            <div
                v-if="eventData.topics || eventData.category || eventData.level"
                class="event-head__overtitle event-head__overtitle_inner"
            >{{
                [
                    [...eventData.topics || []].filter(Boolean).join(', '),
                    eventData.category ? eventData.category.index : null,
                    eventData.level,
                ].filter(Boolean).join(', ')
            }}</div>
            <div class="event-head__title event-head__title_inner" v-html="eventData.title"></div>
            <div
                v-if="$mq !== 'desktop'"
                class="event-head__date"
            >
                {{ eventData.date }}
                <div v-if="eventData.timeZone && user.timeZoneOffset" class="event-head__date-note">
                    По вашему местному времени
                </div>
            </div>
            <div
                v-if="eventData.address"
                class="event-head__place event-head__place_inner"
            >
                <template v-if="eventData.salon">
                    <template v-if="!eventData.salon.isMarket">
                        Салон:
                        <auto-link
                            :to="{ name: 'dashboard.Salon', params: { id: this.eventData.salon.id } }"
                        >
                            {{ eventData.salon.title }}
                        </auto-link>
                    </template>
                    <template v-else>
                        Магазин:
                        <auto-link
                            :to="{ name: 'dashboard.Market', params: { id: this.eventData.salon.id } }"
                        >
                            {{ eventData.salon.title }}
                        </auto-link>
                    </template>
                    &nbsp;
                </template>
                <template v-if="!eventData.isAddressDisabled">
                    Страна: <span v-html="eventData.country"></span>
                    <br>
                    Адрес: <span v-html="eventData.address"></span> <a :href="getYandexMapAddressLink(eventData.country + ', ' + eventData.address)" target="_blank">На&nbsp;карте</a>
                </template>
            </div>

            <div class="event-head__buttons-holder">
                <template v-if="!$slots.buttons">
                    <event-alert
                        v-if="eventData.alert && isAlertTypeConditions"
                        class="event-head__alert_clickable"
                        :alert="eventData.alert"
                        :is-conditions="isAlertTypeConditions"
                        @click="onAlertClick"
                    />
                    <div
                        v-if="permissions.participateInEvent && $mq === 'desktop'"
                        class="event-head__button-mobile-participate"
                    >
                        <div
                            v-if="permissions.canSeePlaces"
                            class="event-head__places-taken"
                        >
                            <div class="event-head__places-taken-title">Свободных мест</div>
                            <div class="event-head__places-taken-count">{{ eventData.freePlaces }}</div>
                        </div>
                        <div
                            class="event-head__appointment"
                            @click="$emit('participate')"
                        >
                            <div class="event-head__appointment-title">{{ eventData.price === 0 ? 'Принять участие' : 'Запись и оплата' }}</div>
                            <div class="event-head__appointment-price">
                                <template v-if="eventData.oldPrice">
                                    <span class="event-head__old-price">{{ eventData.oldPrice | spaceBetweenDigit }}</span>
                                    &nbsp;
                                </template>
                                <template v-if="eventData.price > 0">{{ eventData.price | spaceBetweenDigit }} ₽</template>
                                <template v-else>Бесплатно</template>
                            </div>
                        </div>
                        <router-link :to="{name: 'dashboard.Information', hash: '#vozvrat'}" class="event-head__button-outer-info"/>
                    </div>
                    <button-block
                        v-if="permissions.canInviteStylists"
                        class="event-head__button event-head__button_icon"
                        color="white"
                        :title="$t('global.inviteStylists')"
                        :icon="$mq === 'desktop' ? 'man' : 'man-white'"
                        @click="$emit('invite-stylists')"
                    />
                    <button-block
                        v-if="permissions.canEditEvent"
                        class="event-head__button event-head__button_icon"
                        :title="$t('global.editASeminar')"
                        :icon="$mq === 'desktop' ? 'pencil' : 'pencil-white'"
                        @click="$router.push({ name: 'dashboard.Calendar', params: { eventId: eventData.id } })"
                    />
                    <button-block
                        v-if="permissions.canDeleteEvent"
                        class="event-head__button event-head__button_icon"
                        :title="$t('global.deleteTheSeminar')"
                        :icon="$mq === 'desktop' ? 'trash-black' : 'trash'"
                        @click="$emit('delete-event')"
                    />
                    <button-block
                        v-if="permissions.canCancelEvent"
                        class="event-head__button event-head__button_icon"
                        :title="$t('global.cancelTheSeminar')"
                        :icon="$mq === 'desktop' ? 'close' : 'close-white'"
                        :color="$mq === 'desktop' ? 'linear-white' : 'linear-black'"
                        @click="$emit('cancel-event')"
                    />
                    <button-block
                        v-if="permissions.canScheduleStylists && $mq === 'desktop'"
                        padding="50"
                        class="event-head__button"
                        color="white"
                        font-size="50"
                        @click="$emit('schedule-stylists')"
                    >Назначить</button-block>
                    <button-block
                        v-if="permissions.canFinishEvent && $mq === 'desktop'"
                        padding="50"
                        class="event-head__button"
                        color="white"
                        font-size="50"
                        @click="$emit('finish-event')"
                    >Завершить</button-block>

                    <button-block
                        v-if="permissions.acceptTeaching && $mq === 'desktop'"
                        padding="50"
                        class="event-head__button"
                        color="white"
                        font-size="50"
                        @click="$emit('accept-teaching')"
                    >Принять</button-block>
                    <button-block
                        v-if="permissions.acceptTeaching && $mq === 'desktop'"
                        padding="50"
                        class="event-head__button"
                        color="white"
                        font-size="50"
                        @click="$emit('decline-teaching')"
                    >Отклонить</button-block>
                    <div
                        v-if="permissions.unparticipate"
                        class="event-head__cancel-participation-button"
                        @click="$emit('unparticipate')"
                    >Отменить участие</div>
                </template>
                <slot v-else name="buttons"/>
            </div>
        </div>
        <div
            v-if="permissions.participateInEvent && $mq !== 'desktop'"
            class="event-head__button-mobile-participate"
        >
            <div
                v-if="permissions.canSeePlaces"
                class="event-head__places-taken"
            >
                <div class="event-head__places-taken-title">Места</div>
                <div class="event-head__places-taken-count">{{ eventData.freePlaces }}</div>
            </div>
            <div
                class="event-head__appointment"
                @click="$emit('participate')"
            >
                <div class="event-head__appointment-title">{{ eventData.price === 0 ? 'Принять участие' : 'Запись и оплата' }}</div>
                <div class="event-head__appointment-price">
                    <template v-if="eventData.oldPrice">
                        <span class="event-head__old-price">{{ eventData.oldPrice | spaceBetweenDigit }}</span>
                        &nbsp;
                    </template>
                    <template v-if="eventData.price > 0">{{ eventData.price | spaceBetweenDigit }} ₽</template>
                    <template v-else>Бесплатно</template>
                </div>
            </div>
            <router-link :to="{name: 'dashboard.Information', hash: '#vozvrat'}" class="event-head__button-outer-info"/>
        </div>
        <div
            v-if="$mq !== 'desktop'"
            class="event-head__buttons-inner"
        >
            <template v-if="!$slots.buttons">
                <button-block
                    v-if="permissions.acceptTeaching"
                    padding="50"
                    class="event-head__inner-button"
                    color="black"
                    font-size="50"
                    @click="$emit('accept-teaching')"
                >Принять</button-block>
                <button-block
                    v-if="permissions.acceptTeaching"
                    padding="50"
                    class="event-head__inner-button"
                    color="black"
                    font-size="50"
                    @click="$emit('decline-teaching')"
                >Отклонить</button-block>
                <button-block
                    v-if="permissions.canFinishEvent"
                    padding="50"
                    class="event-head__inner-button"
                    color="black"
                    font-size="50"
                    additional-icon="checkmark"
                    @click="$emit('finish-event')"
                >Завершить</button-block>
                <button-block
                    v-if="permissions.canScheduleStylists"
                    padding="50"
                    class="event-head__inner-button"
                    color="linear-black"
                    font-size="50"
                    @click="$emit('schedule-stylists')"
                >Назначить</button-block>
                <button-block
                    padding="50"
                    class="event-head__inner-button"
                    color="linear-black"
                    font-size="50"
                    @click="$emit('scroll-to', 'description')"
                >Описание</button-block>
                <button-block
                    padding="50"
                    class="event-head__inner-button"
                    color="linear-black"
                    font-size="50"
                    @click="$emit('scroll-to', 'participants')"
                >Участники</button-block>
                <button-block
                    padding="50"
                    class="event-head__inner-button"
                    color="linear-black"
                    font-size="50"
                    @click="$emit('scroll-to', 'invited')"
                >Приглашенные</button-block>
            </template>
        </div>
    </section>
</template>

<script>
import ButtonBlock from '../button';
import EventAlert from '../event-alert';
import { directive } from 'vue-awesome-swiper';
import AutoLink from '../auto-link';

import { goBack, getYandexMapAddressLink, hasAccessToRoute } from '@/tools';

import api from '@/api';

export default {
    name: 'EventHead',
    directives: {
        swiper: directive
    },
    components: {
        ButtonBlock,
        EventAlert,
        AutoLink,
    },
    props: {
        eventData: Object,
        eventMeta: Object
    },
    data: () => ({
        swiperOption: {
            pagination: {
                el: '.event-head__swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.event-head__swiper-nav_next',
                prevEl: '.event-head__swiper-nav_prev'
            },
            slidesPerView: 1,
            loop: true
        },
    }),
    computed: {
        logo() {
            if (this.eventData.brand === 'INDOLA' || this.eventData.brand.value === 'INDOLA') {
                return this.$mq === 'desktop' ? 'images/indola-logo.svg' : 'images/indola-logo-black.svg'
            }
            if (this.eventData.brand === 'SKP' || this.eventData.brand.value === 'SKP') {
                return this.$mq === 'desktop' ? 'images/skp-logo-white.png' : 'images/skp-logo-black.png'
            }
            if (this.eventData.brand === 'STMNT' || this.eventData.brand.value === 'STMNT') {
                return this.$mq === 'desktop' ? 'images/STMNT-logo-white.png' : 'images/STMNT-logo-black.png'
            }
            if (this.eventData.brand === 'ABC' || this.eventData.brand.value === 'ABC') {
                return this.$mq === 'desktop' ? 'images/ABC-logo-white.png' : 'images/ABC_logo_black.png'
            }
        },
        isAlertTypeConditions() {
            return this.eventData.alert && this.eventData.alert.type === 'Conditions';
        },
        permissions() {
            return this.eventMeta && this.eventMeta.permissions || {};
        },
        user() {
            return this.$store.state.user.data;
        },
    },
    methods: {
        goBack,
        getYandexMapAddressLink,
        onAsideResize() {
            if (this.swiper) {
                this.swiper.update();
            }
        },
        onAlertClick() {
            if (this.isAlertTypeConditions) {
                this.$emit('scroll-to-conditions');
            }
        },
    },
    created() {
        this.$root.$on('aside-resized', this.onAsideResize);
    },
    destroyed() {
        this.$root.$off('aside-resized', this.onAsideResize);
    }
}
</script>

<style src="./event-head.less" lang="less"/>
