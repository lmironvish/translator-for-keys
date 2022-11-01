<template>
    <div class="invite-stylists-form">
        <slide-right @close="$emit('close')">
            <template #title>{{ isSchedule ? 'Назначить стилистов' : 'Пригласить участников' }}</template>

            <div class="invite-stylists-form__content">
                <div v-if="isSchedule && withPayment" class="invite-stylists-form__payment-text">
                    Нажимая кнопку “Продолжить” Вы соглашаетесь с <a>Правилами</a> записи на платные
                    семинары, в соответствии с которыми в случае последующей отмены записи, инициированной Вашими
                    сотрудниками, возврат денежных средств производиться не будет.
                </div>

                <template v-if="user.role !== 'ROLE_SALON_OWNER'">
                    <form-field label="Страны">
                        <filter-select
                            :field="{
                                value: selectedCountries,
                                options: countriesOptions,
                                resource: true,
                                multiple: true,
                            }"
                            @input="selectedCountries = $event.value || []"
                            @searchChange="updateCountries"
                        />
                    </form-field>
                    <form-field label="Регионы обучения">
                        <filter-select
                            :field="{
                                value: selectedTrainingRegions,
                                options: trainingRegionsOptions,
                                disabled: selectedCountries.length === 0,
                                resource: true,
                                multiple: true,
                            }"
                            @input="selectedTrainingRegions = $event.value || []"
                            @searchChange="updateTrainingRegions"
                        />
                    </form-field>
                    <select-all :options="trainingRegionsOptions" v-model="selectedTrainingRegions"/>

                    <form-field label="Регионы">
                        <filter-select
                            :field="{
                                value: selectedRegions,
                                options: regionsOptions,
                                disabled: selectedTrainingRegions.length === 0,
                                resource: true,
                                multiple: true,
                            }"
                            @input="selectedRegions = $event.value || []"
                            @searchChange="updateRegions"
                        />
                    </form-field>
                    <select-all :options="regionsOptions" v-model="selectedRegions"/>

                    <form-field label="Города">
                        <filter-select
                            :field="{
                                value: selectedCities,
                                options: citiesOptions,
                                disabled: selectedRegions.length === 0,
                                resource: true,
                                multiple: true,
                            }"
                            @input="selectedCities = $event.value || []"
                            @searchChange="updateCities"
                        />
                    </form-field>
                    <select-all :options="citiesOptions" v-model="selectedCities"/>
                </template>

                <form-field label="Салоны/магазины/индивидуалы">
                    <filter-select
                        :field="{
                            value: selectedSalons,
                            options: salonsOptions,
                            disabled: user.role !== 'ROLE_SALON_OWNER' && selectedCities.length === 0,
                            resource: true,
                            multiple: true,
                        }"
                        @input="selectedSalons = $event.value || []"
                        @searchChange="updateSalons"
                    />
                </form-field>
                <select-all :options="salonsOptions" v-model="selectedSalons"/>

                <form-field label="Сотрудники салонов">
                    <filter-select
                        :field="{
                            value: selectedSalonStylists,
                            options: salonStylistsOptions,
                            disabled: isSalonStylistsSelectDisable,
                            resource: true,
                            multiple: true,
                        }"
                        @input="selectedSalonStylists = $event.value || []"
                        @searchChange="updateSalonStylists"
                    />
                </form-field>
                <select-all :options="salonStylistsOptions" v-model="selectedSalonStylists"/>

                <form-field
                    v-if="user.role !== 'ROLE_SALON_OWNER' && selectedSalons.length === 0"
                    label="Клиенты без ДМС"
                >
                    <filter-select
                        :field="{
                            value: selectedPrivateStylists,
                            options: privateStylistsOptions,
                            disabled: selectedCities.length ===  0,
                            resource: true,
                            multiple: true,
                        }"
                        @input="selectedPrivateStylists = $event.value || []"
                        @searchChange="updatePrivateStylists"
                    />
                </form-field>
                <select-all :options="privateStylistsOptions" v-model="selectedPrivateStylists"/>

                <div v-if="canCalculateStylists" class="invite-stylists-form__table-holder">
                    <sorting-block :sorting-list="calculatedStylistsColumns"/>
                    <table-block
                        row-padding-size="50"
                        :rows="calculatedStylists"
                        :columns-style="calculatedStylistsColumns"
                        :has-delete-btn="false"
                        :has-edit-btn="false"
                    />

                    <div class="invite-stylists-form__summary-price">
                        <div class="invite-stylists-form__summary-price-title">Общая сумма:</div>
                        {{ summaryPrice }} ₽
                    </div>
                </div>

                <button-block
                    class="invite-stylists-form__button"
                    color="black"
                    padding="50"
                    :disabled="!canSendStylists"
                    @click="handleButtonClick"
                >
                    {{ isSchedule ? 'Продолжить' : 'Отправить' }}
                </button-block>
            </div>
        </slide-right>
    </div>
