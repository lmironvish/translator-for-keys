<template>
    <div
        class="table-report"
        v-click-outside="handleOutsideClick"
    >
        <slide-right @close="$emit('close')">
            <template v-slot:title>
                Отчет
            </template>
            <template v-slot:default>
                <form class="table-report__content" @submit.prevent="onSubmit">
                    <h2 class="table-report__subtitle">Выберите столбцы для отчета</h2>
                    <checkbox-block
                        class="table-report__checkbox"
                        :value="checkAll"
                        @input="onCheckAllInput"
                    >
                        Выбрать все
                    </checkbox-block>
                    <checkbox-block
                        v-for="field in fields.filter( i => i.label)"
                        :key="field.code"
                        :value="field.checked"
                        @input="onInput(field.code, $event)"
                        class="table-report__checkbox"
                    >
                        {{ field.label }}
                    </checkbox-block>
                    <p
                        class="table-report__error"
                        :class="{'table-report__error_hidden': !(isSubmitTouched && !(checkAll || anyFieldChecked))}"
                    >
                        Выберите хотя бы один столбец
                    </p>
                    <div class="table-report__buttons-holder">
                        <button-block
                            color="black"
                            padding="60"
                            font-size="50"
                            class="table-report__button"
                            is-submit
                        >
                            Запросить новый отчет
                        </button-block>
                        <button-block
                            v-if="exportStatus"
                            color="black"
                            padding="60"
                            class="table-report__button"
                            :disabled="exportStatus.status !== 2"
                            @click="download"
                        >
                            {{ buttonText }}
                        </button-block>
                    </div>
                </form>
            </template>
        </slide-right>
    </div>
</template>

<script>
import ButtonBlock from '../button'
import SlideRight from '../slide-right';
import FormField from '../form-field';
import CheckboxBlock from '../checkbox';

import moment from 'moment';

import { createReportUrl } from '@/tools';
import getSocket from '@/tools/socket';

export default {
    name: 'TableReport',
    components: {
        CheckboxBlock,
        SlideRight,
        ButtonBlock,
        FormField
    },
    props: {
        fields: Array,
        params: Object,
        api: Function,
        exportStatus: Object,
        tableIndex: {
            type: [String, Number],
            default: 0
        }
    },
    data: () => ({
        checkAll: false,
        isSubmitTouched: false
    }),
    created() {
        this.socket = getSocket();
        this.socket.on('export', this.exportPush);
    },
    destroyed() {
        this.socket.off('export', this.exportPush);
    },
    computed: {
        anyFieldChecked() {
            return this.fields.some(field => field.checked);
        },
        buttonText() {
            if (this.exportStatus.status === 0 || this.exportStatus.status === 1) {
                return `Идет создание отчета от ${this.formatDate(this.exportStatus.date)}`;
            } else {
                return `Скачать отчет от ${this.formatDate(this.exportStatus.date)}`;
            }
        }
    },
    methods: {
        async onSubmit() {
            if (!(this.checkAll || this.anyFieldChecked)) {
                this.isSubmitTouched = true;
                return;
            }
            const requestParams = { ...this.params };
            let checkedColumns;
            if (this.checkAll) {
                checkedColumns = this.fields;
            } else {
                checkedColumns = this.fields.filter(field => field.checked === true);
            }
            checkedColumns.forEach((column) => {
                requestParams[`exportColumns[${column.code}]`] = column.label
            });
            requestParams.exportData = JSON.stringify({
                route: this.$route.name,
                tableIndex: this.tableIndex
            });
            this.$emit('update-export-status', (await this.api(requestParams)).meta.exportStatus);
        },
        formatDate(date) {
            return this.$options.filters.formatDate(date);
        },
        download() {
            const link = document.createElement('a');
            link.setAttribute('download', 'Отчет.csv');
            link.href = createReportUrl(this.exportStatus.link);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
        onInput(code, $event) {
            const inputField = this.fields.find(field => field.code === code);
            inputField.checked = $event;
            const filteredFields = this.fields.filter(field => field.checked);
            this.checkAll = filteredFields.length === this.fields.length;
        },
        onCheckAllInput($event) {
            this.checkAll = $event;
            this.fields.forEach((field) => {
                field.checked = this.checkAll;
            })
        },
        exportPush(exportStatus) {
            const data = JSON.parse(exportStatus.data);
            if (this.$route.name === data.route && this.tableIndex === data.tableIndex) {
                this.$emit('update-export-status', {
                    date: exportStatus.date.date,
                    status: exportStatus.status,
                    link: exportStatus.link
                });
            }
        },
        handleOutsideClick() {
            this.$emit('close');
        }
    }
}
</script>

<style src="./table-report.less" lang="less"/>
