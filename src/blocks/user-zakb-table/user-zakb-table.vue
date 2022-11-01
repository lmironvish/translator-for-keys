<template>
    <div class="user-zakb-table">
        <button-block
            v-if="tableView.length > 0"
            class="user-zakb-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <transition name="fade-animation" mode="out-in">
            <table-block
                class="user-zakb-table__table"
                v-if="tableView.length"
                :rows="tableView"
                :columnsStyle="columnStyle"
                :hasEditBtn="false"
                :hasDeleteBtn="false"
                rowPaddingSize="25"
                :fixed-left-columns="1"
                :fixed-right-columns="1"
                scrollable-x
                :get-row-modifier="setSolidRows"
            >
                <template #head>
                    <sorting-block
                        class="user-zakb-table__sorting"
                        v-if="$mq === 'desktop'"
                        :sortingList="tables[0].sortingList"
                        :fixed-left-columns="1"
                        :fixed-right-columns="1"
                    />
                </template>
                <template #cell:fact="{ row }">
                    <span
                        :style="{
                            color: row.fact >= row.plan ? 'green' : 'red'
                        }"
                        >{{ row.fact }}</span
                    >
                </template>
                <template
                    v-for="column in columns"
                    v-slot:[`cell:${column}`]="{ row }"
                >
                    <span :class="bindCellColorMod(row, column)">{{
                        row[column]
                            | splitNumsAndTrunc({
                                withPercent:
                                    row.title && row.title.includes("%")
                            })
                    }}</span>
                </template>
            </table-block>
        </transition>
    </div>
</template>

<script>
import api from "@/api";

import TableBlock from "@/blocks/table";
import PageHeader from "@/blocks/page-header";
import ButtonBlock from "@/blocks/button";
import UserTableNavigation from "@/blocks/user-table-navigation/user-table-navigation";
import columnStyle from "./data/columnStyle.json";
import sortingList from "./data/sortingList.json";
import filterLogic from "@/mixins/filter-logic";

import SortingBlock from "@/blocks/sorting/sorting";
import { bindCellColorMod } from "@/tools/tables";

export default {
    components: {
        SortingBlock,
        UserTableNavigation,
        TableBlock,
        PageHeader,
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
        loading: false,
        columnStyle,
        tables: [
            {
                filterList: [],
                sortingList,
                itemList: { items: {} },
                api: api.kpi.zakbTable
            }
        ]
    }),
    _solidRows: [
        `План vs Факт ${new Date().getFullYear()}, %`,
        `Эвол. ${new Date().getFullYear()} vs ${new Date().getFullYear() -
            1} двери, %`,
        `Эвол. ТО ${new Date().getFullYear()} vs ${new Date().getFullYear() -
            1}, %`,
        "Эвол. % (ТО)",
        "% обученности",
        "ЗАКБ кол-во проведенных семинаров",
        `Факт ЗАКБ ТО ${new Date().getFullYear()}`
    ],
    methods: {
        getExtraParams() {
            return {
                id: this.userId,
                targetUserIds: this.targetUserIds ?? undefined,
                brand: this.brand ?? undefined
            };
        },
        setSolidRows(item) {
            if (this.$options._solidRows.includes(item.title)) {
                return "solid-bottom";
            }
        },
        bindCellColorMod
    },
    watch: {
        targetUserIds() {
            this.fetchAllTables();
        },
        brand() {
            this.fetchAllTables();
        }
    },
    computed: {
        tableView() {
            return Object.values(this.tables[0].itemList.items);
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
                    target: this.tables[0].itemList.items.planZakbDoors,
                    current: this.tables[0].itemList.items.factZakbDoors
                },
                {
                    target: this.tables[0].itemList.items.zakbPlanSeminars,
                    current: this.tables[0].itemList.items.zakbCountEvents
                },
                {
                    target: this.tables[0].itemList.items.zakbCountStylists,
                    current: this.tables[0].itemList.items
                        .zakbCountTrainedStylists
                }
            ];
        }
    }
};
</script>

<style src="./user-zakb-table.less" lang="less" />
