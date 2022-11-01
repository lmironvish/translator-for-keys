<template>
    <div class="invite-webinar-form">
        <slide-right :scroll-lock="true" @close="$emit('close')">
            <template #title>{{ "Пригласить участников" }}</template>

            <div class="invite-webinar-form__content">
                <form-field label="Страны">
                    <filter-select
                        :field="{
                                value: selectedCountries,
                                options: countriesOptions,
                                placeholder: 'Выберите страну',
                                resource: true,
                                multiple: true,
                            }"
                        @input="handleInputCountry"
                        @searchChange="updateCountries"
                    />
                </form-field>
                <form-field label="Регионы обучения">
                    <filter-select
                        :field="{
                            value: selectedTrainingRegions,
                            options: trainingRegionsOptions,
                            placeholder: 'Выберите регион',
                            disabled: selectedCountries.length === 0,
                            resource: true,
                            multiple: true
                        }"
                        @input="selectedTrainingRegions = $event.value || []"
                        @searchChange="updateTrainingRegions"
                    />
                </form-field>
                <select-all
                    v-model="selectedTrainingRegions"
                    :options="trainingRegionsOptions"
                />

                <form-field label="Выбор ролей">
                    <filter-select
                        :field="{
                            value: selectedRoles,
                            options: rolesOptions,
                            placeholder: 'Выберите роли',
                            multiple: true
                        }"
                        @input="selectedRoles = $event.value || []"
                    />
                </form-field>
                <select-all v-model="selectedRoles" :options="rolesOptions" />

                <form-field label="Выбор пользователей данных ролей">
                    <filter-select
                        :field="{
                            value: selectedParticipants,
                            options: participantsOptions,
                            placeholder: 'Выберите участников',
                            resource: true,
                            multiple: true,
                            disabled:
                                selectedRoles.length === 0 &&
                                selectedTrainingRegions.length === 0
                        }"
                        @input="selectedParticipants = $event.value || []"
                        @searchChange="updateParticipants"
                    />
                </form-field>
                <select-all
                    v-model="selectedParticipants"
                    :options="participantsOptions"
                />
                <button-block
                    :disabled="!canSendParticipants"
                    class="invite-webinar-form__button"
                    color="black"
                    padding="50"
                    @click="handleButtonClick"
                >
                    Отправить
                </button-block>
            </div>
        </slide-right>
    </div>
</template>

<script>
import SlideRight from "../slide-right";
import FilterSelect from "../filter-select";
import FormField from "../form-field";
import CheckboxBlock from "../checkbox";
import TableBlock from "../table";
import SortingBlock from "../sorting";
import ButtonBlock from "../button";
import SelectAll from "../select-all";
import api from "../../api";
import { trainingRegions } from "../../api/endpoints/resource";

export default {
    props: {
        webinarId: Number,
        rolesOptions: {
            type: Array,
            default: () => []
        }
    },
    components: {
        SlideRight,
        FilterSelect,
        FormField,
        CheckboxBlock,
        ButtonBlock,
        TableBlock,
        SortingBlock,
        SelectAll
    },
    data: () => ({
        selectedCountries: [],
        countriesOptions: [],
        selectedTrainingRegions: [],
        trainingRegionsOptions: [],
        isProcessing: false,
        selectedParticipants: [],
        selectedRoles: [],
        participantsOptions: []
    }),
    computed: {
        user() {
            return this.$store.state.user.data;
        },
        canSendParticipants() {
            return this.selectedParticipants.length > 0;
        }
    },
    methods: {
        async inviteParticipants() {
            if (this.isProcessing) {
                return;
            }

            this.isProcessing = true;

            try {
                await api.webinar.sendInvite({
                    id: this.webinarId,
                    users: this.selectedParticipants.map(item => item.value)
                });

                this.$emit("close", true);

                this.addActionSuccess({
                    title: "Успешно",
                    text: "Участники успешно приглашены"
                });
            } catch (response) {
                this.addActionError({ response });
            } finally {
                this.isProcessing = false;
            }
        },
        handleInputCountry(event) {
            this.selectedCountries = event.value || [];
            this.updateTrainingRegions();
        },
        async updateCountries({ q } = {}) {
            this.countriesOptions = await api.resource.countries({
                q,
                isActive: 1
            });
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
        async updateParticipants({ q } = {}) {
            this.participantsOptions = await api.resource.webinarInvitees({
                id: this.webinarId,
                q,
                roles: this.selectedRoles.map(r => r.value),
                trainingRegions: this.selectedTrainingRegions.map(r => r.value)
            });
        },
        handleButtonClick() {
            if (!this.canSendParticipants) {
                return;
            }
            this.inviteParticipants();
        }
    },
    watch: {
        selectedTrainingRegions() {
            this.updateParticipants();
        },
        selectedRoles() {
            this.updateParticipants();
        },
        rolesOptions: {
            handler() {
                if (this.rolesOptions.length === 1)
                    this.selectedRoles = this.rolesOptions;
            },
            immediate: true
        },
        trainingRegionsOptions: {
            handler() {
                if (this.trainingRegionsOptions.length === 1)
                    this.selectedTrainingRegions = this.trainingRegionsOptions;
            },
            immediate: true
        }
    },
    created() {
        this.updateCountries();
    }
};
</script>

<style lang="less" src="./invite-webinar-form.less" />
