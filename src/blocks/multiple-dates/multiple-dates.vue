<template>
    <div class="multiple-dates">
        <div class="multiple-dates__li">
            <date-picker
                class="multiple-dates__picker"
                :class="{'input_error': hasError, 'mx-datepicker_hide-picker': hidePicker, 'mx-datepicker_month-picker': isMonthPicker}"
                v-bind="bindDataPicker(field)"
                :value="firstDate"
                ref="date-0"
                @input="handleDate($event, 0)"
                @open="toggleDatePicker"
                @close="toggleDatePicker"
                @click.native="focus"
                @pick="skipDateRange"
                v-click-outside="unfocus"
            >
                <div slot="header">
                    {{ field.description || 'Выберите первую дату' }}
                    <button
                        class="mx-datepicker-header__close"
                        type="button"
                        @click="closeDatePicker(0)"
                    >Закрыть</button>
                </div>
            </date-picker>
            <button-block
                class="multiple-dates__add"
                type="button"
                aria-label="Добавить день"
                icon="plus"
                :disabled="!field.value || !field.value[0] || field.value[0].date === 'Invalid date'"
                @click="addDay"
            />
        </div>

        <div class="multiple-dates__li" v-for="(date, index) in restDates" :key="date.date">
            <date-picker
                class="multiple-dates__picker"
                :class="{'input_error': hasError, 'mx-datepicker_hide-picker': hidePicker, 'mx-datepicker_month-picker': isMonthPicker}"
                v-bind="bindDataPicker(field, true)"
                :value="date"
                :ref="`date-${index + 1}`"
                @input="handleDate($event, index + 1)"
                @open="toggleDatePicker"
                @close="toggleDatePicker"
                @click.native="focus"
                v-click-outside="unfocus"
            >
                <div slot="header">
                    Выберите время
                    <button
                        class="mx-datepicker-header__close"
                        type="button"
                        @click="closeDatePicker(index + 1)"
                    >Закрыть</button>
                </div>
            </date-picker>
            <filter-clear
                class="multiple-input__remove"
                :title="$t('global.deleteTheDay')"
                @clear="removeDay(index + 1)"
            />
        </div>
    </div>
</template>

<script>
import ButtonBlock from '@/blocks/button'
import FilterClear from '@/blocks/filter-clear'
import datePickerLangRu from '@/data/date-picker-lang-ru';
import moment from 'moment';
import { compareByFieldSpecs } from '@fullcalendar/core';

export default {
    name: 'MultipleDates',
    inheritAttrs: false,
    components: {
        ButtonBlock,
        FilterClear,
    },
    props: {
        field: {
            type: Object,
            default: () => {},
        },
        hasError: {
            type: Boolean,
            default: false,
        },
        isMonthPicker: Boolean,
        disabledDates: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        isFocused: false,
        showTimeRangePanel: false,
    }),
    computed: {
        hidePicker() {
            return this.$mq !== 'desktop' && !this.isFocused;
        },
        firstDate() {
            if (this.field.value && this.field.value[0]) {
                return this.formatApiToPicker(this.field.value[0]);
            }
            return null;
        },
        restDates() {
            const dates = [];
            if (this.field.value && this.field.value.length > 1) {
                const values = this.field.value.slice(1);
                values.forEach((date) => {
                    dates.push(this.formatApiToPicker(date));
                });
            }
            return dates;
        },
        dates() {
            const dates = [this.firstDate, ...this.restDates];
            return dates;
        },
        datesApiFormatted() {
            const dates = [];
            this.dates.forEach((date) => {
                dates.push(this.formatPickerToApi(date));
            });
            return dates;
        },
    },
    methods: {
        addDay() {
            const lastDay = this.dates[this.dates.length - 1];
            const value = [
                ...this.datesApiFormatted,
                this.formatPickerToApi(lastDay, 1),
            ];
            this.$emit('input', { value, code: this.field.code });
        },
        removeDay(index) {
            const dates = this.datesApiFormatted.slice(0, index);
            this.$emit('input', { value: dates, code: this.field.code });
        },
        formatApiToPicker(apiDate) {
            const { date, time } = apiDate;
            return [`${date}T${time[0]}`, `${date}T${time[1]}`];
        },
        formatPickerToApi(date, addDays = 0) {
            return {
                date: moment(date[0]).add(addDays, 'days').format('YYYY-MM-DD'),
                time: [
                    moment(date[0]).add(addDays, 'days').format('HH:mm'),
                    moment(date[1]).add(addDays, 'days').format('HH:mm'),
                ],
            };
        },
        skipDateRange(date) {
            this.showTimeRangePanel = true;
            const value = {
                date: moment(date).format('YYYY-MM-DD'),
                time: [
                    '09:30',
                    '17:00',
                ],
            };
            this.$emit('input', { value: [ value ], code: this.field.code });
        },
        bindDataPicker(field, isTimeOnly) {
            const { placeholder, code, disabled } = field;
            return {
                showTimePanel: isTimeOnly ? false : this.showTimeRangePanel,
                type: isTimeOnly ? 'time' : 'datetime',
                format: isTimeOnly ? 'D MMM HH:mm' : 'ddd, D MMM HH:mm', // снаружи
                valueType: 'YYYY-MM-DDTHH:mm', // внутри
                lang: datePickerLangRu,
                editable: false,
                confirm: true,
                confirmText: 'Выбрать',
                placeholder,
                range: true,
                timePickerOptions: {start: '00:00', step:'00:30', end: '23:30', format: 'HH:mm'},
                timeTitleFormat: 'D MMMM',
                appendToBody: false,
                // Если передать open false, то окно нельзя будет открыть
                open: this.$mq !== 'desktop' ? true : undefined,
                disabled,
            };
        },
        toggleDatePicker() {
            this.showTimeRangePanel = false;

            const ref = this.$children[0];
            if (ref === undefined || ref.$el === undefined) return;
            if (this.field.disabled) {
                ref.$el.classList.remove('_open');
                return;
            }
            const isOpen = ref.defaultOpen;
            if (isOpen === true) ref.$el.classList.add('_open');
            else {
                ref.$el.classList.remove('_open');
                setTimeout(() => {
                    this.unfocus();
                }, 0);
            }
        },
        closeDatePicker(index) {
            if (index === 0) {
                this.$refs[`date-${index}`].closePopup();
            } else {
                this.$refs[`date-${index}`][0].closePopup();
            }
        },
        handleDate(value, index) {
            if (index === 0) {
                this.$emit('input', {
                    value: [ this.formatPickerToApi(value) ],
                    code: this.field.code,
                });
            } else {
                const dates = [...this.datesApiFormatted];
                dates.splice(index, 1, this.formatPickerToApi(value));
                this.$emit('input', { value: dates, code: this.field.code });
            }
        },
        focus(e) {
            this.isFocused = true;
        },
        unfocus() {
            this.isFocused = false;
        },
    },
};
</script>

<style src="./multiple-dates.less" lang="less"/>
