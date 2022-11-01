<template>
    <div class="user-trainings-teaching-table">
        <button-block
            v-if="tables[0].itemList.items.length"
            class="user-clients-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <sorting-block
            class="user-trainings-teaching-table__sorting"
            :sortingList="tables[0].sortingList"
            @updateSorting="updateSorting($event, 0)"
            @openFilter="openFilter"
        />
        <filter-list
            class="user-trainings-teaching-table__filter"
            :filterList="tables[0].filterList"
            @updateFilters="debouncedFetch(0)"
            @searchChange="searchChange($event, 0)"
            @clearFilters="clearFilters(0)"
        />
        <filter-modal
            :filterList="tables[0].filterList"
            @updateFilters="debouncedFetch(0)"
            @searchChange="searchChange($event, 0)"
            @clearFilters="clearFilters(0)"
        />
        <table-block
            class="user-trainings-teaching-table__table"
            v-if="tables[0].itemList.items"
            :rows="tables[0].itemList.items"
            :columnsStyle="columnStyle"
            type="webinars"
            rowPaddingSize="50"
            :has-edit-btn="false"
            :has-delete-btn="false"
            @openEdit="activeItem = $event"
        >
            <template #cell:brands="{row}">{{
                row.brands || "Без бренда"
            }}</template>
        </table-block>
        <table-pagination
            v-if="tables[0].itemList.meta"
            :pagination="tables[0].itemList.meta.pagination"
            class="user-trainings-teaching-table__table-pagination"
            @go-to-page="fetchTable($event, 0)"
        />
    </div>
</template>

<script>
import sortingList from "./data/sortingList.json";
import filterList from "./data/filterList.json";
import columnStyle from "./data/columnStyle.json";

import PageHeader from "@/blocks/page-header";
import ButtonBlock from "@/blocks/button";
import SortingBlock from "@/blocks/sorting";
import FilterList from "@/blocks/filter-list";
import FilterModal from "@/blocks/modals/filter-modal";
import TableBlock from "@/blocks/table";
import TablePagination from "@/blocks/table/table-pagination";

import debounce from "lodash/debounce";
import api from "@/api";
import filterLogic from "@/mixins/filter-logic";

export default {
    metaInfo: {
        title: "Вебинары"
    },
    mixins: [filterLogic],
    components: {
        PageHeader,
        SortingBlock,
        FilterList,
        FilterModal,
        TableBlock,
        TablePagination,
        ButtonBlock
    },
    props: {
        userId: {
            type: [Number, String],
            required: true
        },
        targetUserIds: Array
    },
    data: () => ({
        activeItem: {},
        columnStyle,
        fields: {},
        tables: [
            {
                filterList,
                sortingList,
                itemList: {
                    items: [],
                    meta: {
                        pagination: {},
                        permissions: {}
                    }
                },
                api: api.kpi.trainingsTeachingTable
            }
        ]
    }),
    created() {
        this.updateDependentFieldsDebounced = debounce(
            this.updateDependentFields,
            500
        ); // filter-logic.js
    },
    computed: {
        hasActiveFilter() {
            return Object.keys(this.getFilterParams(0)).length > 0; // filter-logic.js
        },
        hasActiveSorting() {
            return Object.keys(this.getSoringParams(0)).length > 0; // filter-logic.js
        },
        totalItemCount() {
            const { totalCount } = this.tables[0].itemList.meta.pagination;
            return totalCount > 0 ? totalCount : null;
        }
    },
    methods: {
        async handleFieldSelect({ value, code }, fieldObj) {
            fieldObj[code].value = value;
            this.updateDependentFieldsDebounced({ value, code }, fieldObj);
        },
        openFilter() {
            this.$modal.show("filter-modal");
        },
        getExtraParams() {
            return {
                id: this.userId,
                targetUserIds: this.targetUserIds
                    ? this.targetUserIds
                    : undefined
            };
        }
    },
    watch: {
        targetUserIds() {
            this.fetchAllTables();
        }
    }
};
</script>

<style src="./user-trainings-teaching-table.less" lang="less" />
