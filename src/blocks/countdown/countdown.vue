<template>
    <ul class="countdown">
        <li class="countdown__time" v-for="(time, index) in timeLeft" :key="index">
            <span class="countdown__number">{{ time.value }}</span>
            <span class="countdown__description">{{ time.label }}</span>
        </li>
    </ul>
</template>

<script>
import { doubleDigit } from '@/tools';

export default {
    name: 'Countdown',
    inheritAttrs: false,
    props: {
        date: {
            type: [Number, String],
            default: 0,
        },
    },
    data: () => ({
        timeLeft: [],
    }),
    created() {
        this.calcTimeLeft();
        this.refreshInterval = setInterval(this.calcTimeLeft, 60 * 1000); // Каждые 60 сек
    },
    beforeDestroy() {
        clearInterval(this.refreshInterval);
    },
    methods: {
        calcTimeLeft() {
            if (!this.date) return;
            const today = new Date().getTime();
            if (!today) return;
            this.timeLeft = [];
            const dateDif = (this.date - today) / 60 / 1000;
            const day = Math.floor(dateDif / 24 / 60);
            if (day > 0) this.timeLeft.push({ value: doubleDigit(day), label: 'Дни'});
            const hours = Math.floor(dateDif / 60) % 24;
            if (hours >= 0) this.timeLeft.push({ value: doubleDigit(hours), label: 'Часы'});
            const minutes = Math.floor(dateDif) % 60;
            if (minutes >= 0) this.timeLeft.push({ value: doubleDigit(minutes), label: 'Минуты'});
        },
    },
};
</script>

<style src="./countdown.less" lang="less"/>
