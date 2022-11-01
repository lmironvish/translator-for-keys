<template>
    <div v-if="options.length > 0" class="select-all">
        <checkbox-block
            :value="isAllSelected"
            @input="$emit('input', $event ? options : [])"
        >
            <slot>Выбрать все</slot>
        </checkbox-block>
    </div>
</template>

<script>
    import CheckboxBlock from '@/blocks/checkbox';
    import differenceBy from 'lodash/differenceBy';

    export default {
        props: {
            value: Array,
            options: Array,
        },
        components: {
            CheckboxBlock,
        },
        computed: {
            isAllSelected() {
                return differenceBy(this.options, this.value, 'value').length === 0;
            },
        },
    }
</script>
