<template>
    <div class="user-avatar">
        <label class="user-avatar__label" :class="{'user-avatar__label_can-upload': canUpload}" :style="styles">
            <input
                class="user-avatar__file-input"
                type="file"
                ref="fileInput"
                @change="onFilesChange"
            >
        </label>
    </div>
</template>

<script>
import api from '@/api';

export default {
    name: 'UserAvatar',
    inheritAttrs: false,
    props: {
        img: {
            type: Object,
            default: null,
        },
        canUpload: {
            type: Boolean,
            default: false,
        },
        maxWidth: {
            type: Number,
            default: 0,
        },
    },
    data: () => ({
        availableExts: [
            'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'wepb', 'WebP'
        ],
    }),
    computed: {
        user() {
            return this.$store.state.user.data;
        },
        avatar() {
            if (this.img) return this.img;
            if (this.user && this.user.avatar) return this.user.avatar;
            return null;
        },
        path() {
            return this.avatar ? this.avatar.path : null;
        },
        styles() {
            if (this.path) {
                return { backgroundImage: this.createUploadUrl(this.path, true) };
            }
            return { backgroundImage: this.createStaticUrl('images/profile-placeholder.jpg', true) };
        },
    },
    methods: {
        async onFilesChange() {
            const formData = new FormData();
            const newImg = this.$refs.fileInput.files[0];
            if (!this.avatar || this.avatar.name !== newImg.name) {
                const ext = newImg.name.split('.').pop();
                if (this.availableExts.indexOf(ext) >= 0) {
                    formData.append('files[]', newImg);
                }
            }
            if (this.maxWidth !== 0) {
                formData.append('maxWidth', this.maxWidth);
            }
            try {
                const response = await api.upload.uploadFile(formData);
                this.$emit('input', response[0]);
            } catch (error) {

            }
        },
    },
};
</script>

<style src="./user-avatar.less" lang="less"/>
