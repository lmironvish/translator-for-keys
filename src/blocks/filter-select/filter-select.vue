<template>
    <div class="filter-select">
        <multiselect
            class="filter-select__select"
            :class="multiselectClasses"
            ref="multiselect"
            :value="field.value"
            :disabled="field.disabled || disabled"
            :options="computedOptions"
            :internal-search="field.resource === undefined"
            :loading="field.isLoading"
            track-by="value"
            label="index"
            open-direction="bottom"
            :multiple="field.multiple === true"
            :placeholder="field.langKeyPlaceholder ? $t(`global.${field.langKeyPlaceholder}`) : field.placeholder || false"
            :show-labels="true"
            :close-on-select="!field.multiple"
            :clear-on-select="$mq === 'desktop' || !field.multiple"
            :preserveSearch="true"
            :searchable="!field.isSearchDisabled"
            @open="handleOpen"
            @search-change="debouncedSearchChange"
            @input="handleSelect($event, field.code, field.multiple)"
        >
            <span slot="noResult">{{ noResultMsg }}</span>
            <span slot="noOptions">{{ noOptionsMsg }}</span>
            <span
                slot="option"
                slot-scope="{ option }"
                v-html="option.index"
            ></span>
        </multiselect>
        <filter-clear
            v-if="showClearBtn"
            class="filter-select__clear"
            @clear="filterClear(field.code)"
            :disabled="clearIsDisabled || disabled"
        />
    </div>
</template>

<script>
import FilterClear from '@/blocks/filter-clear';

import { mapState } from 'vuex';

