<template>
    <div class="file-item">
        <div class="file-item__file-image" :style="styles"></div>
        <div class="file-item__file-delete" @click.prevent="$emit('deleteFile')"></div>
    </div>
</template>

<script>
import { getFormatByMime } from '@/tools/media';

export default {
    name: 'FileInput',
    inheritAttrs: false,
    props: {
        path: {
            type: String,
            default: '',
        },
        mime: {
            type: String,
            default: '',
        },
    },
    computed: {
        styles() {
            if (!this.path) return false;
            const format = getFormatByMime(this.mime);
            let backgroundImage;
            switch (format) {
                case 'word':
                    backgroundImage = this.createStaticUrl('images/ico/word-icon.svg', true);
                    break;
                case 'excel':
                    backgroundImage = this.createStaticUrl('images/ico/excel-icon.svg', true);
                    break;
                case 'pdf':
                    backgroundImage = this.createStaticUrl('images/ico/pdf-icon.svg', true);
                    break;
                default:
                    backgroundImage = this.createUploadUrl(this.path, true);
                    break;
            }
            return { backgroundImage  }
        },
    },
};
</script>

<style src="./file-item.less" lang="less"/>

