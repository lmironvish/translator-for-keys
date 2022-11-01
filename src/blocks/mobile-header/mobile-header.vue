<template>
    <div class="mobile-header">
        <div class="mobile-header__left">
            <div
                v-if="closeState"
                class="mobile-header__close"
                @click="$emit('menu-close')"
            ></div>
            <div
                v-else-if="backState && $mq === 'mobile'"
                class="mobile-header__back"
                @click="goBack({ name: 'dashboard.Main' })"
            ></div>
            <div
                v-else
                class="mobile-header__burger"
                @click="$emit('menu-open')"
            >
                <notifications-indicator
                    class="mobile-header__notifications-indicator"
                />
            </div>
            <select-lang
                v-if="closeState || $mq !== 'mobile'"
                class="mobile-header__lang"
            />
            <button-block
                v-if="showAdd"
                class="mobile-header__button"
                icon="plus-bold"
                @click="$emit('add')"
            />
        </div>
        <div
            :class="getBemClass('mobile-header__location', { hasFaqButton })"
            :data-item-count="itemCount"
            @click="onLocationClick"
        >
            {{ headerText }}
        </div>
    </div>
</template>

<script>
import SelectLang from '@/blocks/select-lang';
import NotificationsIndicator from '../notifications-indicator';
import ButtonBlock from '../button';

import { goBack } from '@/tools';

export default {
    name: 'MobileHeader',
    components: {
        NotificationsIndicator,
        ButtonBlock,
        SelectLang,
    },
    props: {
        closeState: {
            type: Boolean,
            default: false,
        },
        backState: {
            type: Boolean,
            default: false,
        },
        header: {
            type: String,
            default: '',
        },
        itemCount: {
            type: Number,
            default: null,
        },
        showAdd: {
            type: Boolean,
            default: false,
        },
        hasFaqButton: Boolean,
    },
    computed: {
        headerText() {
            return this.closeState === false ? this.header : 'Меню';
        },
    },
    methods: {
        goBack,
        onLocationClick() {
            if (this.hasFaqButton) {
                this.$router.push({ name: 'dashboard.Faq' });
            }
        },
    },
};
</script>

<style src="./mobile-header.less" lang="less" />
