<template>
    <div class="user-registrations-table">
        <button-block
            v-if="tableView.length > 0"
            class="user-zakb-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <table-block
            class="user-registrations-table__table"
            v-if="tableView"
            :rows="tableView"
            :columnsStyle="columnStyle"
            :hasEditBtn="false"
            :hasDeleteBtn="false"
            :fixed-left-columns="1"
            :fixed-right-columns="1"
            scrollable-x
            rowPaddingSize="25"
        >
            <template #head>
                <sorting-block
                    class="user-registrations-table__sorting"
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

import TableBlock from "@/blocks/table";
import ButtonBlock from "@/blocks/button";
import UserTableNavigation from "@/blocks/user-table-navigation/user-table-navigation";
import columnStyle from "./data/columnStyle.json";
import sortingList from "./data/sortingList.json";

import SortingBlock from "@/blocks/sorting/sorting";
import filterLogic from "@/mixins/filter-logic";
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
        targetUserIds: Array
    },
    data: () => ({
        columnStyle,
        fields: {},
        tables: [
            {
                filterList: [],
                sortingList,
                itemList: {
                    items: [],
                    meta: {}
                },
                api: api.kpi.registrationsTable
            }
        ]
    }),
    computed: {
        tableView() {
            const { meta, ...items } = this.tables[0].itemList;
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
                    : undefined
            };
        },
        bindCellColorMod
    },
    watch: {
        targetUserIds() {
            this.fetchAllTables();
        }
    }
};
</script>

<style src="./user-registrations-table.less" lang="less" />
