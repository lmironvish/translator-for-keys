<template>
    <div class="time-picker">
        <filter-select
            class="time-picker__timezone"
            :field="timeZone"
            :has-error="hasError"
            @input="update($event.value, 'timeZone')"
        />
<!--        <filter-input-->
<!--            class="time-picker__local-time"-->
<!--            :field="localTime"-->
<!--            :has-error="hasError"-->
<!--            @input="update($event.value, 'localTime')"-->
<!--        />-->
        <filter-date
            class="time-picker__date-picker"
            :field="{ value: localTime, isTimePicker: true, description: 'Дата начала', placeholder: 'Дата проведения' }"
            :has-error="hasError"
            @input="update($event.value, 'localTime')"
        />
    </div>
</template>

<script>
    import FilterSelect from "../filter-select/filter-select";
    import FilterDate from "@/blocks/filter-date/filter-date";

    export default {
        name: 'TimePicker',
        inheritAttrs: false,
        props: {
            code: {
                type: String,
                default: '',
            },
            timeZone: {
                type: Object,
                default: () => {
                    return {
                        code: '',
                        options: [],
                        value: 5,
                        placeholder: '',
                    };
                },
            },
            localTime: {
                type: Object,
                default: () => {
                    return {
                        code: '',
                        type: 'number',
                        value: null,
                        placeholder: 'Местное время',
                    };
                },
            },
            hasError: Boolean,
        },
        components: {
            FilterDate,
            FilterSelect,
        },
        methods: {
            update(value, param) {
                this[param].value = value;
                this.$emit('input', { value: [this.timeZone.value, this.localTime.value], code: this.code });
            },
        },
    };
</script>

<style src="./time-picker.less" lang="less"/>
