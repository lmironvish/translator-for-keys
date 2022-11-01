<template>
    <div class="edit-form">
        <edit-list :editList="editList" ref="list" @updateFilters="updateFields" />
        <form-buttons
            @back="cancelEdit"
            @submit="submit"
            :confirm-text="saveText"
            :has-error="hasError"
        />
    </div>
</template>

<script>
import FormButtons from '@/blocks/form-buttons';
import EditList from '@/blocks/edit-list';

export default {
    name: 'EditForm',
    props: {
        editList: {
            type: Array,
            default: () => [],
        },
        saveText: {
            type: String,
            default: 'Сохранить',
        },
    },
    data: () => ({
        hasError: false,
    }),
    components: {
        FormButtons,
        EditList,
    },
    methods: {
        updateFields($event) {
            const { hasErrors } = $event;
            this.hasError = hasErrors;
        },
        cancelEdit() {
            this.$refs.list.nulifyErrors('editList');
            this.hasError = false;
            this.$emit('cancelEdit');
        },
        submit() {
            this.$refs.list.validateAllFields('editList');
            this.hasError = this.$refs.list.$v.$anyError;
            if (!this.hasError) this.$emit('submit');
        },
    },
};
</script>

<style src="./edit-form.less" lang="less"/>
