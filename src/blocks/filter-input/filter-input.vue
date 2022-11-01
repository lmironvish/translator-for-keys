<template>
    <label class="filter-input label">
        <the-mask
            ref="maskRef"
            v-if="useTheMask"
            class="input filter-input__input"
            :class="inputClasses"
            v-model="field.value"
            :placeholder="field.langKeyPlaceholder ? $t(`global.${field.langKeyPlaceholder}`) : field.placeholder || false"
            :disabled="field.disabled || disabled"
            v-bind="maskPreset"
            @input="handleInput($event, field.code)"
        />
        <input
            v-else
            class="input filter-input__input"
            :class="inputClasses"
            :type="inputType"
            v-model="field.value"
            :min="field.min"
            :max="field.max"
            :placeholder="field.langKeyPlaceholder ? $t(`global.${field.langKeyPlaceholder}`) : field.placeholder || false"
            :disabled="field.disabled || disabled"
            @input="handleInput($event, field.code)"
        />
        <filter-clear
            v-if="showClearBtn"
            class="filter-input__clear"
            @clear="filterClear(field.code)"
            :disabled="field.disabled || !field.value || field.value.length < 1 || disabled"
        />
        <button
            v-if="isTypeToggle"
            type="button"
            class="filter-input__type-toggle"
            :class="
                field.type === 'text'
                    ? 'filter-input__type-toggle_open'
                    : 'filter-input__type-toggle_close'
            "
            @click="$emit('type-toggle')"
            tabindex="-1"
        ></button>
    </label>
</template>

<script>
import { TheMask } from "vue-the-mask";
import FilterClear from "@/blocks/filter-clear";

import presets from "./mask-presets";

export default {
    name: "FilterInput",
    inheritAttrs: false,
    props: {
        local: {
            type: String,
            default: 'ru'
        },
        field: {
            type: Object,
            default: () => {}
        },
        isAuth: Boolean,
        isClearable: {
            type: Boolean,
            default: false
        },
        isTypeToggle: Boolean,
        hasError: {
            type: Boolean,
            default: false
        },
        disabled: { type: Boolean, default: false }
    },
    computed: {
        showClearBtn() {
            return (
                !this.isTypeToggle &&
                (this.isClearable || this.$mq !== "desktop")
            );
        },
        inputClasses() {
            const classes = [];
            if (this.isAuth) classes.push("filter-input__input_auth");
            if (this.hasError) classes.push("input_error");
            return classes;
        },
        inputType() {
            if (this.field.type === "password") return "password";
            if (this.field.type === "number") return "number";
            return "text";
        },
        useTheMask() {
            return this.field.type === "phone";
        },
        maskPreset() {
            if (!this.useTheMask) return;
            const { mask, tokens } = presets[this.local];
            return { mask, tokens };
        }
    },
    components: {
        TheMask,
        FilterClear
    },
    methods: {
        async handleInput(event, code) {
            // В vue-the-mask event === event.target.value обычного инпута
            await this.$nextTick();
            let value = this.useTheMask ? this.$refs.maskRef.display : event.target.value
            if (value && this.field.type === "phone") value = value.replace(/\D/g, '');
            switch (this.field.type) {
                case "number":
                    value = +value;
                    break;
                case "email":
                    value = value.trim();
                    break;
            }
            this.$emit("input", { value, code });
        },
        filterClear(code) {
            this.field.value = "";
            this.$emit("input", { value: "", code });
        }
    }
};
</script>

<style src="./filter-input.less" lang="less" />
