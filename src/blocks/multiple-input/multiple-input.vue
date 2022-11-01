<template>
    <form class="multiple-input" @submit.prevent="handleAdd">
        <form-field class="multiple-input__field">
            <filter-input
                :field="{
                    value: field.value[0],
                    type: field.type,
                    placeholder: field.langKeyPlaceholder ? $t(`global.${field.langKeyPlaceholder}`) : field.placeholder || false,
                    disabled: field.disabled
                }"
                :has-error="hasError"
                :isClearable="isClearable"
                @input="handleInput"
            />
        </form-field>
        <button-block
            class="multiple-input__add"
            icon="plus"
            type="submit"
            aria-label="Добавить в список"
        />
        <ul class="multiple-input__list" v-if="otherValues.length > 0">
            <li
                class="multiple-input__item"
                v-for="item in otherValues"
                :key="item"
                :title="item"
            >
                {{ item }}
                <filter-clear
                    class="multiple-input__clear"
                    @clear="removeItem(item)"
                    :title="$t('global.deleteTheElement')"
                />
            </li>
        </ul>
    </form>
</template>

<script>
import FormField from "@/blocks/form-field";
import FilterInput from "@/blocks/filter-input";
import ButtonBlock from "@/blocks/button";
import FilterClear from "@/blocks/filter-clear";

export default {
    name: "MultipleInput",
    inheritAttrs: false,
    components: {
        FormField,
        FilterInput,
        ButtonBlock,
        FilterClear
    },
    props: {
        field: {
            type: Object,
            default: () => {}
        },
        hasError: {
            type: Boolean,
            default: false
        },
        isClearable: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        value: ""
    }),
    computed: {
        hasValidators() {
            return !!this.$listeners.validateAction;
        },
        otherValues() {
            if (!this.field.value || !this.field.value.length) return [];
            return this.field.value.slice(1);
        }
    },
    created() {
        this.value = this.field.value[0] || "";
    },
    methods: {
        handleInput($event) {
            this.value = $event.value || null;
            this.emitInput([this.value, ...this.otherValues]);
        },
        handleAdd() {
            if (this.hasValidators) {
                this.$emit("validateAction", this.addField);
            } else {
                console.log("2");
                this.addField();
            }
        },
        addField() {
            console.log("addField");
            if (this.field.value.length === 1) this.value = this.field.value[0];
            if (this.value === null || this.value === "") return;
            if (this.otherValues.indexOf(this.value) >= 0) return;
            this.emitInput([null, ...this.field.value]);
            this.value = null;
        },
        removeItem(item) {
            this.emitInput(this.field.value.filter(val => val !== item));
        },
        emitInput(value) {
            if (!this.field.disabled) {
                this.$emit("input", { value });
            }
        }
    }
};
</script>

<style src="./multiple-input.less" lang="less" />
