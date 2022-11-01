<template>
    <div class="event-description">
        <div
            v-if="
                !isTemplate &&
                    eventData.parentSeminars &&
                    eventData.parentSeminars.length > 0 &&
                    !eventMeta.permissions.participateInEvent &&
                    isAlertTypeConditions
            "
            class="event-description__item"
        >
            <p class="event-description__item-label">Пройдите онлайн семинар</p>
            // TODO: missing key
            <p
                v-for="parentSeminar in eventData.parentSeminars"
                class="event-description__item-text"
            >
                <router-link
                    :to="{
                        name: 'dashboard.Calendar',
                        params: { categoryOnlineInitialValue: 1 },
                    }"
                    v-html="parentSeminar"
                />
            </p>
        </div>

        <div
            v-if="
                !isTemplate &&
                    eventData.childrenSeminars &&
                    eventData.childrenSeminars.length > 0 &&
                    canParticipate
            "
            class="event-description__item"
        >
            <p class="event-description__item-label">
                Доступные семинары после прохождения семинара "{{
                    eventData.title
                }}"
            </p>
            // TODO: missing key
            <p
                v-for="childrenSeminar in eventData.childrenSeminars"
                class="event-description__item-text"
            >
                <router-link
                    :to="{
                        name: 'dashboard.Calendar',
                        params: { categoryOnlineInitialValue: 0 },
                    }"
                    v-html="childrenSeminar"
                />
            </p>
        </div>

        <div v-if="eventData.description" class="event-description__item">
            <p class="event-description__item-label">Описание</p>
            <p
                class="event-description__item-text event-description__item-text_pre-wrap"
                v-html="createLinksInText(eventData.description)"
            ></p>
        </div>
        <div
            v-if="eventData.additionalInformation"
            class="event-description__item"
        >
            <p class="event-description__item-label">
                Дополнительная информация
            </p>
            <p
                class="event-description__item-text event-description__item-text_pre-wrap"
                v-html="createLinksInText(eventData.additionalInformation)"
            ></p>
        </div>
        <div v-if="eventData.creator" class="event-description__item">
            <p class="event-description__item-label">Создатель семинара</p>
            <p class="event-description__item-text">
                <span v-if="getIsOuterRole">{{ eventData.creator.fio }}</span>
                <auto-link
                    v-else
                    :user-id="eventData.creator.id"
                    :role="eventData.creator.role"
                >
                    {{ eventData.creator.fio }}
                </auto-link>
            </p>
        </div>
        <div
            v-if="eventData.teachers && eventData.teachers.length > 0"
            class="event-description__item"
        >
            <p class="event-description__item-label">Преподаватели семинара</p>
            <div
                v-for="(teacher, index) in eventData.teachers"
                :key="teacher.id"
                :class="{
                    'event-description__teacher-block': !teacher.accepted,
                }"
            >
                <p class="event-description__item-text">
                    <template v-if="eventData.teachers.length > 1"
                        >{{ index + 1 }}.</template
                    >
                    <span v-if="getIsOuterRole">{{ teacher.fio }}</span>
                    <auto-link
                        v-else
                        :user-id="teacher.id"
                        :role="teacher.role"
                    >
                        {{ teacher.fio }}
                    </auto-link>
                </p>
                <p
                    v-if="!teacher.accepted"
                    class="event-description__item-info"
                >
                    не подтвердил участие
                </p>
            </div>
        </div>
        <div v-if="eventData.duration" class="event-description__item">
            <p class="event-description__item-label">
                Продолжительность семинара
            </p>
            <p
                class="event-description__item-text"
                v-html="createLinksInText(eventData.duration)"
            ></p>
        </div>

        <div v-if="eventData.program" class="event-description__item">
            <p class="event-description__item-label">Программа семинара</p>
            <p
                class="event-description__item-text event-description__item-text_pre-wrap"
                v-html="createLinksInText(eventData.program)"
            ></p>
        </div>
    </div>
</template>

<script>
import AutoLink from '../auto-link';

import { createLinksInText } from '@/tools';

export default {
    components: {
        AutoLink,
    },
    props: {
        eventData: Object,
        eventMeta: Object,
        isTemplate: Boolean,
        isAlertTypeConditions: Boolean,
    },
    methods: {
        createLinksInText,
    },
    data() {
        return {
            outerRoles: [
                'ROLE_STYLIST',
                'ROLE_ADMIN_SALON',
                'ROLE_SALON_OWNER',
                'ROLE_MARKET',
            ],
        };
    },
    computed: {
        getIsOuterRole() {
            const role = this.$store.state.user.data.role;

            return this.outerRoles.findIndex(r => r === role) !== -1;
        },
    },
};
</script>

<style src="./event-description.less" lang="less" />
