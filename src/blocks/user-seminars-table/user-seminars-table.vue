<template>
    <div class="user-seminars-table">
        <button-block
            v-if="tables[0].itemList.items.length > 0"
            class="user-zakb-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <sorting-block
            class="page-technologist-detail__sorting"
            v-if="$mq === 'desktop'"
            :sortingList="tables[0].sortingList"
            @updateSorting="updateSorting($event, 0)"
        />
        <table-block
            class="page-technologist-detail__table page-technologist-detail__table_employee"
            v-if="tables[0].itemList.items"
            :rows="tables[0].itemList.items"
            :columnsStyle="tables[0].columnStyle"
            :hasEditBtn="false"
            :hasDeleteBtn="false"
            rowPaddingSize="25"
            :routerParams="{ name: 'dashboard.Event', params: ['id'] }"
        >
            <template #cell:dateBegin="{ row }">{{
                row.dateBegin | formatDate({ withTime: true })
            }}</template>
            <template #cell:dateEnd="{ row }">{{
                row.dateEnd | formatDate({ withTime: true })
            }}</template>
        </table-block>
        <table-pagination
            v-if="tables[0].itemList.meta"
            class="page-technologist-detail__table-pagination"
            :pagination="tables[0].itemList.meta.pagination"
            @go-to-page="fetchTable($event, 0)"
        />
    </div>
</template>

<script>
import api from "@/api";
import filterLogic from "@/mixins/filter-logic";

import TablePagination from "@/blocks/table/table-pagination";
import SortingBlock from "@/blocks/sorting/sorting";
import TableBlock from "@/blocks/table";
import ButtonBlock from "@/blocks/button";

import sortingList from "./data/sortingList.json";
import columnStyle from "./data/columnStyle.json";

export default {
    mixins: [filterLogic],
    components: {
        SortingBlock,
        TableBlock,
        TablePagination,
        ButtonBlock
    },
    props: {
        userId: {
            type: Number,
            required: true
        },
        targetUserIds: {
            type: Array
        }
    },
    data: () => ({
        tables: [
            {
                filterList: [],
                sortingList,
                columnStyle,
                itemList: {
                    items: [],
                    meta: {
                        pagination: {},
                        permissions: {}
                    }
                },
                api: api.kpi.seminarsTable
            }
        ]
    }),
    watch: {
        targetUserIds() {
            this.fetchAllTables();
        }
    },
    methods: {
        getExtraParams() {
            return { id: this.userId, targetUserIds: this.targetUserIds };
        }
    }
};
</script>

<style src="./user-seminars-table.less" lang="less" />
