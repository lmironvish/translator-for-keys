<template>
    <div class="user-clients-table">
        <button-block
            v-if="tables[0].itemList.items.length > 0"
            class="user-clients-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <sorting-block
            class="user-clients-table__sorting"
            :sortingList="tables[0].sortingList"
            @updateSorting="updateSorting($event, 0)"
            @openFilter="openFilter"
        />
        <filter-list
            class="user-clients-table__main-filter"
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
            class="user-clients-table__table"
            v-if="tables[0].itemList.items"
            :rows="tables[0].itemList.items"
            :columnsStyle="columnStyle"
            type="business-consultant"
            rowPaddingSize="50"
            :has-delete-btn="false"
            :has-edit-btn="false"
            :can-accept="false"
            :can-block="false"
            :routerParams="{ name: 'dashboard.Stylist', params: ['id'] }"
        >
            <template #cell:createdAt="{ row }">{{
                row.createdAt | formatDate
            }}</template>
            <template #cell:firstEventAt="{ row }">{{
                row.firstEventAt | formatDate
            }}</template>
        </table-block>
        <table-pagination
            v-if="tables[0].itemList.meta"
            :pagination="tables[0].itemList.meta.pagination"
            class="user-clients-table__table-pagination"
            @go-to-page="fetchTable($event, 0)"
        />
    </div>
</template>

<script>
import SortingBlock from "@/blocks/sorting";
import TableBlock from "@/blocks/table";
import FilterList from "@/blocks/filter-list";
import FilterModal from "@/blocks/modals/filter-modal";
import TablePagination from "@/blocks/table/table-pagination";
import ButtonBlock from "@/blocks/button";

import sortingList from "./data/sortingList.json";
import filterList from "./data/filterList.json";
import columnStyle from "./data/columnStyle.json";

import api from "@/api";

import filterLogic from "@/mixins/filter-logic";

export default {
    components: {
        TableBlock,
        FilterList,
        FilterModal,
        TablePagination,
        SortingBlock,
        ButtonBlock
    },
    name: "UserClientsTable",
    mixins: [filterLogic],
    props: {
        userId: Number,
        userRole: String,
        targetUserIds: Array
    },
    data: () => ({
        content: null,
        columnStyle,
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
                api: api.kpi.clientsTable
            }
        ]
    }),
    watch: {
        targetUserIds() {
            this.fetchAllTables();
        }
    },
    _rolesDictionaryList: {
        ROLE_BUSINESS_CONSULTANT: "businessConsultant",
        ROLE_SUPERVISOR: "supervisor",
        ROLE_REGION_HEAD: "regionHead"
    },
    methods: {
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
    }
};
</script>

<style lang="less">
@import "../../styles/helpers";

.user-clients-table {
    &__sorting {
        margin-top: 20px;

        @media @tablet {
            margin-top: 0;
        }
    }

    &__main-filter {
        margin-top: 5px;
    }

    &__table {
        margin-top: 30px;

        @media @tablet {
            .table__cell_code {
                &_fio {
                    &::before {
                        content: "ФИО:";
                    }
                }
            }
        }
    }

    &__table-pagination {
        margin-top: 20px;
    }
}
</style>
