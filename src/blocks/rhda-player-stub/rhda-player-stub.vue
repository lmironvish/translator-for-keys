<template>
    <div class="rhda-player-stub">
        <div class="rhda-player-stub__content">
            <div class="rhda-player-stub__text">Трансляция начнется</div>
            <div :class="getBemClass('rhda-player-stub__text', { bold: true })">{{ startDate }}</div>
            <div class="rhda-player-stub__timer">
                <div class="rhda-player-stub__timer-item">
                    <div class="rhda-player-stub__timer-item-value">{{ remainTime.days }}</div>
                    <div class="rhda-player-stub__timer-item-label">День</div>
                </div>
                <div class="rhda-player-stub__separator"></div>
                <div class="rhda-player-stub__timer-item">
                    <div class="rhda-player-stub__timer-item-value">{{ remainTime.hours }}</div>
                    <div class="rhda-player-stub__timer-item-label">Часы</div>
                </div>
                <div class="rhda-player-stub__separator"></div>
                <div class="rhda-player-stub__timer-item">
                    <div class="rhda-player-stub__timer-item-value">{{ remainTime.minutes }}</div>
                    <div class="rhda-player-stub__timer-item-label">Минуты</div>
                </div>
            </div>
        </div>
        <img :src="createStaticUrl('images/rhda-player-stub-image.png')" class="rhda-player-stub__image">
    </div>
</template>

<script>
    export default {
        props: {
            startDate: String,
            remainTime: Object,
        },
    }
</script>

<style src="./rhda-player-stub.less" lang="less"/>
