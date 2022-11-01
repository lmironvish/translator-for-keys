<template>
    <div class="notifications-widget">
        <slide-right @close="$emit('close')">
            <template v-slot:title>
                Уведомления
            </template>
            <template v-slot:default>
                <div class="notifications-widget__tabs-holder">
                    <tabs-block
                        :tabs="mobileTabs"
                        :activeTabId="activeTabId"
                        @tab-click="activeTabId = $event"
                    />
                </div>
                <div v-if="notifications.length > 0" class="notifications-widget__items-holder">
                    <div
                        v-for="item in notifications"
                        :key="item.id"
                        :class="getBemClass('notifications-widget__item',
                        {
                            pointer: item.type !== 2,
                            seen: activeTabId !== 'new',
                        })"
                        @click="handleItemClick(item)"
                    >
                        <div
                            class="notifications-widget__item-title"
                            v-html="item.title"
                        ></div>
                        <div
                            class="notifications-widget__item-date"
                        >
                            {{ item.createdAt | dateTime }}
                        </div>
                        <div
                            class="notifications-widget__item-text"
                            v-html="item.message"
                        ></div>
                        <div
                            v-if="item.id && item.type === 2 && activeTabId === 'new'"
                            class="notifications-widget__item-buttons-holder"
                            @click.stop
                        >
                            <button-block
                                class="notifications-widget__item-button notifications-widget__item-button_first"
                                color="green"
                                padding="50"
                                @click="participate(item.data.route.params.id)"
                            >
                                Записаться
                            </button-block>
                            <button-block
                                class="notifications-widget__item-button notifications-widget__item-button_second"
                                color="linear-black"
                                padding="50"
                                @click="$router.push(item.data.route)"
                            >
                                Подробнее
                            </button-block>
                        </div>
                        <div v-if="item.id" class="notifications-widget__item-buttons-holder" @click.stop>
                            <template v-if="activeTabId === 'new'">
                                <button-block
                                    v-if="item.type !== 1"
                                    class="notifications-widget__item-button notifications-widget__item-button_first"
                                    :color="activeTabId !== 'new' ? 'gray' : 'black'"
                                    padding="50"
                                    @click="singleCall(markAsRead, { id: item.id })"
                                >
                                    Прочитано
                                </button-block>
                                <button-block
                                    v-if="item.type === 1 && item.data"
                                    class="notifications-widget__item-button notifications-widget__item-button_first"
                                    :color="activeTabId !== 'new' ? 'gray' : 'black'"
                                    padding="50"
                                    @click="accept(item)"
                                >
                                    Подтвердить
                                </button-block>
                            </template>

                            <button-block
                                class="notifications-widget__item-button notifications-widget__item-button_second"
                                color="linear-black"
                                padding="50"
                                @click="singleCall(remove, { id: item.id })"
                            >
                                Удалить
                            </button-block>
                        </div>
                    </div>
                </div>

                <div v-else class="notifications-widget__stub">
                    Нет уведомлений
                </div>
            </template>
        </slide-right>
    </div>
</template>

<script>
import ButtonBlock from '../button'
import MobileHeader from '../mobile-header';
import TabsBlock from '../tabs';
import SlideRight from '../slide-right';
import api from '@/api';
import { getUserDetailRoute } from '@/tools';
import {makePayment, PaymentError} from "@/tools/payment";

export default {
    name: 'NotificationsWidget',
    components: {
        SlideRight,
        MobileHeader,
        ButtonBlock,
        TabsBlock
    },
    data: () => ({
        mobileTabs: [
            {
                id: 'new',
                text: 'Новые'
            },
            {
                id: 'viewed',
                text: 'Прочитанные'
            }
        ],
        activeTabId: 'new',
        viewedNotifications: null,
        isParticipateProcessing: false,
    }),
    computed: {
        notifications() {
            if (this.activeTabId === 'new') {
                return this.$store.state.notifications.unviewedList;
            } else {
                return this.$store.state.notifications.viewedList;
            }
        },
    },
    methods: {
        async accept({ id, data }) {
            let apiMethod;

            if (data.role === 'ROLE_SALON_OWNER') {
                apiMethod = api.profile.acceptSalonOwner;
            } else if (data.role === 'ROLE_ADMIN_SALON') {
                apiMethod = api.profile.acceptSalonAdmin;
            } else if (data.role === 'ROLE_STYLIST') {
                apiMethod = api.profile.acceptStylist;
            } else if (data.role === 'ROLE_MARKET') {
                apiMethod = api.profile.acceptMarket;
            } else {
                return;
            }

            try {
                await apiMethod(data.id);
            } catch (response) {
                this.addActionError({ response });
                return;
            }

            await this.markAsRead({ id });
        },
        async markAsRead({ id }) {
            try {
                await this.$store.dispatch('notifications/markAsRead', { id });
            } catch (response) {
                this.addActionError({ response });
            }
        },
        async remove({ id }) {
            try {
                await this.$store.dispatch('notifications/remove', { id });
            } catch (response) {
                this.addActionError({ response });
            }
        },
        handleItemClick({ id, type, data }) {
            if (type === 2) {
                return;
            }
            let route;

            if (data.link) {
                window.open(data.link, '_blank');
            } else if (data && data.route) {
                route = data.route;
            } else if (data && type === 1) {
                route = getUserDetailRoute(data.id, data.role);
            }

            if (route) {
                if (this.activeTabId === 'new' && type === 0) {
                    this.markAsRead({ id });
                }

                if (route.name !== this.$route.name) {
                    this.$router.push(route);
                }

                this.$emit('close');
            }
        },
        async participate(id) {
            if (this.isParticipateProcessing) {
                return;
            }

            let response;

            this.isParticipateProcessing = true;

            try {
                response = await api.training.participate({ id });
            } catch (response) {
                this.isParticipateProcessing = false;
                this.addActionError({ response });

                return;
            }

            await this.markAsRead({ id });

            this.isParticipateProcessing = false;
            this.addActionSuccess({
                title: 'Успешно',
                text: 'Вы записаны на семинар',
            });
            this.$store.dispatch('user/updateData');
        },
    },
}
</script>

<style src="./notifications-widget.less" lang="less"/>
