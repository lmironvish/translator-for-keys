<template>
    <div class="academy-modal">
        <slide-right @close="$emit('close')">
            <template v-slot:title>
                Академия
            </template>
            <template v-slot:default>
                <div
                    v-if="!isLoading"
                    class="academy-modal__content"
                >
                    <div class="academy-modal__info">
                        <p class="academy-modal__name">{{ academy.title }}</p>
                        <p class="academy-modal__address">{{ academy.address }}</p>
                        <a
                            :href="getYandexMapAddressLink(academy.address)"
                            target="_blank"
                            class="academy-modal__button-holder"
                        >
                            <button-block
                                color="linear-black"
                                padding="50"
                                class="academy-modal__button"
                            >Адрес на карте</button-block>
                        </a>
                    </div>
                    <div class="academy-modal__subtitle">Об академии</div>
                    <p class="academy-modal__description">
                        {{ academy.description }}
                    </p>
                    <div class="academy-modal__subtitle">Контактные данные</div>
                    <div class="academy-modal__contacts">
                        <div
                            v-if="academy.phones.length > 0"
                            class="academy-modal__contact-item"
                        >
                            <div class="academy-modal__item-label">Телефон</div>
                            <div class="academy-modal__item-value-holder">
                                <a
                                    v-for="phone in academy.phones"
                                    class="academy-modal__item-value"
                                    :href="`tel:${unFormattedPhone(phone)}`"
                                >{{ phone }}</a>
                            </div>
                        </div>
                        <div
                            v-if="academy.emails.length > 0"
                            class="academy-modal__contact-item"
                        >
                            <div class="academy-modal__item-label">Email</div>
                            <div class="academy-modal__item-value-holder">
                                <a
                                    v-for="email in academy.emails"
                                    :href="`mailto:${email}`"
                                    class="academy-modal__item-value"
                                >{{ email }}</a>
                            </div>
                        </div>
                        <div
                            v-if="academy.instagram"
                            class="academy-modal__contact-item"
                        >
                            <div class="academy-modal__item-label">Instagram</div>
                            <div class="academy-modal__item-value-holder">
                                <a
                                    :href="formatUrl(academy.instagram).withProtocol"
                                    target="_blank"
                                    class="academy-modal__item-value"
                                >{{ formatUrl(academy.instagram).withoutProtocol }}</a>
                            </div>
                        </div>
                        <div
                            v-if="academy.vk"
                            class="academy-modal__contact-item"
                        >
                            <div class="academy-modal__item-label">VK</div>
                            <div class="academy-modal__item-value-holder">
                                <a
                                    :href="formatUrl(academy.vk).withProtocol"
                                    target="_blank"
                                    class="academy-modal__item-value"
                                >{{ formatUrl(academy.vk).withoutProtocol }}</a>
                            </div>
                        </div>
                    </div>
                    <template v-if="employee.length > 0">
                        <div class="academy-modal__subtitle">Команда академии</div>
                        <div class="academy-modal__employees-holder">
                            <div
                                v-for="item in employee"
                                class="academy-modal__employee"
                            >
                                <avatar-block
                                    class="academy-modal__employee-avatar"
                                    :image="item.avatar"
                                />
                                <div class="academy-modal__employee-data">
                                    <div class="academy-modal__employee-role">{{ item.role }}</div>
                                    <div class="academy-modal__employee-name">{{ item.lastName }} <br>{{ item.firstName }} {{ item.middle }}</div>
                                    <div class="academy-modal__employee-phone">{{ item.phone | formatPhone }}</div>
                                </div>
                                <a
                                    class="academy-modal__phone-icon"
                                    :href="`tel:${item.phone}`"
                                ></a>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </slide-right>
    </div>
</template>

<script>
import ButtonBlock from '../button'
import SlideRight from '../slide-right';
import AvatarBlock from '../avatar';

import { getYandexMapAddressLink } from '@/tools';

import api from '@/api';

export default {
    name: 'AcademyModal',
    components: {
        SlideRight,
        ButtonBlock,
        AvatarBlock
    },
    props: {
        id: Number
    },
    data: () => ({
        academy: {},
        employee: [],
        isLoading: true
    }),
    created() {
        this.fetchPage();
    },
    methods: {
        getYandexMapAddressLink,
        async fetchPage() {
            try {
                const data = await api.academy.getAcademyView(this.id);
                this.academy = data.academy || {};
                this.employee = data.employee || [];
                this.isLoading = false;
            } catch (error) {
                if (error.status === 403) {
                    this.$emit('close');
                    this.addActionError({
                        title: 'Ошибка',
                        text: 'Вы не можете просматривать эту академию'
                    });
                }
            }
        },
        unFormattedPhone(phone) {
            return String(phone).replace(/\D/g, '');
        },
        formatUrl(url) {
            let pureUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/gi, '');
            pureUrl = pureUrl.replace(/\/$/, '');
            return {
                withoutProtocol: pureUrl,
                withProtocol: 'https://' + pureUrl,
            }
        }
    }
}
</script>

<style src="./academy-modal.less" lang="less"/>
