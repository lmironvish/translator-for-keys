<template>
    <div
        v-if="newNotificationsCount"
        class="notifications-indicator"
    >
        {{ newNotificationsCount }}
    </div>
</template>

<script>

export default {
    name: 'NotificationsIndicator',
    computed: {
        newNotificationsCount() {
            return this.$store.state.notifications.unviewedList.length;
        }
    }
}
</script>

<style src="./notifications-indicator.less" lang="less"/>
