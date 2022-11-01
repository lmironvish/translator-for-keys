<template>
    <date-picker
        class="filter-date"
        :class="{
            input_error: hasError,
            'mx-datepicker_hide-picker': hidePicker,
            'mx-datepicker_month-picker': isMonthPicker,
            'mx-datepicker_year-month-buttons-disabled': !field.isYearMonthButtonsActive
        }"
        v-model="field.value"
        v-bind="bindDataPicker(field)"
        @input="handleDate($event, field.code)"
        @clear="handleDate($event, field.code)"
        @open="toggleDatePicker(field.code)"
        @close="toggleDatePicker(field.code)"
        @click.native="focus"
        v-click-outside="unfocus"
        :disabled-date="isDataDisabled"
        :disabled="disabled"
    >
        <div slot="header">
            {{ field.description || "Выберите период" }}
            <button
                class="mx-datepicker-header__close"
                type="button"
                @click="closeDatePicker(field.code)"
            >
                Закрыть
            </button>
        </div>
        <span slot="icon-calendar" class="mx-icon-calendar__icon"></span>
    </date-picker>
</template>

<script>
import datePickerLangRu from "@/data/date-picker-lang-ru";
import moment from "moment";

export default {
    name: "FilterDate",
    inheritAttrs: false,
    props: {
        field: {
            type: Object,
            default: () => {}
        },
        hasError: {
            type: Boolean,
            default: false
        },
        isMonthPicker: Boolean,
        disabledDates: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isYearPicker: {
            type: Boolean,
            default: false
        },
        isClearable: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        isFocused: false
    }),
    computed: {
        hidePicker() {
            return this.$mq !== "desktop" && !this.isFocused;
        },
        formattedDisabledDates() {
            return this.disabledDates.map(date =>
                moment(date).format("yy-MM-DD")
            );
        }
    },
    methods: {
        bindDataPicker(field) {
            const {
                placeholder,
                isRange,
                isTimePicker,
                code,
                disabled
            } = field;
            let type;
            let format;
            if (isTimePicker === true) {
                // есть ли пикер времени
                type = "datetime";
                format = "ddd, D MMMM HH:mm";
            } else if (this.isMonthPicker) {
                // внещне
                type = "month";
                format = "MMMM, YYYY";
            } else if (this.isYearPicker) {
                type = "year";
                format = "YYYY";
            } else {
                type = "date";
                format = "ddd, D MMMM";
            }
            return {
                lang: datePickerLangRu,
                confirm: this.$mq === "desktop" && isRange,
                confirmText: "Выбрать",
                placeholder: placeholder,
                range: isRange === true, // есть ли диапазон дат
                type,
                valueType:
                    isTimePicker === true ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD", // внутри
                format,
                timePickerOptions: {
                    start: "00:00",
                    step: "00:30",
                    end: "23:30",
                    format: "HH:mm"
                },
                timeTitleFormat: "D MMMM",
                appendToBody: false,
                // Если передать open false, то окно нельзя будет открыть
                open: this.$mq !== "desktop" ? true : undefined,
                disabled,
                clearable: this.isClearable
            };
        },
        toggleDatePicker(code) {
            const ref = this.$children[0];
            if (ref === undefined || ref.$el === undefined) return;
            if (this.field.disabled) {
                ref.$el.classList.remove("_open");
                return;
            }
            const isOpen = ref.defaultOpen;
            if (isOpen === true) ref.$el.classList.add("_open");
            else ref.$el.classList.remove("_open");
        },
        closeDatePicker(code) {
            this.$children[0].closePopup();
        },
        handleDate(value, code) {
            this.$emit("input", { value, code });
        },
        focus() {
            this.isFocused = true;
        },
        unfocus() {
            this.isFocused = false;
        },
        isDataDisabled(date) {
            return this.formattedDisabledDates.includes(
                moment(date).format("yy-MM-DD")
            );
        }
    }
};
</script>

<style src="./filter-date.less" lang="less" />
