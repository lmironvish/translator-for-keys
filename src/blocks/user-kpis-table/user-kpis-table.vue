<template>
    <div class="user-kpis-table">
        <button-block
            v-if="tableView.length > 0"
            class="user-kpis-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <table-block
            class="user-kpis-table__table"
            v-if="tableView"
            :rows="tableView"
            :columnsStyle="columnStyle"
            :hasEditBtn="false"
            :hasDeleteBtn="false"
            :fixed-left-columns="1"
            :fixed-right-columns="1"
            scrollable-x
            rowPaddingSize="25"
            :get-row-modifier="setSolidRows"
        >
            <template #head>
                <sorting-block
                    class="user-kpis-table__sorting"
                    v-if="$mq === 'desktop'"
                    :sortingList="tables[0].sortingList"
                    :fixed-left-columns="1"
                    :fixed-right-columns="1"
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
import columnStyle from "./data/columnStyle.json";
import sortingList from "./data/sortingList.json";

import SortingBlock from "@/blocks/sorting/sorting";
import ButtonBlock from "@/blocks/button";
import { bindCellColorMod } from "@/tools/tables";

export default {
    components: {
        SortingBlock,
        TableBlock,
        ButtonBlock
    },
    mixins: [filterLogic],
    props: {
        userId: {
            type: Number,
            required: true
        },
        targetUserIds: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        columnStyle,
        fields: {},
        tables: [
            {
                filterList: [],
                sortingList,
                itemList: { items: [] },
                api: api.kpi.kpiTable
            }
        ]
    }),
    _solidRows: [`% выполнения`],
    watch: {
        targetUserIds() {
            this.fetchAllTables();
        }
    },
    computed: {
        tableView() {
            let { meta, ...items } = this.tables[0].itemList;
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
                    target: this.tables[0].itemList.contacts_plan,
                    current: this.tables[0].itemList.contacts_fact
                },
                {
                    target: this.tables[0].itemList.salons_plan,
                    current: this.tables[0].itemList.salons_fact
                },
                {
                    target: this.tables[0].itemList.seminars_plan,
                    current: this.tables[0].itemList.seminars_fact
                },
                {
                    target: this.tables[0].itemList.unique_contacts_plan,
                    current: this.tables[0].itemList.unique_contacts_fact
                },
                {
                    target: this.tables[0].itemList.unique_salons_plan,
                    current: this.tables[0].itemList.unique_salons_fact
                }
            ];
        }
    },
    methods: {
        getExtraParams() {
            return {
                id: this.userId,
                targetUserIds: this.targetUserIds ?? undefined
            };
        },
        setSolidRows(item) {
            if (this.$options._solidRows.includes(item.title)) {
                return "solid-bottom";
            }
        },
        bindCellColorMod
    }
};
</script>

<style src="./user-kpis-table.less" lang="less" />
