<template>
    <div class="user-table-navigation">
        <form-field label="" :width="25">
            <filter-select
                class="user-table-navigation__select"
                :field="tableType"
                @input="handleTableSwitch($event.value)"
                :is-clearable="false"
            />
        </form-field>
        <form-field inline label="" :width="25" v-if="hasSubordinates">
            <filter-select
                class="user-table-navigation__select"
                :field="subordinates"
                @input="handleSubordinatesInput($event)"
                :is-clearable="true"
            />
            <select-all
                :options="subordinates.options"
                v-model="subordinates.value"
            />
        </form-field>
        <form-field inline label="" v-if="currentTabs">
            <tabs-adaptive
                class="user-table-navigation__tabs"
                :tabs="currentTabsIndexes"
                :active-tab-id="activeTab"
                @tab-click="activeTab = $event"
            />
        </form-field>
    </div>
</template>

<script>
import FormField from "@/blocks/form-field/form-field";
import FilterSelect from "@/blocks/filter-select/filter-select";
import api from "@/api";
import TabsAdaptive from "@/blocks/tabs-adaptive/tabs-adaptive";
import SelectAll from "../select-all";

import educationTableType from "./data/educationTableType.json";
import sellersTableType from "./data/sellersTableType.json";

export default {
    name: "user-table-navigation",
    components: { TabsAdaptive, FilterSelect, FormField, SelectAll },
    props: {
        userId: {
            type: [Number, String],
            required: true
        },
        targetUserRole: {
            type: String,
            required: true
        },
        education: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        tableType: {
            multiselect: false,
            isSearchDisabled: true,
            options: [],
            value: {}
        },
        subordinates: {
            placeholder: "Все",
            value: [],
            options: [],
            multiple: true
        },
        tabs: {
            sales: [
                { index: "Все", value: "" },
                { index: "SKP", value: "SKP" },
                { index: "IND", value: "INDOLA" },
                { index: "STMNT", value: "STMNT" },
                { index: "ABC", value: "ABC" }
            ],
            trainings: [
                { index: "Тренинги 2021", value: "trainings" },
                { index: "Участие", value: "participation" },
                { index: "Преподавание", value: "teaching" }
                // { index: "Результаты тренингов", value: "results" }
            ],
            zakb: [
                { index: "Все", value: "" },
                { index: "SKP", value: "SKP" },
                { index: "IND", value: "INDOLA" },
                { index: "STMNT", value: "STMNT" }
            ]
        },
        activeTab: 0,
        blockEmit: false
    }),
    computed: {
        hasSubordinates() {
            return !["ROLE_BUSINESS_CONSULTANT", "ROLE_TECHNOLOGIST"].includes(
                this.targetUserRole
            );
        },
        currentTable() {
            return this.tableType.value.value;
        },
        currentTabs() {
            if (!this.tabs.hasOwnProperty(this.currentTable)) {
                return false;
            }
            return this.tabs[this.currentTable];
        },
        currentTabsIndexes() {
            if (!this.currentTabs) {
                return;
            }
            if (
                ["ROLE_BUSINESS_CONSULTANT", "ROLE_TECHNOLOGIST"].includes(
                    this.role
                )
            ) {
                return this.currentTabs
                    .filter(i => i.value !== "teaching")
                    .map(i => i.index);
            }
            return this.currentTabs.map(i => i.index);
        },
        tabSelectedOptionValue() {
            if (!this.currentTabs) {
                return false;
            }
            return this.currentTabs[this.activeTab].value;
        },
        filter() {
            return {
                table: this.currentTable,
                subordinates:
                    this.subordinates.value &&
                    this.subordinates.value.length &&
                    this.hasSubordinates
                        ? this.subordinates.value.map(subordinate => {
                              return subordinate.value;
                          })
                        : undefined,
                tab: this.tabSelectedOptionValue
            };
        },
        getTableType() {
            if (!this.education) {
                return { ...this.tableType, ...sellersTableType };
            }
            return { ...this.tableType, ...educationTableType };
        },
        role() {
            return this.$store.state.user.data.role;
        }
    },
    async created() {
        if (this.hasSubordinates) {
            try {
                const subordinates = await api.resource.subordinates(
                    this.userId
                );
                // this.$set(this.subordinates, "value", subordinates);
                this.$set(this.subordinates, "options", subordinates);
            } catch (e) {
                console.error(e);
            }
        }
        this.tableType = this.getTableType;
    },
    methods: {
        handleTableSwitch(table) {
            this.activeTab = 0;
            this.$set(this.tableType, "value", table);
        },
        handleSubordinatesInput($event) {
            this.$set(this.subordinates, "value", $event.value);
        }
    },
    watch: {
        filter: {
            handler(newVal) {
                this.$emit("setNavigationData", newVal);
            },
            immediate: true,
            deep: true
        }
    }
};
</script>

<style lang="less">
@import "~@/styles/helpers";

.user-table-navigation {
    display: flex;
    flex-wrap: wrap;

    @media @mobile {
        padding: 15px 0;
    }

    &__tabs {
        white-space: nowrap;

        & .tabs-adaptive__list {
            justify-content: space-between;
        }

        & .tabs-adaptive__item {
            margin-left: 0;
            margin-right: 15px;
            &:last-of-type {
                margin-right: 0;
            }
        }
    }
    &__select {
        font-weight: 700;
        margin-bottom: 15px;
    }
    & .form-field {
        @media @mobile {
            margin: 0 0 15px 0;
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
}
</style>
