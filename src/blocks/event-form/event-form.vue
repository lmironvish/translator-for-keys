<template>
    <div class="event-form">
        <page-header :header="isNew ? 'Создать семинар' : 'Редактирование семинара'"/>

        <tabs-block
            v-if="tabs.length > 1"
            class="event-form__tabs"
            :tabs="tabs"
            :active-tab-id="activeTabId"
            @tab-click="setActiveTabId"
        />

        <form class="event-form__form" @submit.prevent="confirmForm()">
            <div class="event-form__fields">
                <form-field width="100%" inline :custom-errors="customErrors.blocked">
                    <checkbox-block v-model="event.blocked">
                        Заблокировать возможность самостоятельной записи
                    </checkbox-block>
                </form-field>

                <form-field
                    v-if="isNew"
                    label="Шаблон"
                    inline
                    :width="25"
                    :validator="$v.event.template"
                    :custom-errors="customErrors.template"
                >
                    <filter-select
                        :field="{ value: event.template, options: templateOptions }"
                        :has-error="$v.event.template.$error"
                        @input="event.template = $event.value || null"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'academy'"
                    label="Даты проведения"
                    inline
                    :width="25"
                    :validator="$v.event.dates"
                    :custom-errors="customErrors.dates"
                >
                    <multiple-dates
                        :field="{ value: event.dates, disabled: !event.template }"
                        :has-error="$v.event.dates.$error"
                        @input="event.dates = $event.value"
                    />
                </form-field>

                <form-field
                    label="Временная зона"
                    inline
                    :width="25"
                    :validator="$v.event.timeZone"
                    :custom-errors="customErrors.timeZone"
                >
                    <filter-select
                        :field="{
                            value: event.timeZone,
                            options: [],
                            globalResource: 'timeZones',
                            disabled: !event.template,
                        }"
                        @input="event.timeZone = $event.value || null"
                    />
                </form-field>

                <form-field
                    v-if="eventType !== 'academy'"
                    label="Дата начала"
                    inline
                    :width="25"
                    :validator="$v.event.dateBegin"
                    :custom-errors="customErrors.dateBegin"
                >
                    <filter-date
                        :field="{ value: event.dateBegin, isTimePicker: true, description: 'Дата начала', disabled: !event.template }"
                        :has-error="$v.event.dateBegin.$error"
                        @input="event.dateBegin = $event.value"
                    />
                </form-field>

                <form-field
                    label="Преподаватели"
                    inline
                    :width="25"
                    :validator="$v.event.teachers"
                    :custom-errors="customErrors.teachers"
                >
                    <filter-select
                        :field="{
                            value: event.teachers,
                            options: teacherOptions,
                            multiple: true,
                            resource: true,
                            disabled: !event.template,
                        }"
                        :has-error="$v.event.teachers.$error"
                        @input="event.teachers = $event.value || []"
                        @searchChange="handleSearchTeachers"
                    />
                </form-field>

                <form-field
                    v-if="isNew"
                    label="Страна*"
                    inline
                    :width="25"
                >
                    <filter-select
                        :field="{
                            value: event.country,
                            options: countriesOptions,
                            resource: true,
                            disabled: !event.template,
                        }"
                        @input="handleCountryInput"
                        @searchChange="handleSearchCountries"
                    />
                    <div class="event-form__form-field-note">Обязательно к выбору</div>
                </form-field>

                <form-field
                    label="Академия"
                    inline
                    :width="25"
                    :validator="$v.event.academy"
                    :custom-errors="customErrors.academy"
                >
                    <filter-select
                        :field="{ value: event.academy, options: academyOptions, resource: true, disabled: !event.template || !event.country }"
                        :has-error="$v.event.academy.$error"
                        @input="handleAcademyInput"
                        @searchChange="handleSearchAcademy"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'academy'"
                    label="Регион обучения"
                    inline
                    :width="25"
                    :validator="$v.event.trainingRegion"
                    :custom-errors="customErrors.trainingRegion"
                >
                    <filter-select
                        :field="{
                            value: event.trainingRegion,
                            options: trainingRegionOptions,
                            resource: true,
                            disabled: !event.academy || !event.template,
                        }"
                        :has-error="$v.event.trainingRegion.$error"
                        @input="event.trainingRegion = $event.value || null"
                        @searchChange="handleSearchTrainingRegions"
                    />
                </form-field>

                <form-field
                    label="Название"
                    inline
                    :width="25"
                    :validator="$v.event.title"
                    :custom-errors="customErrors.title"
                >
                    <filter-input
                        :field="{ value: event.title, disabled: true }"
                        :has-error="$v.event.title.$error"
                        @input="event.title = $event.value"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'academy'"
                    label="Цена"
                    inline
                    :width="25"
                    :custom-errors="customErrors.price"
                >
                    <filter-input
                        :field="{ value: event.price, type: 'number', disabled: !event.template }"
                        @input="event.price = $event.value ? +$event.value : null"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'academy'"
                    label="Описание"
                    inline
                    :width="25"
                    :custom-errors="customErrors.description"
                >
                    <textarea-block
                        :field="{ value: event.description, disabled: !event.template }"
                        @input="event.description = $event.value"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'academy'"
                    label="Программа"
                    inline
                    :width="25"
                    :custom-errors="customErrors.program"
                >
                    <textarea-block
                        :field="{ value: event.program, disabled: !event.template }"
                        @input="event.program = $event.value"
                    />
                </form-field>

                <form-field
                    label="Дополнительная информация"
                    inline
                    :width="25"
                    :custom-errors="customErrors.additionalInformation"
                >
                    <textarea-block
                        :field="{ value: event.additionalInformation, disabled: !event.template }"
                        @input="event.additionalInformation = $event.value"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'academy'"
                    inline
                    label="Темы"
                    :width="25"
                    :validator="$v.event.topics"
                    :customErrors="customErrors.topics"
                >
                    <multiple-input
                        :field="{ value: event.topics, disabled: !event.template }"
                        :has-error="$v.event.topics.$error"
                        @input="event.topics = $event.value"
                        @validateAction="validateAction($v.event.topics, $event)"
                    />
                </form-field>

                <form-field
                    label="Кол-во участников"
                    inline
                    :width="25"
                    :custom-errors="[...customErrors.minStudents || [], ...customErrors.maxStudents || []]"
                >
                    <range-input
                        :min="{ value: studentsRange[0], placeholder: 'Мин', type: 'number', disabled: !event.template }"
                        :max="{ value: studentsRange[1], placeholder: 'Макс', type: 'number', disabled: !event.template }"
                        @input="studentsRange = $event"
                    />
                </form-field>

                <form-field label="Бренд" inline :width="25" :custom-errors="customErrors.brand">
                    <filter-select
                        :field="{ value: event.brand, options: brandOptions, disabled: !event.template }"
                        @input="event.brand = $event.value || null"
                        @searchChange="handleSearchTeachers"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'academy'"
                    inline
                    label="Группа"
                    :width="25"
                    :custom-errors="customErrors.category"
                >
                    <filter-select
                        :field="{ value: event.category, options: categoryOptions, disabled: !event.template,  resource: true, }"
                        @input="event.category = $event.value || null"
                        @searchChange="handleSearchCategory"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'academy'"
                    inline
                    label="Уровень"
                    :width="25"
                    :custom-errors="customErrors.level"
                >
                    <filter-select
                        :field="{ value: event.level, options: levelOptions, disabled: !event.template }"
                        @input="event.level = $event.value || null"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'field'"
                    label="Салон/магазин/индивидуал"
                    inline
                    :width="25"
                    :validator="$v.event.salon"
                    :custom-errors="customErrors.salon"
                >
                    <filter-select
                        :field="{
                                value: event.salon,
                                options: filteredInvitedSalonsOptions,
                                resource: true,
                                disabled: !event.template,
                            }"
                        :has-error="$v.event.salon.$error"
                        @input="event.salon = $event.value || null"
                        @searchChange="handleSearchSalon"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'acquaintance' || isEventFieldAndSalonValueEmpty"
                    label="Город"
                    inline
                    :width="25"
                    :validator="!isEventFieldAndSalonValueEmpty ? $v.event.city : null"
                    :custom-errors="customErrors.city"
                >
                    <filter-select
                        :field="{
                            value: event.city,
                            options: cityOptions,
                            resource: true,
                            disabled: !event.template,
                        }"
                        :has-error="!isEventFieldAndSalonValueEmpty ? $v.event.city.$error : null"
                        @input="event.city = $event.value || null"
                        @searchChange="handleSearchCity"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'acquaintance' || isEventFieldAndSalonValueEmpty"
                    label="Название адреса"
                    inline
                    :width="25"
                    :validator="$v.event.address"
                    :custom-errors="customErrors.address"
                >
                    <filter-input
                        :field="{ value: event.address, disabled: !event.template }"
                        :has-error="$v.event.address.$error"
                        @input="event.address = $event.value"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'field'"
                    label="Приглашенные салоны"
                    inline
                    :width="25"
                    :custom-errors="customErrors.invitedSalons"
                >
                    <filter-select
                        :field="{
                                value: event.invitedSalons,
                                options: filteredSalonsOptions,
                                multiple: true,
                                resource: true,
                                disabled: !event.template,
                            }"
                        @input="event.invitedSalons = $event.value || []"
                        @searchChange="handleSearchSalon"
                    />
                </form-field>

                <form-field
                    v-if="eventType !== 'academy'"
                    label="Описание"
                    inline
                    :width="25"
                    :custom-errors="customErrors.description"
                >
                    <textarea-block
                        :field="{ value: event.description, disabled: !event.template }"
                        @input="event.description = $event.value"
                    />
                </form-field>

                <form-field
                    v-if="eventType === 'field' || eventType === 'acquaintance'"
                    label="Цель"
                    inline
                    :width="25"
                    :custom-errors="customErrors.goal"
                >
                    <filter-input
                        :field="{ value: event.goal, disabled: !event.template }"
                        @input="event.goal = $event.value"
                    />
                </form-field>
                <form-field :width="100" inline :custom-errors="customErrors.isAddressDisabled">
                    <checkbox-block v-model="event.isAddressDisabled" :disabled="!event.template">
                        Убрать адрес
                    </checkbox-block>
                </form-field>
            </div>

            <form-buttons :hasError="$v.$error" @back="handleBackClick"/>
        </form>

        <transition name="slide-from-right">
            <confirm-event-modal
                v-if="confirmShown"
                :event="event"
                @confirm="saveEvent()"
                @cancel="confirmShown = false"
            />
        </transition>
        <transition name="slide-from-right">
            <div v-if="isModalNoSalonEventInfo" class="event-form__no-salon-event-info-modal">
                <slide-right @close="isModalNoSalonEventInfo = false">
                    <template #title>Внимание! Пригласите участников</template>
                    <div class="event-form__no-salon-event-info-modal-content">
                        <div class="event-form__no-salon-event-info-modal-text">
                            Зайдите на страницу семинара из Календаря и пригласите участников.
                        </div>
                        <button-block
                            color="black"
                            padding="50"
                            font-size="50"
                            class="event-form__no-salon-event-info-modal-button"
                            @click="$emit('close', true);"
                        >
                            Ок
                        </button-block>
                    </div>
                </slide-right>
            </div>
        </transition>
        <transition name="event-form__fade-animation">
            <div
                v-if="confirmShown || isModalNoSalonEventInfo"
                class="event-form__blackout"
                @click="onBlackoutClick"
            ></div>
        </transition>
    </div>
