<template>
    <div class="user-sales-table">
        <button-block
            v-if="tableView.length"
            class="user-clients-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <table-block
            v-if="tableView"
            :columnsStyle="columnStyle"
            :fixed-left-columns="1"
            :fixed-right-columns="3"
            :hasDeleteBtn="false"
            :hasEditBtn="false"
            :rows="tableView"
            class="user-sales-table__table"
            rowPaddingSize="25"
            scrollable-x
        >
            <template #head>
                <sorting-block
                    v-if="$mq === 'desktop'"
                    :fixed-left-columns="1"
                    :fixed-right-columns="3"
                    :sortingList="tables[0].sortingList"
                    class="user-sales-table__sorting"
                />
            </template>
            <template
                v-for="column in columns"
                v-slot:[`cell:${column}`]="{ row }"
            >
                <span :class="bindCellColorMod(row, column)">{{
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
import api from "@/api";
import filterLogic from "@/mixins/filter-logic";

import TableBlock from "@/blocks/table";
import ButtonBlock from "@/blocks/button";
import UserTableNavigation from "@/blocks/user-table-navigation/user-table-navigation";
import columnStyle from "./data/columnStyle.json";
import sortingList from "./data/sortingList.json";

import SortingBlock from "@/blocks/sorting/sorting";
import { bindCellColorMod } from "@/tools/tables";

export default {
    components: {
        SortingBlock,
        UserTableNavigation,
        TableBlock,
        ButtonBlock
    },
    mixins: [filterLogic],
    props: {
        userId: {
            type: Number,
            required: true
        },
        targetUserIds: Array,
        brand: String
    },
    data: () => ({
        columnStyle,
        fields: {},
        tables: [
            {
                filterList: [],
                sortingList,
                itemList: {},
                api: api.kpi.salesTable
            }
        ]
    }),
    computed: {
        tableView() {
            const { meta, ...items } = this.tables[0].itemList;
            for (let key in items) {
                if (!items[key]) {
                    delete items[key];
                }
            }
            return Object.values(items);
        },
        columns() {
            const { title, ...columns } = this.tables[0].sortingList.map(
                col => col.code
            );
            return columns;
        },
        compareList() {
            return [
                {
                    target: this.tables[0].itemList.current_year_plan,
                    current: this.tables[0].itemList.current_year_fact
                }
            ];
        }
    },
    methods: {
        getExtraParams() {
            return {
                id: this.userId,
                targetUserIds: this.targetUserIds
                    ? this.targetUserIds
                    : undefined,
                brand: this.brand ? this.brand : undefined
            };
        },
        bindCellColorMod
    },
    watch: {
        brand() {
            this.fetchAllTables();
        },
        targetUserIds() {
            this.fetchAllTables();
        }
    }
};
</script>

<style lang="less" src="./user-sales-table.less" />
