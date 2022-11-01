<template>
    <div class="user-sales-table">
        <button-block
            v-if="tableView.length > 0"
            class="user-sales-table__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <sorting-block
            class="user-sales-table__sorting"
            v-if="$mq === 'desktop'"
            :sortingList="tables[0].sortingList"
        />
        <transition name="fade-animation" mode="out-in">
            <table-block
                class="user-sales-table__table"
                v-if="tableView"
                :rows="tableView"
                :columnsStyle="columnStyle"
                :hasEditBtn="false"
                :hasDeleteBtn="false"
                rowPaddingSize="25"
            >
                <template #cell:fact="{ row }">
                    <span
                        :style="{
                            color:
                                row.fact < row.plan
                                    ? 'red'
                                    : row.fact > row.plan
                                    ? 'green'
                                    : 'inherit'
                        }"
                        >{{ row.fact }}</span
                    >
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
import { cloneDeep } from "lodash";

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
        targetUserIds: Array
    },
    data: () => ({
        loading: false,
        columnStyle,
        tables: [
            {
                filterList: [],
                sortingList,
                itemList: {},
                api: api.kpi.trainingsTable
            }
        ]
    }),
    computed: {
        tableView() {
            if (Object.keys(this.tables[0].itemList).length) {
                const { meta, ...items } = this.tables[0].itemList;
                return Object.values(items);
            }
            return [];
        },
        reportTableView() {
            const table = cloneDeep(this.tables[0]);
            delete table.itemList;
            table.itemList = this.tableView;
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
        }
    },
    watch: {
        targetUserIds: {
            handler() {
                this.fetchAllTables();
            }
        }
    }
};
</script>

<style src="./user-trainings-table.less" lang="less" />