</template>

<script>
    import PageHeader from '@/blocks/page-header';
    import TabsBlock from '@/blocks/tabs';
    import CheckboxBlock from '@/blocks/checkbox';
    import FormField from '@/blocks/form-field';
    import FilterInput from '@/blocks/filter-input';
    import FilterDate from '@/blocks/filter-date';
    import MultipleDates from '@/blocks/multiple-dates';
    import FilterSelect from '@/blocks/filter-select';
    import RangeInput from '@/blocks/range-input';
    import TextareaBlock from '@/blocks/textarea';
    import MultipleInput from '@/blocks/multiple-input';
    import FormButtons from '@/blocks/form-buttons';
    import ConfirmEventModal from '@/blocks/confirm-event-modal';
    import SlideRight from '@/blocks/slide-right';
    import ButtonBlock from '@/blocks/button';
    import api from '@/api';
    import { mapState } from 'vuex';
    import { validationMixin } from 'vuelidate';
    import { required } from 'vuelidate/lib/validators';
    import { multipleUnique } from '@/validators';
    import { fieldsToValues, goBack } from '@/tools';
    import moment from 'moment';

    export default {
        mixins: [validationMixin],
        props: {
            id: Number,
            initialDate: String,
            initialTeacher: Object,
            academyAvailable: Boolean,
            fieldAvailable: Boolean,
        },
        components: {
            PageHeader,
            CheckboxBlock,
            TabsBlock,
            FormField,
            FilterInput,
            FilterDate,
            MultipleDates,
            FilterSelect,
            RangeInput,
            FormButtons,
            TextareaBlock,
            MultipleInput,
            ConfirmEventModal,
            SlideRight,
            ButtonBlock,
        },
        data: () => ({
            activeTabId: null,
            teacherOptions: [],
            trainingRegionOptions: [],
            academyOptions: [],
            countriesOptions: [],
            salonsOptions: [],
            cityOptions: [],
            categoryOptions: [],
            isSending: false,
            event: {
                blocked: false,
                dates: null,
                dateBegin: null,
                template: null,
                country: null,
                teachers: [],
                academy: null,
                trainingRegion: null,
                title: null,
                price: null,
                program: null,
                description: null,
                topics: [],
                minStudents: null,
                maxStudents: null,
                brand: null,
                category: null,
                level: null,
                goal: null,
                salon: null,
                invitedSalons: [],
                city: null,
                address: null,
                additionalInformation: null,
                isAddressDisabled: null,
                isOnline: null,
                timeZone: null,
            },
            customErrors: {},
            confirmShown: false,
            isModalNoSalonEventInfo: false,
        }),
        validations() {
            const event = {};
            const validationMap = {
                required,
                multipleUnique,
            };
            const rules = {
                required: [],
                multipleUnique: [],
            };

            for (const fieldName of Object.keys(this.event)) {
                event[fieldName] = {};
            }

            if (this.eventType === 'academy') {
                rules.required = ['dates', 'template', 'trainingRegion', 'academy', 'title', 'teachers'];
                rules.multipleUnique = ['topics'];
            } else if (this.eventType === 'field') {
                rules.required = ['dateBegin', 'template', 'title', 'teachers', 'academy'];
                if (this.event.city) {
                    rules.required.push('address');
                }
            } else if (this.eventType === 'acquaintance') {
                rules.required = ['dateBegin', 'template', 'title', 'city', 'address', 'teachers', 'academy'];
            }

            if (this.event.isOnline) {
                rules.required.push('timeZone');
            }

            Object.keys(rules).forEach((key) => {
                for (const fieldName of rules[key]) {
                    if (!event[fieldName]) {
                        event[fieldName] = {};
                    }

                    event[fieldName][key] = validationMap[key];
                }
            });

            return { event };
        },
        computed: {
            ...mapState('resource', {
                brandOptions: 'extendedBrands',
                levelOptions: 'eventLevels',
            }),

            isNew() {
                return !this.id;
            },
            templateOptions() {
                if (this.eventType === 'academy') {
                    return this.$store.state.resource.academyTemplates;
                } else if (this.eventType === 'field' || this.eventType === 'acquaintance') {
                    return [
                        ...this.$store.state.resource.fieldTemplates,
                        ...this.$store.state.resource.acquaintanceTemplates,
                    ];
                }
            },
            isEventFieldAndSalonValueEmpty() {
                return this.eventType === 'field' && !this.event.salon;
            },
            studentsRange: {
                get() {
                    return [this.event.minStudents, this.event.maxStudents];
                },
                set({ value }) {
                    this.event.minStudents = value[0] ? Number(value[0]) : null;
                    this.event.maxStudents = value[1] ? Number(value[1]) : null;
                }
            },
            eventType() {
                if (this.activeTabId === 'academy') {
                    return 'academy';
                } else if (this.activeTabId === 'field') {
                    const isAcquaintance = this.$store.state.resource.acquaintanceTemplates.some((item) => {
                        return this.event.template && item.value === this.event.template.value;
                    });

                    if (isAcquaintance) {
                        return 'acquaintance';
                    } else {
                        return 'field';
                    }
                } else if (this.activeTabId === 'acquaintance') {
                    return 'acquaintance';
                }
            },
            filteredSalonsOptions() {
                return this.salonsOptions.filter((item) => {
                    return !this.event.salon || this.event.salon.value !== item.value;
                });
            },
            filteredInvitedSalonsOptions() {
                return this.salonsOptions.filter((item) => {
                    return !this.event.invitedSalons.find(invitedItem => invitedItem.value === item.value);
                });
            },
            tabs() {
                if (!this.isNew) {
                    return [];
                }

                const tabs = [];

                if (this.academyAvailable) {
                    tabs.push({
                        id: 'academy',
                        text: 'Академический'
                    });
                }
                if (this.fieldAvailable) {
                    tabs.push({
                        id: 'field',
                        text: 'Обучение в салоне'
                    });
                }

                return tabs;
            }
        },
        methods: {
            goBack,

            async handleSearchTeachers({ q }) {
                this.teacherOptions = await api.resource.teachers({ q });
            },
            async handleSearchCountries({ q }) {
                this.countriesOptions = await api.resource.countries({
                    q,
                    isActive: 1
                });
            },
            async handleSearchAcademy({ q }) {
                this.academyOptions = await api.resource.academies({
                    q,
                    country: this.event.country && this.event.country.value
                });
            },
            async handleSearchTrainingRegions({ q }) {
                this.trainingRegionOptions = await api.resource.trainingRegions({
                    q,
                    academy: this.event.academy && this.event.academy.value
                });
            },
            async handleSearchSalon({ q }) {
                this.salonsOptions = await api.resource.salons({ q, withCdcId: 1, withMixed: false });
            },
            async handleSearchCity({ q }) {
                this.cityOptions = await api.resource.cities({ q });
            },
            async handleSearchCategory({ q }) {
                this.categoryOptions = await api.resource.categoryTemplates({ q });
            },
            handleCountryInput(event) {
                this.event.academy = null;
                this.event.country = event.value || null;
            },
            handleAcademyInput(event) {
                this.event.trainingRegion = null;
                this.event.academy = event.value || null;
            },
            confirmForm() {
                this.$v.$touch();
                if (this.$v.$error) {
                    return;
                }
                if (this.activeTabId === 'field' && !this.event.salon && !this.event.city) {
                    this.addActionError({
                        title: 'Заполните обязательное поле',
                        text: 'Заполните поле "Салон" или поле "Город"',
                    });
                    return;
                }

                if (this.isNew) {
                    this.confirmShown = true;
                } else {
                    this.saveEvent();
                }
            },
            async saveEvent() {
                this.confirmShown = false;
                const isEventFieldAndNoSalon = this.eventType === 'field' && !this.event.salon;

                if (this.isSending) {
                    return;
                }

                const event = fieldsToValues(this.event, [
                    'template',
                    'teachers',
                    'academy',
                    'trainingRegion',
                    'brand',
                    'category',
                    'level',
                    'salon',
                    'invitedSalons',
                    'city',
                    'timeZone',
                    'topics'
                ]);

                console.log(event);

                if (this.eventType === 'academy') {
                    event.topics = event.topics.filter(topic => topic);
                }

                // выездные семинары всегда бесплатные
                if (!event.price || this.eventType !== 'academy') {
                    event.price = 0;
                }

                this.isSending = true;

                try {
                    if (this.eventType === 'academy') {
                        if (this.isNew) {
                            await api.training.createAcademyEvent(event);
                        } else {
                            await api.training.editAcademyEvent(this.id, event);
                        }
                    } else if (this.eventType === 'acquaintance') {
                        if (this.isNew) {
                            await api.training.createAcquaintanceEvent(event);
                        } else {
                            await api.training.editAcquaintanceEvent(this.id, event);
                        }
                    } else if (this.eventType === 'field') {
                        if (this.isNew) {
                            await api.training.createFieldEvent(event);
                        } else {
                            await api.training.editFieldEvent(this.id, event);
                        }
                    } else {
                        return;
                    }

                    if (!isEventFieldAndNoSalon) {
                        this.$emit('close', true);
                    } else {
                        this.isModalNoSalonEventInfo = true;
                    }

                    this.$store.dispatch('notifications/addActionSuccess', {
                        title: 'Успешное сохранение',
                        text: 'Семинар сохранение'
                    });
                } catch (response) {
                    this.customErrors = this.getErrorsFromResponse(response);
                    this.$store.dispatch('notifications/addActionError', { response });
                } finally {
                    this.isSending = false;
                }
            },
            setActiveTabId(id) {
                this.activeTabId = id;
                this.event.template = null;
            },
            handleBackClick() {
                if (this.id) {
                    goBack({ name: 'dashboard.Event', params: { id: this.id } });
                } else {
                    this.$emit('close');
                }
            },
            getErrorsFromResponse(response) {
                if (!response.data || !response.data.data || !response.data.data.violations) {
                    return {};
                }

                const result = {};

                response.data.data.violations.forEach((el) => {
                    if (!result[el.propertyPath]) {
                        result[el.propertyPath] = [];
                    }

                    result[el.propertyPath].push(el.title);
                });

                return result;
            },
            onBlackoutClick() {
                this.isModalNoSalonEventInfo = false;
                this.confirmShown = false;
            },
        },
        watch: {
            async 'event.academy'(academy) {
                this.trainingRegionOptions = await api.resource.trainingRegions({
                    academy: academy && academy.value
                });
            },
            async 'event.template'(templateObject) {
                if (templateObject && this.isNew) {
                    const id = templateObject.value;
                    let template;

                    if (this.activeTabId === 'academy') {
                        template = await api.training.getAcademy({ id });
                    } else if (this.activeTabId === 'field') {
                        template = await api.training.getField({ id });
                    }

                    this.event.title = template.title;
                    this.event.price = template.price;
                    this.event.brand = template.brand;
                    this.event.category = template.category;
                    this.event.description = template.description;
                    this.event.additionalInformation = template.additionalInformation;
                    this.event.level = template.level;
                    this.event.minStudents = template.minStudents;
                    this.event.maxStudents = template.maxStudents;
                    this.event.program = template.program;
                    this.event.goal = template.goal;
                    this.event.topics = template.topics;
                    this.event.isAddressDisabled = template.isAddressDisabled;
                    this.event.isOnline = template.isOnline;
                }
            },
            'event.salon'(value) {
                if (this.activeTabId === 'field' && value) {
                    this.event.city = null;
                    this.event.address = null;

                }
            },
        },
        async created() {
            if (!this.isNew) {
                this.event = await api.training.getEditEvent(this.id);
                this.activeTabId = this.event.type.toLowerCase();
                const apiMethod = this.event.type === 'Academy' ? api.training.getAcademy : api.training.getField;
                const { isOnline } = await apiMethod({ id: this.event.template.value });
                this.event = { ...this.event, isOnline };
            } else {
                if (this.tabs[0]) {
                    this.activeTabId = this.tabs[0].id;
                }

                if (this.initialDate) {
                    const date = moment(this.initialDate);

                    this.event.dateBegin = date.set({ hours: 9, minutes: 30, seconds: 0 }).format();
                }
                if (this.initialTeacher) {
                    this.event.teachers.push(this.initialTeacher);
                }
            }
        },
    }
</script>

<style src="./event-form.less" lang="less"/>
