<template>
    <div :class="getBemClass('promocode-copy', { color })" @click="copyPromocode">
        <div class="promocode-copy__code">
            <div class="promocode-copy__code-value">{{ promocode }}</div>
        </div>
        <div class="promocode-copy__copy-button">
            {{ isCopied ? 'Промокод скопирован' : 'Скопируйте промокод' }}
            <svg-icon class="promocode-copy__copy-svg" name="copy"/>
        </div>
    </div>
</template>

<script>
import { copyText } from '@/tools';

import SvgIcon from '../svg-icon';

export default {
    name: 'PromocodeCopy',
    components: {
        SvgIcon,
    },
    props: {
        promocode: String,
        color: String,
    },
    data: () => ({
        isCopied: false,
    }),
    methods: {
        copyPromocode() {
            copyText(this.promocode);
            this.isCopied = true;
            setTimeout(() => {
                this.isCopied = false;
            }, 1000);
        },
    },
}
</script>

<style src="./promocode-copy.less" lang="less"/>