</template>

<script>
    import SlideRight from '../slide-right';
    import FilterSelect from '../filter-select';
    import FormField from '../form-field';
    import CheckboxBlock from '../checkbox';
    import TableBlock from '../table';
    import SortingBlock from '../sorting';
    import ButtonBlock from '../button';
    import SelectAll from '../select-all';
    import api from '@/api';
    import { makePayment, PaymentError } from '@/tools/payment';

    export default {
        props: {
            eventId: Number,
            // если true, но назначение вместо приглашения
            isSchedule: {
                type: Boolean,
                default: false,
            },
            withPayment: {
                type: Boolean,
                default: false,
            },
            eventType: String,
        },
        components: {
            SlideRight,
            FilterSelect,
            FormField,
            CheckboxBlock,
            ButtonBlock,
            TableBlock,
            SortingBlock,
            SelectAll,
        },
        data: () => ({
            countriesOptions: [],
            selectedCountries: [],
            selectedTrainingRegions: [],
            trainingRegionsOptions: [],
            selectedRegions: [],
            regionsOptions: [],
            selectedCities: [],
            citiesOptions: [],
            selectedSalons: [],
            salonsOptions: [],
            selectedSalonStylists: [],
            selectedPrivateStylists: [],
            salonStylistsOptions: [],
            privateStylistsOptions: [],
            isProcessing: false,
            calculatedStylists: [],
            calculatedStylistsColumns: [
                {
                    label: 'Стилист',
                    code: 'fio',
                    styles: {
                        desktop: {
                            width: '30%',
                        },
                    },
                },
                {
                    label: 'Цена',
                    code: 'price',
                    styles: {
                        desktop: {
                            width: '30%',
                        },
                    },
                },
                {
                    label: 'Акция',
                    code: 'share',
                    withMobileLabel: true,
                    styles: {
                        desktop: {
                            width: '30%',
                        },
                    },
                },
            ],
        }),
        computed: {
            user() {
                return this.$store.state.user.data;
            },
            summaryPrice() {
                return this.calculatedStylists.reduce((result, item) => item.price + result, 0);
            },
            canSendStylists() {
                return this.selectedStylists.length > 0;
            },
            canCalculateStylists() {
                return this.isSchedule && this.withPayment;
            },
            isSalonStylistsSelectDisable() {
                if (this.eventType === 'Field') {
                    return this.selectedSalons.length === 0 || this.selectedCities.length === 0;
                }
                return this.selectedSalons.length === 0 && this.selectedCities.length === 0;
            },
            selectedStylists() {
                return [...this.selectedPrivateStylists, ...this.selectedSalonStylists];
            },
        },
        methods: {
            async scheduleStylists() {
                if (this.isProcessing) {
                    return;
                }

                let response;

                this.isProcessing = true;

                try {
                    response = await api.training.scheduleStylists({
                        id: this.eventId,
                        stylists: this.selectedStylists.map(item => item.value),
                    });
                } catch (response) {
                    this.isProcessing = false;
                    this.addActionError({ response });

                    return;
                }

                if (response.feeType) {
                    try {
                        await makePayment(response.order);
                    } catch (error) {
                        this.isProcessing = false;

                        if (error instanceof PaymentError) {
                            this.addActionError({
                                title: 'Ошибка',
                                text: error.message,
                            });
                        }

                        return;
                    }
                }

                this.isProcessing = false;
                this.$emit('close', true);
                this.addActionSuccess({
                    title: 'Успешно',
                    text: 'Стилисты назначены на семинар'
                });
            },
            async inviteStylists() {
                if (this.isProcessing) {
                    return;
                }

                this.isProcessing = true;

                try {
                    await api.training.sendEventInvite({
                        id: this.eventId,
                        stylists: this.selectedStylists.map(item => item.value),
                    });

                    this.$emit('close', true);

                    this.addActionSuccess({
                        title: 'Успешно',
                        text: 'Стилисты успешно приглашены'
                    });
                } catch (response) {
                    this.addActionError({ response });
                } finally {
                    this.isProcessing = false;
                }
            },
            async updateCountries({ q } = {}) {
                this.countriesOptions = await api.resource.countries({ q, isActive: 1 });
            },
            async updateTrainingRegions({ q } = {}) {
                if (this.selectedCountries.length === 0) {
                    this.trainingRegionsOptions = [];
                    return;
                }

                this.trainingRegionsOptions = await api.resource.trainingRegions({
                    q,
                    countries: this.selectedCountries.map(item => item.value)
                });
            },
            async updateRegions({ q } = {}) {
                if (this.selectedTrainingRegions.length === 0) {
                    this.regionsOptions = [];
                    return;
                }

                this.regionsOptions = await api.resource.regions({
                    q,
                    trainingRegions: this.selectedTrainingRegions.map(item => item.value),
                });
            },
            async updateCities({ q } = {}) {
                if (this.selectedRegions.length === 0) {
                    this.citiesOptions = [];
                    return;
                }

                this.citiesOptions = await api.resource.cities({
                    q,
                    regions: this.selectedRegions.map(item => item.value),
                });
            },
            async updateSalons({ q } = {}) {
                if (this.user.role !== 'ROLE_SALON_OWNER' && this.selectedCities.length === 0) {
                    this.salonsOptions = [];
                    return;
                }

                this.salonsOptions = await api.resource.salons({
                    q,
                    cities: this.selectedCities.map(item => item.value),
                    withCdcId: 1,
                    withMixed: false
                });
            },
            async updateSalonStylists({ q } = {}) {
                if (this.selectedSalons.length === 0) {
                    this.salonStylistsOptions = [];
                    return;
                }

                this.salonStylistsOptions = await api.resource.stylists({
                    q,
                    salons: this.selectedSalons.map(item => item.value),
                    city: this.selectedCities.map(item => item.value),
                    type: 'salon',
                });
            },
            async updatePrivateStylists({ q } = {}) {
                if (this.selectedSalons > 0 || this.selectedCities.length === 0) {
                    this.privateStylistsOptions = [];
                    return;
                }

                this.privateStylistsOptions = await api.resource.stylists({
                    q,
                    salons: this.selectedSalons.map(item => item.value),
                    city: this.selectedCities.map(item => item.value),
                    type: 'private',
                });
            },
            updateStylists() {
                this.updateSalonStylists();
                this.updatePrivateStylists();
            },
            resetStylists() {
                this.selectedSalonStylists = [];
                this.selectedPrivateStylists = [];
            },
            async updateCalculatedStylists() {
                if (!this.canCalculateStylists) {
                    return;
                }
                if (this.selectedStylists.length === 0) {
                    this.calculatedStylists = [];
                    return;
                }

                this.calculatedStylists = await api.training.scheduleCalculate({
                    id: this.eventId,
                    stylists: this.selectedStylists.map(item => item.value),
                });
            },
            handleButtonClick() {
                if (!this.canSendStylists) {
                    return;
                }

                if (this.isSchedule) {
                    this.scheduleStylists();
                } else {
                    this.inviteStylists();
                }
            }
        },
        watch: {
            selectedCountries() {
                this.selectedTrainingRegions = [];
                this.selectedRegions = [];
                this.selectedCities = [];
                this.selectedSalons = [];
                this.resetStylists();

                this.updateRegions();
            },
            selectedTrainingRegions() {
                this.selectedRegions = [];
                this.selectedCities = [];
                this.selectedSalons = [];
                this.resetStylists();

                this.updateRegions();
            },
            selectedRegions() {
                this.selectedCities = [];
                this.selectedSalons = [];
                this.resetStylists();

                this.updateCities();
            },
            selectedCities() {
                this.selectedSalons = [];
                this.resetStylists();

                this.updateSalons();
                this.updateStylists();
            },
            selectedSalons() {
                this.resetStylists();

                this.updateStylists();
            },
            selectedStylists() {
                this.updateCalculatedStylists();
            },
        },
        created() {
            if (this.user.role === 'ROLE_SALON_OWNER') {
                this.updateSalons();
            } else {
                this.updateTrainingRegions();
            }
        },
    }
</script>

<style src="./invite-stylists-form.less" lang="less"/>
