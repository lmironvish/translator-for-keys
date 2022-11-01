<template>
    <div class="register-kpi">
        <slide-right :scroll-lock="true" @close="$emit('close')">
            <template v-slot:title>
                {{ getKipName }}
            </template>
            <template v-slot:default>
                <div class="register-kpi__tabs-holder">
                    <Tabs
                        v-if="yearsTabs.length"
                        :active-tab-id="currentYearTab"
                        :tabs="yearsTabs"
                        @tab-click="switchTab"
                    ></Tabs>
                </div>
                <form class="register-kpi__form" @submit.prevent="onSubmit">
                    <template v-if="['clients'].includes(mode)">
                        <div class="register-kpi__columns-holder">
                            <p
                                class="register-kpi__head-form register-kpi__column register-kpi__column_first"
                            >
                                Месяц
                            </p>
                            <p
                                class="register-kpi__head-form register-kpi__column register-kpi__column_second"
                            >
                                Значение
                            </p>
                        </div>
                        <div
                            v-for="item in itemsView"
                            class="register-kpi__columns-holder register-kpi__item"
                        >
                            <filter-date
                                :disabled="disabledElement({ date: item.date })"
                                :disabled-dates="currentYearDisabledDates"
                                :field="{
                                    value: item.date,
                                    isTimePicker: false
                                }"
                                :is-clearable="false"
                                class="register-kpi__head-form register-kpi__column register-kpi__column_first"
                                is-month-picker
                                @input="item.date = $event.value"
                            />
                            <filter-input
                                :disabled="disabledElement({ date: item.date })"
                                :field="{ value: item.value }"
                                class="register-kpi__head-form register-kpi__column register-kpi__column_second"
                                @input="item.value = $event.value"
                            />
                            <button
                                :disabled="disabledElement({ date: item.date })"
                                class="register-kpi__delete-button"
                                type="button"
                                @click="deletePeriod(item)"
                            ></button>
                        </div>
                    </template>

                    <template
                        v-if="
                            [
                                'zakb',
                                'seminars',
                                'contacts',
                                'webinars',
                                'salons',
                                'sales'
                            ].includes(mode)
                        "
                    >
                        <div
                            v-for="item in itemsView"
                            class="register-kpi__columns-holder register-kpi__item register-kpi__item_inline"
                        >
                            <form-field :width="100" inline label="Месяц">
                                <filter-date
                                    :disabled="
                                        disabledElement({ date: item.date })
                                    "
                                    :disabled-dates="currentYearDisabledDates"
                                    :field="{
                                        value: item.date,
                                        isTimePicker: false
                                    }"
                                    :is-clearable="false"
                                    is-month-picker
                                    @input="item.date = $event.value"
                                />
                            </form-field>
                            <template v-if="['sales', 'zakb'].includes(mode)">
                                <form-field :width="50" inline label="SKP">
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{ value: item.skp_value }"
                                        @input="item.skp_value = $event.value"
                                    />
                                </form-field>
                                <form-field :width="50" inline label="INDOLA">
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{ value: item.indola_value }"
                                        @input="
                                            item.indola_value = $event.value
                                        "
                                    />
                                </form-field>
                                <form-field :width="50" inline label="STMNT">
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{ value: item.stmnt_value }"
                                        @input="item.stmnt_value = $event.value"
                                    />
                                </form-field>
                            </template>
                            <!--                            <template v-if="mode === 'zakb'">
                                <form-field :width="50" inline label="SKP">
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{ value: item.skp_value }"
                                        @input="item.skp_value = $event.value"
                                    />
                                </form-field>
                                <form-field :width="50" inline label="INDOLA">
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{ value: item.indola_value }"
                                        @input="
                                            item.indola_value = $event.value
                                        "
                                    />
                                </form-field>
                            </template>-->
                            <template
                                v-if="
                                    ['seminars', 'contacts', 'salons'].includes(
                                        mode
                                    )
                                "
                            >
                                <form-field
                                    :width="50"
                                    inline
                                    label="Количество"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{ value: item.quantity_value }"
                                        @input="
                                            item.quantity_value = $event.value
                                        "
                                    />
                                </form-field>
                                <form-field
                                    :width="50"
                                    inline
                                    label="Уникальных"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{ value: item.uniques_value }"
                                        @input="
                                            item.uniques_value = $event.value
                                        "
                                    />
                                </form-field>
                            </template>
                            <template v-if="mode === 'webinars'">
                                <form-field
                                    :width="50"
                                    inline
                                    label="Продуктовые PPS"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{
                                            value: item.products_pps_value
                                        }"
                                        @input="
                                            item.products_pps_value =
                                                $event.value
                                        "
                                    />
                                </form-field>
                                <form-field
                                    :width="50"
                                    inline
                                    label="Продуктовые Sales"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{
                                            value: item.products_sales_value
                                        }"
                                        @input="
                                            item.products_sales_value =
                                                $event.value
                                        "
                                    />
                                </form-field>
                                <form-field
                                    :width="100"
                                    inline
                                    label="Бизнес тренинги"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({ date: item.date })
                                        "
                                        :field="{
                                            value: item.business_trainings_value
                                        }"
                                        @input="
                                            item.business_trainings_value =
                                                $event.value
                                        "
                                    />
                                </form-field>
                            </template>
                            <button
                                :disabled="disabledElement({ date: item.date })"
                                class="register-kpi__delete-button register-kpi__delete-button_absolute"
                                type="button"
                                @click="deletePeriod(item)"
                            ></button>
                        </div>
                    </template>

                    <template v-if="['indola', 'skp'].includes(mode)">
                        <div
                            v-for="item in itemsView"
                            class="register-kpi__columns-holder register-kpi__item register-kpi__item_inline"
                        >
                            <!--                            <form-field inline label="Год" :width="100">
                                <filter-date
                                    :field="{
                                        value: `${item.date}-01-01`,
                                        isTimePicker: false
                                    }"
                                    :disabled-dates="currentYearDisabledDates"
                                    @input="
                                        item.date = new Date($event.value)
                                            .getFullYear()
                                            .toString()
                                    "
                                    is-year-picker
                                />
                            </form-field>-->
                            <form-field :width="100" inline label="Квартал">
                                <filter-select
                                    :disabled="
                                        disabledElement({
                                            date: item.date,
                                            quarter: item.quarter
                                        })
                                    "
                                    :field="{
                                        value: findQuarterOption(item.quarter),
                                        options:
                                            availableQuarters[item.date] ||
                                            $options._quarterOptions ||
                                            [],
                                        disabled: !item.date
                                    }"
                                    @input="
                                        item.quarter =
                                            $event.value.value || null
                                    "
                                />
                            </form-field>

                            <template v-if="mode === 'indola'">
                                <form-field
                                    :width="50"
                                    class="register-kpi__fields_space-between"
                                    inline
                                    label="Entrepreneur продажи"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({
                                                date: item.date,
                                                quarter: item.quarter
                                            })
                                        "
                                        :field="{
                                            value: item.entrepreneur_sales_value
                                        }"
                                        @input="
                                            item.entrepreneur_sales_value =
                                                $event.value
                                        "
                                    />
                                </form-field>
                                <form-field
                                    :width="50"
                                    class="register-kpi__fields_space-between"
                                    inline
                                    label="Entrepreneur двери"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({
                                                date: item.date,
                                                quarter: item.quarter
                                            })
                                        "
                                        :field="{
                                            value: item.entrepreneur_doors_value
                                        }"
                                        @input="
                                            item.entrepreneur_doors_value =
                                                $event.value
                                        "
                                    />
                                </form-field>
                            </template>

                            <form-field
                                :width="50"
                                inline
                                label="Welcome продажи"
                            >
                                <filter-input
                                    :disabled="
                                        disabledElement({
                                            date: item.date,
                                            quarter: item.quarter
                                        })
                                    "
                                    :field="{ value: item.welcome_sales_value }"
                                    @input="
                                        item.welcome_sales_value = $event.value
                                    "
                                />
                            </form-field>
                            <form-field
                                :width="50"
                                inline
                                label="Welcome двери"
                            >
                                <filter-input
                                    :disabled="
                                        disabledElement({
                                            date: item.date,
                                            quarter: item.quarter
                                        })
                                    "
                                    :field="{ value: item.welcome_doors_value }"
                                    @input="
                                        item.welcome_doors_value = $event.value
                                    "
                                />
                            </form-field>
                            <form-field
                                :width="50"
                                inline
                                label="Strong продажи"
                            >
                                <filter-input
                                    :disabled="
                                        disabledElement({
                                            date: item.date,
                                            quarter: item.quarter
                                        })
                                    "
                                    :field="{ value: item.strong_sales_value }"
                                    @input="
                                        item.strong_sales_value = $event.value
                                    "
                                />
                            </form-field>
                            <form-field :width="50" inline label="Strong двери">
                                <filter-input
                                    :disabled="
                                        disabledElement({
                                            date: item.date,
                                            quarter: item.quarter
                                        })
                                    "
                                    :field="{ value: item.strong_doors_value }"
                                    @input="
                                        item.strong_doors_value = $event.value
                                    "
                                />
                            </form-field>

                            <template v-if="mode === 'skp'">
                                <form-field
                                    :width="50"
                                    inline
                                    label="KAM продажи"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({
                                                date: item.date,
                                                quarter: item.quarter
                                            })
                                        "
                                        :field="{
                                            value: item.kam_sales_value
                                        }"
                                        @input="
                                            item.kam_sales_value = $event.value
                                        "
                                    />
                                </form-field>
                                <form-field
                                    :width="50"
                                    inline
                                    label="KAM двери"
                                >
                                    <filter-input
                                        :disabled="
                                            disabledElement({
                                                date: item.date,
                                                quarter: item.quarter
                                            })
                                        "
                                        :field="{
                                            value: item.kam_doors_value
                                        }"
                                        @input="
                                            item.kam_doors_value = $event.value
                                        "
                                    />
                                </form-field>
                            </template>

                            <button
                                :disabled="
                                    disabledElement({
                                        date: item.date,
                                        quarter: item.quarter
                                    })
                                "
                                class="register-kpi__delete-button register-kpi__delete-button_absolute"
                                type="button"
                                @click="deletePeriod(item)"
                            ></button>
                        </div>
                    </template>

                    <button-block
                        :disabled="buttonIsDisabled"
                        class="register-kpi__button"
                        color="linear-black"
                        font-size="50"
                        padding="50"
                        @click="items.push(cloneDeep(dataModel))"
                    >
                        Добавить
                        {{
                            ["indola", "skp"].includes(mode)
                                ? "квартал"
                                : "месяц"
                        }}
                    </button-block>
                    <div class="register-kpi__year-sum">
                        Итого за {{ currentYearString }} год:

                        <component :is="mode === 'clients' ? 'span' : 'div'">
                            <template
                                v-for="(value, key) in yearsStats[
                                    currentYearString
                                ]"
                            >
                                <span
                                    v-if="value"
                                    :class="{
                                        'register-kpi__report-item': ![
                                            'clients',
                                            'sales'
                                        ].includes(mode)
                                    }"
                                >
                                    <span class="register-kpi__text_bold">{{
                                        $options._dictionary[key]
                                    }}</span>
                                    {{ value }}
                                </span>
                            </template>
                        </component>
                    </div>
                    <p v-if="error" class="register-kpi__error">{{ error }}</p>
                    <button-block
                        :is-submit="true"
                        class="register-kpi__button register-kpi__button_submit"
                        color="black"
                        font-size="55"
                        padding="55"
                    >
                        Сохранить
                    </button-block>
                </form>
            </template>
        </slide-right>
    </div>
