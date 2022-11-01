<template>
    <div :class="getBemClass('table', { scrollableX })">
        <div class="table__scroll">
            <div v-if="$slots.head" class="table__head">
                <slot name="head" />
            </div>

            <div
                v-if="!rows || rows.length === 0"
                :class="
                    getBemClass('table__row', {
                        disabled: true,
                        padding: rowPaddingSize
                    })
                "
            >
                <div class="table__cell">Список пуст</div>
            </div>

            <component
                v-for="row in rows"
                v-bind="componentBind(row)"
                :is="componentBind(row).to ? 'router-link' : 'div'"
                :key="uniqueKey(row) || row.id || row.title"
                @click="$emit('rowClick', row)"
            >
                <div
                    v-for="cell in columnsStyle"
                    :key="cell.code"
                    :class="getCellClass(cell, row)"
                    :style="getCellStyles(cell.styles)"
                    :title="row[cell.code]"
                    v-sticky-cell="stickyCellOptions"
                >
                    <span
                        v-if="cell.withMobileLabel && $mq !== 'desktop'"
                        class="table__mobile-cell-label"
                    >
                        {{ cell.langKey ? $t(`global.${cell.langKey}`) : cell.label }}:
                    </span>
                    <slot :name="'cell:' + cell.code" :row="row">
                        <span v-if="cell.code === 'phone'">{{
                            row[cell.code] | formatPhone
                        }}</span>
                        <span v-else v-html="row[cell.code]"></span>
                    </slot>
                </div>
                <table-popup
                    v-if="
                        hasEditBtn ||
                            hasDeleteBtn ||
                            hasSalesDepartmentKpiOptions ||
                            hasEducationDepartmentKpiOptions ||
                            hasWebinarsKpiOptions ||
                            hasUncompletedRegsBtns ||
                            row.hasAcceptBtn ||
                            row.hasBlockButton ||
                            (row.meta && row.meta.canManualTest)
                    "
                    class="table__popup"
                    :itemId="row.id"
                    :hasAcceptBtn="canAccept && isRowStatus(row)"
                    :hasEditBtn="hasEditBtn"
                    :hasDeleteBtn="hasDeleteBtn"
                    :has-manual-testing-btn="
                        (row.meta && row.meta.canManualTest) || false
                    "
                    :hasBlockBtn="
                        canBlock &&
                            (row.status === 'active' ||
                                row.status === 'blocked')
                    "
                    :hasActivateBtn="hasActivateBtn"
                    :hasSalesDepartmentKpiOptions="hasSalesDepartmentKpiOptions"
                    :hasEducationDepartmentKpiOptions="
                        hasEducationDepartmentKpiOptions
                    "
                    :hasWebinarsKpiOptions="hasWebinarsKpiOptions"
                    :hasUncompletedRegsBtns="hasUncompletedRegsBtns"
                    :status="row.status"
                    :isActive="row.isActive"
                    @handleEdit="$emit('openEdit', row)"
                    @handleDelete="$emit('openConfirmDelete', row.id)"
                    @handleAccept="$emit('accept', row.id)"
                    @handleBlock="$emit('block', row.id)"
                    @handleUnblock="$emit('unblock', row.id)"
                    @handleActivate="
                        $emit('handleActivate', {
                            id: row.id,
                            isActive: row.isActive
                        })
                    "
                    @handleKpiSelect="
                        $emit('openKpiModal', {
                            mode: arguments[0],
                            id: row.id
                        })
                    "
                    @handleManualTestingBtn="
                        $emit('appointManualTest', {
                            id: row.id,
                            webinarId: row.webinarId
                        })
                    "
                    @handleContact="$emit('handleContact', { id: row.id })"
                    @handleSmsDisable="
                        $emit('handleSmsDisable', { id: row.id })
                    "
                />
            </component>
        </div>
    </div>
</template>

<script>
import TablePopup from "@/blocks/table/table-popup";

import { getUserDetailRoute } from "@/tools";

export default {
    name: "Table",
    props: {
        type: String,
        rows: Array,
        columnsStyle: Array,
        rowPaddingSize: String,
        uniqueKeyPropertys: {
            type: Array,
            default() {
                return []
            }
        },
        hasEditBtn: {
            type: Boolean,
            default: true
        },
        hasDeleteBtn: {
            type: Boolean,
            default: true
        },
        hasActivateBtn: {
            type: Boolean,
            default: false
        },
        hasSalesDepartmentKpiOptions: {
            type: Boolean,
            default: false
        },
        hasEducationDepartmentKpiOptions: {
            type: Boolean,
            default: false
        },
        hasWebinarsKpiOptions: {
            type: Boolean,
            default: false
        },
        hasManualTestingBtn: {
            type: Boolean,
            default: false
        },
        canAccept: {
            type: Boolean,
            default: false
        },
        canBlock: {
            type: Boolean,
            default: false
        },
        routerParams: {
            type: Object,
            default: () => ({})
        },
        routerRoleParam: String,
        getRowModifier: {
            type: Function,
            default: () => null
        },
        scrollableX: {
            type: Boolean,
            default: false
        },
        fixedLeftColumns: {
            type: Number,
            default: 0
        },
        fixedRightColumns: {
            type: Number,
            default: 0
        },
        solidRows: {
            type: Array,
            default: () => []
        },
        hasUncompletedRegsBtns: {
            type: Boolean,
            default: false
        }
    },
    components: {
        TablePopup
    },
    computed: {
        stickyCellOptions() {
            return {
                leftCount: this.fixedLeftColumns,
                leftClass: "table__cell_fixed_left",
                rightCount: this.fixedRightColumns,
                rightClass: "table__cell_fixed_right"
            };
        }
    },
    methods: {
        uniqueKey(row) {
            if (!this.uniqueKeyPropertys.length) return null;

            let uniqueKey = [];
            for (const key in row) {
                if (this.uniqueKeyPropertys.includes(key)) {
                    uniqueKey.push(row[key] + Math.random());
                }
            }

            return uniqueKey.join('-');
        },
        isRowStatus(row) {
            return row.status === "inactive" || row.status === "new";
        },
        componentBind(item) {
            const bind = {
                class: this.getBemClass("table__row", {
                    padding: this.rowPaddingSize,
                    mod: this.getRowModifier(item)
                })
            };

            if (Object.keys(this.routerParams).length) {
                const params = {};
                this.routerParams.params.forEach(param => {
                    Object.assign(params, { [param]: item[param] });
                });
                bind.to = { name: this.routerParams.name, params };
            } else if (
                this.routerRoleParam &&
                item[this.routerRoleParam] &&
                getUserDetailRoute(item.id, item[this.routerRoleParam])
            ) {
                bind.to = getUserDetailRoute(
                    item.id,
                    item[this.routerRoleParam]
                );
            }

            return bind;
        },
        getCellClass(cell, row) {
            return this.getBemClass("table__cell", {
                code: !cell.withMobileLabel && cell.code,
                mod: this.getRowModifier(row)
            });
        },
        getCellStyles(styles) {
            if (styles !== undefined) return styles[this.$mq];
        }
    }
};
</script>

<style src="./table.less" lang="less" />
