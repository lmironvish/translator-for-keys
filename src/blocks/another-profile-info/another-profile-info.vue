<template>
    <div :class="getBemClass('another-profile-info', { noBorder })">
        <div
            class="another-profile-info__left"
            :style="{ flexGrow: isInnerUserHeader ? 0 : 1 }"
        >
            <avatar-block
                class="another-profile-info__avatar"
                :image="avatar"
            />
            <div class="another-profile-info__content">
                <p class="another-profile-info__header">{{ role }}</p>
                <p class="another-profile-info__text">
                    {{ firstName }} {{ middleName }} {{ lastName }}
                </p>
                <a :href="`tel:${phone}`" class="another-profile-info__phone">{{
                    phone | formatPhone
                }}</a>
            </div>
        </div>
        <div v-if="isInnerUserHeader" class="another-profile-info__right">
            <div class="another-profile-info__info-box">
                <div class="another-profile-info__header">
                    Дата приема на работу
                </div>
                <div class="another-profile-info__small-text">
                    {{ hireDate ? moment(hireDate).format("DD.MM.YYYY") : "-" }}
                </div>
            </div>
            <div class="another-profile-info__info-box">
                <div class="another-profile-info__header">
                    Регион
                </div>
                <div class="another-profile-info__small-text">
                    <p
                        class="another-profile-info__region"
                        v-for="region in trainingRegions"
                        :key="region"
                    >
                        {{ region }}
                    </p>
                    <p
                        v-if="!trainingRegions.length"
                        class="another-profile-info__region"
                    >
                        -
                    </p>
                </div>
            </div>
            <div class="another-profile-info__info-box">
                <div class="another-profile-info__header">
                    Стаж
                </div>
                <div class="another-profile-info__small-text">
                    {{
                        hireDate
                            ? calcDateDiff(new Date(), new Date(hireDate))
                            : "-"
                    }}
                </div>
            </div>

            <div class="another-profile-info__info-box">
                <div class="another-profile-info__header">
                    Город
                </div>
                <div class="another-profile-info__small-text">
                    <span
                        class="another-profile-info__region"
                        v-for="(city, index) in cities"
                        :key="city"
                    >
                        {{ city + (index === cities.length - 1 ? "" : ", ") }}
                    </span>
                    <span
                        v-if="!cities.length"
                        class="another-profile-info__region"
                    >
                        -
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AvatarBlock from "../avatar";
import moment from "moment";
import { pural } from "@/tools";
import { mapGetters } from "vuex";

export default {
    name: "AnotherProfileInfo",
    inheritAttrs: false,
    components: {
        AvatarBlock
    },
    props: {
        avatar: Object,
        role: String,
        firstName: String,
        middleName: String,
        lastName: String,
        phone: String,
        hireDate: String,
        trainingRegions: {
            type: Array,
            default: () => []
        },
        cities: {
            type: Array,
            default: () => []
        },
        noBorder: Boolean
    },
    computed: {
        ...mapGetters("resource", ["rolesOuter"]),
        isInnerUserHeader() {
            const roles = this.rolesOuter.map(i => i.index);
            return !roles.includes(this.role);
        }
    },
    methods: {
        moment,
        calcDateDiff(date1, date2) {
            const diff = Math.floor(date1.getTime() - date2.getTime());
            const day = 1000 * 60 * 60 * 24;

            const days = Math.floor(diff / day);
            const months = Math.floor(days / 31);
            const years = Math.floor(months / 12);

            return `${years ? pural(years, "год", "года", "лет") : ""} ${
                months ? pural(months, "месяц", "месяца", "месяцев") : ""
            }`;
        }
    }
};
</script>

<style src="./another-profile-info.less" lang="less" />
