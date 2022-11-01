<template>
    <div class="select-lang">
        <select-item-with-image
            :is-dark-theme="isDarkTheme"
            :options="getLang.list"
            :selectedValue="getLang.selected"
            @onSelect="setLang"
        />
    </div>
</template>

<script>
import SelectItemWithImage from '@/blocks/select-item-with-image';
import { mapState } from 'vuex';

export default {
    name: 'SelectLang',
    components: {
        SelectItemWithImage,
    },
    props: {
        isDarkTheme: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    computed: {
        ...mapState({
            getLang: ({ global }) => global.lang,
        }),
    },
    methods: {
        async setLang(lang) {
            await this.$store.dispatch('global/changeLang', lang);
        },
    },
};
</script>

<style src="./select-lang.less" lang="less" />
