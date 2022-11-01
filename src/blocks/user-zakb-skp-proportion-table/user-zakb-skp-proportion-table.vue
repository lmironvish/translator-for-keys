<template>
    <div class="user-zakb-skp-proportion-table">
        <button-block
            v-if="tableView.length > 0"
            class="user-zakb-skp-proportion__button"
            color="linear-black"
            padding="50"
            @click="openReportModal(0)"
        >
            Отчет
        </button-block>
        <transition name="fade-animation" mode="out-in">
            <table-block
                class="user-zakb-skp-proportion-table__table"
                v-if="tableView.length"
                :rows="tableView"
                :columnsStyle="columnStyle"
                :hasEditBtn="false"
                :hasDeleteBtn="false"
                rowPaddingSize="25"
                :fixed-left-columns="1"
                :fixed-right-columns="1"
                scrollable-x
            >
                <template #head>
                    <sorting-block
                        class="user-zakb-skp-proportion-table__sorting"
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
                itemList: { items: [] },
                api: api.kpi.skpProportionTable
            }
        ]
    }),
    methods: {
        getExtraParams() {
            return {
                id: this.userId,
                targetUserIds: this.targetUserIds ?? undefined
            };
        }
    },
    watch: {
        targetUserIds() {
            this.fetchAllTables();
        }
    },
    computed: {
        tableView() {
            let { meta, ...items } = this.tables[0].itemList;
            // arrView.forEach(i => {
            //     for (let key in i) {
            //         if (i[key] === null) {
            //             i[key] = "-";
            //         }
            //     }
            // });
            return Object.values(items);
        }
    }
};
</script>

<style src="./user-zakb-skp-proportion-table.less" lang="less" />
