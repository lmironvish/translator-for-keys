<template>
    <div class="tabs">
        <div
            v-for="tab in tabs"
            :key="tab.id"
            class="tabs__item"
            :class="tab.id === activeTabId && 'tabs__item_active'"
            @click="$emit('tab-click', tab.id)"
        >
            {{ tab.text }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Tabs',
        props: {
            tabs: Array,
            activeTabId: [Number, String]
        }
    }
</script>

<style src="./tabs.less" lang="less"/>
