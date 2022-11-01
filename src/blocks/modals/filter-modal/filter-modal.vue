<template>
    <modal
        class="filter-modal"
        height="auto"
        width="100%"
        :name="name"
        :maxWidth="768"
        :adaptive="true"
        :dynamic="false"
        @opened="isOpened = true"
        @closed="isOpened = false"
    >
        <div class="filter-modal__content">
            <p class="filter-modal__title">Фильтры</p>
            <button
                class="filter-modal__close"
                type="button"
                @click="closeModal"
                aria-label="Закрыть фильтр"
            />
            <div class="filter-modal__oveflow">
                <filter-list
                    class="filter-modal__filter-list"
                    view="modal"
                    :filterList="internalFiltersList"
                    @clearFilters="handleClear"
                    @updateFilters="handleUpdateFilters"
                    @searchChange="$emit('searchChange', $event)"
                />
                <p class="filter-modal__buttons">
                    <button-block
                        class="button filter-modal__button"
                        color="black"
                        padding="50"
                        :disabled="!isChanged"
                        @click="applyFilters()"
                    >
                        Применить
                    </button-block>
                    <button-block
                        class="button filter-modal__button"
                        color="linear-black"
                        @click="handleClear"
                        padding="50"
                    >
                        Сбросить все
                    </button-block>
                </p>
            </div>
        </div>
    </modal>
</template>

<script>
import ButtonBlock from '@/blocks/button';
import FilterList from '@/blocks/filter-list';
import isEqual from 'lodash/isEqual';

export default {
    name: 'FilterModal',
    props: {
        name: {
            type: String,
            default: 'filter-modal',
        },
        filterList: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        ButtonBlock,
        FilterList,
    },
    data: () => ({
        isOpened: false,
        values: {},
    }),
    computed: {
        internalFiltersList() {
            return this.filterList.map((item) => {
                return {
                    ...item,
                    value: this.values[item.code],
                };
            });
        },
        isChanged() {
            return this.filterList.some((item) => {
                return !isEqual(item.value, this.values[item.code]);
            });
        },
    },
    methods: {
        closeModal() {
            this.$modal.hide(this.name);
        },
        handleUpdateFilters(event) {
            this.values = {
                ...this.values,
                [event.code]: event.value || null,
            };
        },
        applyFilters() {
            Object.entries(this.values).forEach(([key, value]) => {
                // чтобы не ломать текущую логику, которая на этом завязана
                this.filterList.find(item => item.code === key).value = value;
            });

            this.$emit('updateFilters', { values: this.values });
            this.closeModal();
        },
        handleClear(event) {
            this.values = {};
            this.$emit('clearFilters', event);
        },
    },
    watch: {
        filterList: {
            immediate: true,
            handler(list) {
                for (const item of list) {
                    if (!this.isOpened) {
                        this.values[item.code] = item.value;
                    }
                }
            },
        },
    },
};
</script>

<style src="./filter-modal.less" lang="less"/>
