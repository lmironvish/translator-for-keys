<template>
    <div :class="getBemClass('tabs-adaptive', { flexGrow })">
        <div class="tabs-adaptive__header" v-if="$mq !== 'desktop'">
            <button
                class="tabs-adaptive__item tabs-adaptive__item_header"
                :class="{'_is-open': isOpen}"
                type="button"
                @click="toggleSortingList"
            >
                <span
                    class="tabs-adaptive__text tabs-adaptive__text_header"
                >{{ activeTabText }}</span>
            </button>
        </div>

        <div
            class="tabs-adaptive__list-wrapper"
            :class="{'_is-open': isOpen}"
            ref="listWrapper"
        >
            <div class="tabs-adaptive__list" ref="list">
                <template v-for="(tab, index) in tabs">
                    <button
                        v-if="$mq === 'desktop' || tab !== activeTabText"
                        :key="index"
                        class="tabs-adaptive__item"
                        :class="getBemClass('tabs-adaptive__item', {active: index === activeTabId, smallMargin})"
                        type="button"
                        @click="handleClick(index)"
                    >
                        <span
                            class="tabs-adaptive__text"
                            :class="index === activeTabId && 'tabs-adaptive__text_active'"
                        >{{ tab }}</span>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TabsAdaptive',
        props: {
            tabs: Array,
            activeTabId: [Number, String],
            flexGrow: Boolean,
            smallMargin: Boolean,
        },
        data: () => ({
            isOpen: false,
        }),
        computed: {
            activeTabText() {
                return this.tabs[this.activeTabId];
            },
        },
        methods: {
            handleClick(index) {
                this.$emit('tab-click', index);
                if (this.$mq !== 'desktop') this.toggleSortingList();
            },
            toggleSortingList() {
                const { listWrapper, list } = this.$refs;
                if (this.isOpen === true) listWrapper.style.height = '0px';
                else listWrapper.style.height = list.offsetHeight + 'px';
                this.isOpen = !this.isOpen;
            },
        },
    };
</script>

<style src="./tabs-adaptive.less" lang="less"/>
