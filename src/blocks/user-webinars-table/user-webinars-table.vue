<template>
    <div class="user-webinars-table">
        <h3 class="page-head-region__date-title">
            Участие в вебинарах
            <span
                class="user-webinars-table__webinars-count"
                v-if="content.meta"
            >
                {{ content.meta.pagination.totalCount }}
            </span>
        </h3>
        <sorting-block
            class="user-webinars-table__sorting"
            v-if="$mq === 'desktop'"
            :sortingList="sortingList"
        />
        <filter-list
            class="user-webinars-table__filter"
            :filterList="filterList"
            @updateFilters="debouncedUpdate"
        />
        <table-block
            class="user-webinars-table__table"
            v-if="content.items"
            :rows="content.items"
            :columnsStyle="columnStyle"
            :hasEditBtn="false"
            :hasDeleteBtn="false"
            rowPaddingSize="25"
            @appointManualTest="appointManualTest"
        >
            <template #cell:points="{ row }">{{
                row.points ? row.points : "—"
            }}</template>
        </table-block>
        <table-pagination
            v-if="content.meta"
            :pagination="content.meta.pagination"
            class="page-templates__table-pagination"
            @go-to-page="changePage"
        />
    </div>
</template>

<script>
import { handleUser403 } from "@/tools";
import api from "@/api";

import SortingBlock from "@/blocks/sorting";
import TableBlock from "@/blocks/table";
import FilterList from "@/blocks/filter-list";
import TablePagination from "@/blocks/table/table-pagination";

import sortingList from "./data/sortingList.json";
import columnStyle from "./data/columnStyle.json";
import filterList from "./data/filterList.json";
import { debounce } from "lodash";

export default {
    components: {
        SortingBlock,
        TableBlock,
        FilterList,
        TablePagination
    },
    props: {
        userId: {
            type: Number,
            required: true
        }
    },
    data: () => ({
        content: {},
        sortingList,
        columnStyle,
        filterList,
        page: 1
    }),
    created() {
        this.debouncedUpdate = debounce(this.updateData, 500);
        this.fetchData();
    },
    computed: {
        filter() {
            const filled = this.filterList.filter(i => i.value);
            const filter = {};
            filled.forEach(i => {
                if (typeof i.value === "string") filter[i.code] = i.value;
                if (typeof i.value === "object" && !Array.isArray(i.value))
                    filter[i.code] = i.value.value;
                if (typeof Array.isArray(i.value) && i.code !== 'date') {
                    const result = [];
                    i.value.forEach(v => result.push(v.value));
                    filter[i.code] = result;
                }
                if (i.code === 'date') {
                    filter['date[begin]'] = i.value[0]
                    filter['date[end]'] = i.value[1]
                }
            });
            return filter;
        }
    },
    methods: {
        async updateData() {
            await this.fetchData();
        },
        async fetchData() {
            try {
                this.content = await api.webinar.getWebinarsTable({
                    participantID: this.userId,
                    page: this.page,
                    ...this.filter
                });
            } catch (error) {
                if (error.status === 403) {
                    handleUser403();
                }
            }
        },
        async appointManualTest(params) {
            try {
                await api.webinar.appointManualTest(params);
                this.addActionSuccess({
                    title: 'Успешно',
                    text: 'Тест для пользователя назначен',
                });
            } catch (e) {
                this.addActionError({
                    title: 'Ошибка при назначении теста!',
                    response: e
                })
            }
        },
        changePage(newPage) {
            this.page = newPage;
            this.fetchData();
        }
    }
};
</script>

<style src="./user-webinars-table.less" lang="less" />
