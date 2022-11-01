<template>
    <ul class="edit-list">
        <li
            class="edit-list__item"
            v-for="(field, fieldIndex) in editList"
            :key="field.code"
            :style="fieldStyles(field.styles)"
        >
            <p
                class="edit-list__label"
                v-if="field.label !== undefined"
                v-text="field.label"
            />
            <component
                :is="`filter-${field.component}`"
                :key="field.code"
                :ref="field.code"
                :field="field"
                v-bind="field"
                @input="updateFilters($event, field, fieldIndex)"
                @searchChange="$emit('searchChange', $event)"
            >{{ field.slot }}</component>

            <validation-errors
                v-if="field.validations"
                class="edit-list__errors"
                :validator="$v.editList[fieldIndex].value"
            />
        </li>
    </ul>
</template>

<script>
import FilterCheckbox from '@/blocks/checkbox';
import FilterInput from '@/blocks/filter-input';
import FilterSelect from '@/blocks/filter-select';
import FilterDate from '@/blocks/filter-date';
import FilterMultiple from '@/blocks/multiple-input';
import FilterCkEditor from '@/blocks/ck-editor';
import FilterTextarea from '@/blocks/textarea';
import FilterRange from '@/blocks/range-input';
import ValidationErrors from '@/blocks/validation-errors';

import listValidation from '@/mixins/list-validation';

export default {
    name: 'EditList',
    mixins: [listValidation],
    props: {
        editList: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        FilterCheckbox,
        FilterInput,
        FilterSelect,
        FilterDate,
        FilterMultiple,
        FilterCkEditor,
        FilterTextarea,
        ValidationErrors,
        FilterRange,
    },
    validations() {
        return this.getValidationRules('editList');
    },
    methods: {
        fieldStyles(styles) {
            if (styles !== undefined) return styles[this.$mq];
        },
        updateFilters($event, field, fieldIndex) {
            if (field.validations) {
                // Вызов $ditry, для данных, получаемых через props
                this.$v.editList[fieldIndex].value.$touch();
                this.editList[fieldIndex].hasError = this.$v.editList[fieldIndex].$error;
            }
            // checkbox - единственный компонент, который сам не изменяет свой value
            if (field.component === 'checkbox') field.value = $event;
            this.$emit('updateFilters', { hasErrors: this.$v.editList.$anyError });
        },
    },
};
</script>

<style src="./edit-list.less" lang="less"/>
