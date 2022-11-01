<template>
    <div class="ck-editor">
        <editor-block
            :value="field.value"
            :config="editorConfig"
            @input="onInput"
        />
    </div>
</template>

<script>
import CKEditor from 'ckeditor4-vue/dist/legacy';

export default {
    name: 'CkeEditor',
    components: {
        EditorBlock: CKEditor.component
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        field: Object
    },
    data: () => ({
        editorConfig: {
            options: {rows: 10},
            toolbar: [
                ['Source', 'About', 'Table'],
                ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
                ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt', 'Maximize', 'ShowBlocks'],
                ['Bold', 'Italic', 'Underline', 'Strike'],
                ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-',
                    'Link', 'Unlink', 'Anchor', '-', 'JustifyLeft', 'JustifyCenter',
                    'JustifyRight', 'JustifyBlock']
            ]
        }
    }),
    methods: {
        onInput(value) {
            this.field.value = value;
            this.$emit('input', value);
        }
    }
}
</script>

<style src="./ck-editor.less" lang="less"/>