</template>

<script>
import ButtonBlock from "../button";
import SlideRight from "../slide-right";
import FilterDate from "../filter-date";
import FilterInput from "../filter-input";

import departments from "./data/departments";

import api from "@/api";
import FormField from "../form-field/form-field";
import { assignInWith, cloneDeep, partialRight, difference } from "lodash";
import FilterSelect from "../filter-select/filter-select";
import Tabs from "../tabs/tabs";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
    name: "RegisterKpi",
    components: {
        Tabs,
        FilterSelect,
        FormField,
        SlideRight,
        ButtonBlock,
        FilterDate,
        FilterInput
    },
    props: {
        id: Number,
        mode: {
            type: String,
            validator: val =>
                [
                    "clients",
                    "sales",
                    "zakb",
                    "skp",
                    "indola",
                    "seminars",
                    "contacts",
                    "webinars",
                    "salons"
                ].includes(val),
            required: true
        }
    },
    data: () => ({
        items: [],
        error: null,
        currentYearTab: null
    }),
    _departments: departments,
    _dictionary: {
        value: "",
        skp_value: "SKP - ",
        indola_value: "Indola - ",
        stmnt_value: "STMNT - ",
        welcome_sales_value: "Welcome продажи - ",
        welcome_doors_value: "Welcome двери - ",
        strong_sales_value: "Strong продажи - ",
        strong_doors_value: "Strong двери - ",
        entrepreneur_sales_value: "Entrepreneur продажи - ",
        entrepreneur_doors_value: "Entrepreneur двери - ",
        kam_sales_value: "KAM продажи - ",
        kam_doors_value: "KAM двери - ",
        quantity_value: "Количество - ",
        uniques_value: "Уникальных - ",
        products_pps_value: "Продуктовых PPS - ",
        products_sales_value: "Продуктовых Sales - ",
        business_trainings_value: "Бизнес тренингов - "
    },
    _quarterOptions: [
        { index: "1 квартал", value: 1 },
        { index: "2 квартал", value: 2 },
        { index: "3 квартал", value: 3 },
        { index: "4 квартал", value: 4 }
    ],
    async created() {
        this.items = await api.kpi[`${this.mode}Get`](this.id);
        this.currentYearTab = this.yearsTabs[0].id;
    },
    computed: {
        ...mapGetters({
            permissions: "user/permissions"
        }),
        department() {
            for (let key in this.$options._departments) {
                if (this.$options._departments[key].includes(this.mode)) {
                    return key;
                }
            }
        },
        buttonIsDisabled() {
            if (this.currentYearString) {
                if (["indola", "skp"].includes(this.mode)) {
                    return !this.availableQuarters[this.currentYearString]
                        .length;
                } else {
                    return this.currentYearDisabledDates.length === 12;
                }
            }
            return false;
        },
        currentYearString() {
            if (this.currentYearTab) {
                return this.currentYearTab.toString();
            }
        },
        itemsView() {
            if (this.items.length) {
                const items = this.items.filter(i => {
                    const year = new Date(i.date).getFullYear();
                    return year === this.currentYearTab;
                });
                if (["indola", "skp"].includes(this.mode)) {
                    items.sort((a, b) => a.quarter - b.quarter); // сортировка по кварталам
                } else {
                    items.sort(
                        //сортировка по месяцам
                        (a, b) =>
                            new Date(a.date).getMonth() -
                            new Date(b.date).getMonth()
                    );
                }
                return items;
            }
            return [];
        },
        yearsTabs() {
            if (this.items.length) {
                let yearsFromItems = this.items.reduce((acc, val) => {
                    if (val.date) {
                        const year = new Date(val.date).getFullYear();
                        if (!acc.some(i => i.id === year)) {
                            acc.push({ id: year, text: year });
                        }
                    }
                    return acc;
                }, []);
                // const maxYear = yearsFromItems.reduce(
                //     (acc, year) => (+year.id > acc ? year.id : acc),
                //     0
                // );

                // заполнение вкладок промежуточных годов (если item'ы в этих годах отсутствуют) и пустого в конце
                yearsFromItems.forEach(i => {
                    if (!yearsFromItems.some(v => v.id === i.id + 1)) {
                        yearsFromItems.push({ id: i.id + 1, text: i.id + 1 });
                    }
                });

                yearsFromItems = yearsFromItems.sort((a, b) => a.id - b.id);

                return yearsFromItems;
                // return [
                //     ...yearsFromItems,
                //     { id: maxYear + 1, text: maxYear + 1 }
                // ];
            }
            const currentYear = new Date().getFullYear();
            return [
                { id: currentYear, text: currentYear },
                { id: currentYear + 1, text: currentYear + 1 }
            ];
        },
        yearsStats() {
            function customizer(objValue, srcValue) {
                return objValue && srcValue
                    ? parseInt(objValue) + parseInt(srcValue)
                    : objValue;
            }

            if (this.items.length && !this.items[0].date) {
                return {};
            }
            const result = this.items.reduce((acc, item) => {
                if (!item.date) {
                    return acc;
                }
                const currentYear = new Date(item.date)
                    .getFullYear()
                    .toString();

                if (!acc[currentYear]) {
                    acc[currentYear] = {};
                }
                const { date, year, quarter, ...values } = item; // очищаем наши данные от полей дата и год

                const magic = partialRight(assignInWith, customizer);

                acc[currentYear] = magic(acc[currentYear], values);
                return acc;
            }, {});

            // операции необходимые для того чтобы поставить поля Entrepreneur продажи и Entrepreneur двери в начало
            if (Object.keys(result).length) {
                Object.keys(result).forEach(year => {
                    if (
                        result[year].hasOwnProperty("entrepreneur_sales_value")
                    ) {
                        const {
                            entrepreneur_sales_value,
                            entrepreneur_doors_value,
                            ...others
                        } = result[year];
                        result[year] = {
                            entrepreneur_sales_value,
                            entrepreneur_doors_value,
                            ...others
                        };
                    }
                });
            }
            return result;
        },
        disabledDates() {
            if (["indola", "skp"].includes(this.mode)) {
                const dates = [];
                for (let year in this.availableQuarters) {
                    if (!this.availableQuarters[year].length) {
                        dates.push(year);
                    }
                }
                return dates;
            }
            return this.items.map(item => item.date);
        },
        currentYearDisabledDates() {
            if (this.disabledDates) {
                return this.disabledDates.filter(
                    d => new Date(d).getFullYear() === this.currentYearTab
                );
            }
        },
        getKipName() {
            switch (this.mode) {
                case "clients":
                    return "Регистрации";
                case "sales":
                    return "Продажи";
                case "zakb":
                    return "ЗАКБ, двери";
                case "skp":
                    return "CLUB SKP";
                case "indola":
                    return "INDOLA LOYALTY";
                case "seminars":
                    return "Семинары";
                case "contacts":
                    return "Контакты";
                case "webinars":
                    return "Тренинги";
                case "salons":
                    return "Салоны";
            }
        },
        nextAvailableMonth() {
            const monthes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            const usedMonthes = this.itemsView.map(m => {
                return new Date(m.date).getMonth() + 1;
            });

            if (this.currentYearDisabledDates.length < 12) {
                let nextMonthNumber = difference(monthes, usedMonthes)[0];
                if (nextMonthNumber.toString().length < 2)
                    nextMonthNumber = `0${nextMonthNumber}`;
                return `${this.currentYearString}-${nextMonthNumber}-01`;
            }
            return "";
        },
        dataModel() {
            switch (this.mode) {
                case "clients":
                    return {
                        date: this.nextAvailableMonth,
                        value: null
                    };
                case "sales":
                case "zakb":
                    return {
                        date: this.nextAvailableMonth,
                        skp_value: null,
                        indola_value: null,
                        stmnt_value: null
                    };
                // case "zakb":
                // case "sales":
                //     return {
                //         date: this.nextAvailableMonth,
                //         skp_value: null,
                //         indola_value: null
                //     };
                case "skp":
                    return {
                        date: this.currentYearString,
                        quarter: this.nextAvailableQuarter,
                        welcome_sales_value: null,
                        welcome_doors_value: null,
                        strong_sales_value: null,
                        strong_doors_value: null,
                        kam_sales_value: null,
                        kam_doors_value: null
                    };
                case "indola":
                    return {
                        date: this.currentYearString,
                        quarter: this.nextAvailableQuarter,
                        entrepreneur_sales_value: null,
                        entrepreneur_doors_value: null,
                        welcome_sales_value: null,
                        welcome_doors_value: null,
                        strong_sales_value: null,
                        strong_doors_value: null
                    };
                case "seminars":
                case "contacts":
                case "salons":
                    return {
                        date: this.nextAvailableMonth,
                        quantity_value: null,
                        uniques_value: null
                    };
                case "webinars":
                    return {
                        date: this.nextAvailableMonth,
                        products_pps_value: null,
                        products_sales_value: null,
                        business_trainings_value: null
                    };
            }
        },
        nextAvailableQuarter() {
            if (this.availableQuarters) {
                return this.availableQuarters[this.currentYearString].length
                    ? this.availableQuarters[this.currentYearString][0].value
                    : null;
            }
            return {};
        },

        accountedQuarters() {
            if (["skp", "indola"].includes(this.mode)) {
                return this.items.reduce((acc, item) => {
                    if (Object.keys(acc).includes(item.date)) {
                        acc[item.date].push(item.quarter);
                    } else {
                        acc[item.date] = [item.quarter];
                    }
                    return acc;
                }, {});
            }
            return undefined;
        },
        availableQuarters() {
            if (Object.keys(this.accountedQuarters).length) {
                const result = {};
                for (let key in this.accountedQuarters) {
                    if (key) {
                        result[key] = [...this.$options._quarterOptions].filter(
                            i => !this.accountedQuarters[key].includes(i.value)
                        );
                    }
                }
                for (const year of this.yearsTabs.map(i => i.id)) {
                    if (!result.hasOwnProperty(year)) {
                        result[year] = [
                            { index: "1 квартал", value: 1 },
                            { index: "2 квартал", value: 2 },
                            { index: "3 квартал", value: 3 },
                            { index: "4 квартал", value: 4 }
                        ];
                    }
                }
                return result;
            }
            return {
                [this.currentYearString]: [
                    { index: "1 квартал", value: 1 },
                    { index: "2 квартал", value: 2 },
                    { index: "3 квартал", value: 3 },
                    { index: "4 квартал", value: 4 }
                ]
            };
        }
    },
    methods: {
        cloneDeep,
        disabledElement({ date, quarter } = {}) {
            const canUpdatePrevDate = quarter
                ? this.canUpdatePrevQuarter(date, quarter)
                : this.canUpdatePrevMonth(date);
            return (
                !canUpdatePrevDate &&
                !(this.canUpdateSales() || this.canUpdateTrainings())
            );
        },
        canUpdateSales() {
            return (
                this.permissions.canUpdateSalesKpiInThePast &&
                this.department === "sales"
            );
        },
        canUpdateTrainings() {
            return (
                this.permissions.canUpdateTrainingKpiInThePast &&
                this.department === "trainings"
            );
        },
        canUpdatePrevMonth(date) {
            //Временно возвращаем возможность редактировать прошлые месяцы
            return true;
            // return moment().diff(date, "month") <= 0;
        },
        canUpdatePrevQuarter(date, quarter) {
            //Временно возвращаем возможность редактировать прошлые месяцы
            return true;
            /*return (
                moment()
                    .utc()
                    .quarter() <= quarter || moment().format("YYYY") - date < 0
            );*/
        },
        validateData() {
            const isInvalidData = this.items.some(i => {
                for (let key in i) {
                    if (!i[key]) {
                        delete i[key];
                    }
                }
                return false;
            });
            if (isInvalidData) {
                this.error =
                    "Все поля месяцев и значений должны быть заполнены";
            } else {
                this.error = null;
            }
        },
        async onSubmit() {
            this.clearEmptyItems();
            this.validateData();
            if (this.error) {
                return;
            }
            try {
                const preparedItems = cloneDeep(this.items);
                preparedItems.forEach(v => {
                    for (let field in v) {
                        if (field !== "date" && v[field]) {
                            v[field] = parseInt(v[field]);
                        }
                    }
                });
                await api.kpi[`${this.mode}Post`]({
                    id: this.id,
                    items: preparedItems
                });
                this.$emit("close");
                this.addActionSuccess({
                    title: "Успешно",
                    text: "KPI сохранены"
                });
            } catch (response) {
                this.addActionError({ response });
            }
        },
        deletePeriod(item) {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
        },
        findQuarterOption(item) {
            return this.$options._quarterOptions.find(o => o.value === item);
        },
        switchTab(year) {
            this.currentYearTab = year;
        },
        clearEmptyItems() {
            this.items.forEach(i => {
                for (let key in i) {
                    if (!i[key]) {
                        const idx = this.items.findIndex(j => j === i);
                        if (idx >= 0) this.items.splice(idx, 1);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" src="./register-kpi.less" />