export default {
    name: 'FilterSelect',
    inheritAttrs: false,
    props: {
        field: {
            type: Object,
            default: () => {},
        },
        hasError: {
            type: Boolean,
            default: false,
        },
        isClearable: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        openedOnce: false,
        debounceDelay: 500,
        q: '',
    }),
    components: {
        FilterClear,
    },
    computed: {
        ...mapState('resource', {
            eventTypes: 'eventTypes',
            brands: 'brands',
            eventLevels: 'eventLevels',
            eventCategories: 'eventCategories',
            orderStatuses: 'orderStatuses',
            outerRoles: 'outerRoles',
            innerRoles: 'innerRoles',
            innerRolesWOSuperAdmin: 'innerRolesWOSuperAdmin',
            orderCheckStatuses: 'orderCheckStatuses',
            clubs: 'clubs',
            clubsSkp: 'clubsSkp',
            clubsSkpWithEmpty: 'clubsSkpWithEmpty',
            clubsIndola: 'clubsIndola',
            clubsIndolaWithEmpty: 'clubsIndolaWithEmpty',
            academies: 'academies',
            roles: 'roles',
            rolesInner: 'rolesInner',
            rolesOuter: 'rolesOuter',
            userNewStatuses: 'userNewStatuses',
            userMainStatuses: 'userMainStatuses',
            userAddStatuses: 'userAddStatuses',
            userAddStatusesWithNone: 'userAddStatusesWithNone',
            userStatuses: 'userStatuses',
            isActive: 'isActive',
            isDeprecated: 'isDeprecated',
            quarters: 'quarters',
            marketType: 'marketType',
            rolesApplications: 'rolesApplications',
            isOnline: 'isOnline',
            isTrained: 'isTrained',
            boolean: 'boolean',
            isProf: 'isProf',
            mediaTypes: 'mediaTypes',
            mediaCategories: 'mediaCategories',
            categoryVideo: 'categoryVideo',
            videoSubCategories: 'videoSubCategories',
            eventRequestStatuses: 'eventRequestStatuses',
            promo: 'promo',
            timeZones: 'timeZones',
            eventStatuses: 'eventStatuses',
            webinarPossibleRoles: 'webinarPossibleRoles',
            webinarGroups: 'webinarGroups',
            webinarParticipationTestStatuses:
                'webinarParticipationTestStatuses',
            webinarParticipationTimeStatuses:
                'webinarParticipationTimeStatuses',
            extendedBrands: 'extendedBrands',
            countryStatuses: 'countryStatuses',
        }),
        clearIsDisabled() {
            const { field } = this;
            return field.disabled || !field.value || field.value.length < 1;
        },
        showClearBtn() {
            return !this.clearIsDisabled && this.isClearable;
        },
        noResultMsg() {
            if (
                this.field.isLazy &&
                this.$mq !== 'desktop' &&
                this.q.length <= 2
            ) {
                return 'Введите не менее 3х символов';
            }
            return 'Совпадений не найдено';
        },
        noOptionsMsg() {
            if (
                this.field.isLazy &&
                this.$mq !== 'desktop' &&
                this.q.length <= 2
            ) {
                return 'Введите не менее 3х символов';
            }
            return 'Список пуст';
        },
        computedOptions() {
            if (
                this.field.isLazy &&
                this.$mq !== 'desktop' &&
                this.field.resource &&
                this.q.length <= 2
            ) {
                return [];
            }
            if (this.field.code === 'brands' && this.field.nullable) {
                const empty = { index: 'Без бренда', value: '' };
                return this.field.globalResource
                    ? [empty, ...this[this.field.globalResource]]
                    : [empty, ...this.field.options];
            }
            return this.field.globalResource
                ? this[this.field.globalResource]
                : this.field.options;
        },
        multiselectClasses() {
            const classes = [];
            const {
                field,
                hasError,
                showClearBtn,
                computedOptions,
                q,
                $mq,
            } = this;
            if (hasError === true) classes.push('multiselect--error');
            if (field.multiple === true) classes.push('_multiple');
            if (field.alignPopup)
                classes.push(`multiselect--align-popup-${field.alignPopup}`);
            if (showClearBtn === true)
                classes.push('multiselect--is-clearable');
            if ($mq !== 'desktop' && !q.length) {
                classes.push('multiselect--hide-list');
            }
            return classes;
        },
    },
    watch: {
        field: {
            deep: true,
            handler() {
                if (this.field.disabled) {
                    this.$refs.multiselect.search = '';
                    this.q = '';
                }
            },
        },
    },
    created() {
        this.field.q = this.field.q || '';
    },
    methods: {
        searchChange(q) {
            if (this.field.resource === undefined) return;
            this.$emit('searchChange', { q, code: this.field.code });
        },
        debouncedSearchChange(q) {
            const oldQ = this.q;

            this.q = q;
            this.field.q = q; // Для правильного обновления зависимых полей
            if (this.field.resource === undefined) return;

            clearTimeout(this.fetchTimeout);

            if (this.field.isLazy && this.$mq !== 'desktop') {
                if (oldQ.length <= 2 && q.length > 2) {
                    this.searchChange(q);
                    return;
                } else if (q.length <= 2) {
                    this.field.isLoading = false;
                    return;
                }
            }

            this.fetchTimeout = setTimeout(() => {
                this.searchChange(q);
            }, this.debounceDelay);
        },
        handleOpen() {
            if (this.openedOnce === false) {
                if (!this.field.isLazy || this.$mq === 'desktop') {
                    this.searchChange(this.field.q || undefined);
                }

                this.openedOnce = true;
            }
        },
        handleSelect(value, code) {
            const isNewValue = value && this.field.value !== value;

            if (this.isClearable || isNewValue) {
                // вынужденная мера, для того чтобы не повлять
                // на логику работы родительских компонентов
                this.field.value = value;
                this.field.q = this.$refs.multiselect.search;
                this.$emit('input', { value: value ? value : '', code });
            }
        },
        filterClear(code) {
            this.field.q = this.$refs.multiselect.search;
            this.field.value = '';
            this.$emit('input', { value: '', code });
        },
    },
};
</script>

<style src="./filter-select.less" lang="less" />
