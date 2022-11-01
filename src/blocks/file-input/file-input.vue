<template>
    <label class="file-input" :class="{'file-input_cursor-default': field.isSingle && field.value}">
        <div class="file-input__files-holder">
            <template v-if="field.isSingle && field.value">
                <file-item
                    class="file-input__file file-input__file_single"
                    :path="field.value.path"
                    :mime="field.value.mime"
                    @deleteFile="deleteFile(field.value.path)"
                />
            </template>
            <template v-if="!field.isSingle">
                <file-item
                    class="file-input__file"
                    v-for="(img, imgIndex) in field.value"
                    :key="img.path"
                    :path="img.path"
                    :mime="img.mime"
                    @deleteFile="deleteFile(img.path, imgIndex)"
                />
            </template>

            <div
                v-if="!field.isSingle || (field.isSingle && !field.value)"
                class="file-input__file file-input__file_input file-input__add-file"
                :class="{'file-input__file_single': field.isSingle}"
            >
                <input
                    class="file-input__file-input"
                    id="files"
                    type="file"
                    :multiple="!field.isSingle"
                    ref="fileInput"
                    @change="handleChange(field.isSingle)"
                >
            </div>
        </div>
    </label>
</template>

<script>
import FileItem from './file-item';

import api from '@/api';

export default {
    name: 'FileInput',
    inheritAttrs: false,
    props: {
        field: {
            type: Object,
            default: () => {},
        },
        hasError: {
            type: Boolean,
            default: false,
        },
        addExts: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        FileItem,
    },
    data: () => ({
        defaultExts: ['jpg', 'jpeg', 'png', 'wepb'],
    }),
    computed: {
        availableExts() {
            return [...this.defaultExts, ...this.addExts];
        },
    },
    methods: {
        handleChange(isSingle) {
            if (isSingle) this.changeSingleFile();
            else this.changeFiles();
        },
        async changeSingleFile() {
            const formData = new FormData();
            const newImg = this.$refs.fileInput.files[0];
            if (!this.field.value || this.field.value.name !== newImg.name) {
                const ext = newImg.name.split('.').pop();
                if (this.availableExts.indexOf(ext.toLowerCase()) >= 0) {
                    formData.append('files[]', newImg);
                }
            }
            try {
                const response = await api.upload.uploadFile(formData);
                this.$emit('input', { value: response[0] });
            } catch (error) {

            }
        },
        async changeFiles() {
            const formData = new FormData();
            Array.from(this.$refs.fileInput.files).forEach((file) => {
                if (!this.field.value.find(currentFile => currentFile.name === file.name)) {
                    const ext = file.name.split('.').pop();
                    if (this.availableExts.indexOf(ext.toLowerCase()) >= 0) {
                        formData.append('files[]', file);
                    }
                }
            });
            try {
                const response = await api.upload.uploadFile(formData);
                this.$emit('input', { value: [...this.field.value, ...response] });
            } catch (error) {

            }
        },
        async deleteFile(path, imgIndex) {
            try {
                if (this.field.isSingle) {
                    // await api.upload.deleteFile(this.field.value.id);
                    this.$emit('input', { value: null });
                } else {
                    // await api.upload.deleteFile(this.field.value[imgIndex].id);
                    const newArr = this.field.value.filter(el => el.path !== path);
                    this.$emit('input', { value: newArr });
                }
            } catch (error) {

            }
        },
    },
};
</script>

<style src="./file-input.less" lang="less"/>
