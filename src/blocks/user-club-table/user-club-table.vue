<template>
    <div class="user-club-table">
        <button-block
            v-if="tableView.length > 0"
            class="user-club-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <table-block
            class="user-club-table__table"
            v-if="tables[0].itemList"
            :rows="tableView"
            :columnsStyle="columnStyle"
            type="webinars"
            rowPaddingSize="50"
            :has-edit-btn="false"
            :has-delete-btn="false"
            @openEdit="activeItem = $event"
            :fixed-left-columns="1"
            :fixed-right-columns="1"
            scrollable-x
            :get-row-modifier="setSolidRows"
        >
            <template #head>
                <sorting-block
                    class="user-club-table__sorting"
                    :sortingList="tables[0].sortingList"
                    @updateSorting="updateSorting($event, 0)"
                    :fixed-left-columns="1"
                    :fixed-right-columns="1"
                    :show-mobile-filter="false"
                    :show-mobile-sorting="false"
                />
            </template>
            <template
                v-for="column in columns"
                v-slot:[`cell:${column}`]="{ row }"
            >
                <span>{{
                    row[column]
                        | splitNumsAndTrunc({
                            withPercent: row.title && row.title.includes("%")
                        })
                }}</span>
            </template>
        </table-block>
    </div>
</template>

<script>
import sortingList from "./data/sortingList.js";
import filterList from "./data/filterList.json";
import columnStyle from "./data/columnStyle.js";

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
        targetUserIds: Array,
        brand: {
            type: String,
            required: true
        }
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
                api: api.kpi.clubTable
            }
        ]
    }),
    _solidRows: {
        club: [
            "% от ТО канала салоны+инд",
            "TO/Door, KRUR",
            "Welcome TO/Door, KRUR",
            "Strong TO/Door, KRUR",
            "КАМ TO, KRUR"
        ],
        loyalty: [
            "TO/Door, KRUR",
            "Entrepreneur TO/Door, KRUR",
            "Welcome TO/Door, KRUR",
            "Strong TO/Door, KRUR"
        ]
    },
    created() {
        this.updateDependentFieldsDebounced = debounce(
            this.updateDependentFields,
            500
        ); // filter-logic.js
    },
    computed: {
        tableView() {
            const { meta, ...items } = this.tables[0].itemList.items;
            return Object.values(items);
        },
        columns() {
            const { title, ...columns } = this.tables[0].sortingList.map(
                col => col.code
            );
            return columns;
        }
    },
    methods: {
        getExtraParams() {
            return {
                id: this.userId,
                targetUserIds: this.targetUserIds
                    ? this.targetUserIds
                    : undefined,
                brand: this.brand
            };
        },
        setSolidRows(item) {
            if (this.$options._solidRows[this.brand].includes(item.title)) {
                return "solid-bottom";
            }
        }
    },
    watch: {
        targetUserIds() {
            this.fetchAllTables();
        },
        brand() {
            this.fetchAllTables();
        }
    }
};
</script>

<style src="./user-club-table.less" lang="less" />
