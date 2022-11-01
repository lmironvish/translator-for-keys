<template>
    <p class="countdown-simple" v-if="compact">
        {{ timeLeft }}
    </p>
    <p class="countdown-simple" v-else>
        Осталось времени — {{ timeLeft }}
    </p>
</template>

<script>
import moment from 'moment';

export default {
    name: 'countdown-simple',
    props: {
        seconds: Number,
        compact: Boolean
    },
    data: () => ({
        startTime: null,
        passedSeconds: 0,
    }),
    created() {
        this.startCountDown();
    },
    destroyed() {
        this.stopCountDown();
    },
    computed: {
        secondsLeft() {
            return this.seconds - this.passedSeconds;
        },
        timeLeft() {
            const duration = moment.duration(this.secondsLeft, 'seconds');

            return [Math.floor(duration.asHours()), duration.minutes(), duration.seconds()]
                .map(item => item.toString().padStart(2, '0'))
                .join(':');
        },
    },
    methods: {
        updatePassedSeconds() {
            this.passedSeconds = Math.floor((Date.now() - this.startTime) / 1000);

            if (this.secondsLeft <= 0) {
                this.stopCountDown();
                this.$emit('timeOut');
            }
        },
        startCountDown() {
            this.startTime = Date.now();
            this._timerId = setInterval(this.updatePassedSeconds, 50);
        },
        stopCountDown() {
            clearInterval(this._timerId);
        },
    },
}
</script>

<style src="./countdown-simple.less" lang="less" />
