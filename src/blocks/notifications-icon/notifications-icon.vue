<template>
    <div class="notifications-icon">
        <div class="notifications-icon__bell"></div>
        <notifications-indicator class="notifications-icon__count"/>
    </div>
</template>

<script>
import NotificationsIndicator from '../notifications-indicator';

export default {
    name: 'NotificationsIcon',
    components: {
        NotificationsIndicator
    }
}
</script>

<style src="./notifications-icon.less" lang="less"/>
