<template>
    <div class="slide-right">
        <div
            v-if="$slots.title"
            :class="{ scrolled: bodyScroll > 0 }"
            class="slide-right__head"
        >
            <div class="slide-right__title">
                <slot name="title" />
            </div>
            <button class="slide-right__close" @click="$emit('close')"></button>
        </div>
        <div class="slide-right__body-holder">
            <div
                :style="{ right: `-${scrollbarWidth}px` }"
                class="slide-right__body"
                @scroll="onBodyScroll"
            >
                <slot />
            </div>
        </div>

        <div v-if="$slots.bottom" class="slide-right__body-bottom">
            <slot name="bottom" />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "slide-right",
    props: {
        scrollLock: Boolean
    },
    data: () => ({
        bodyScroll: 0
    }),
    created() {
        if (this.scrollLock) {
            document.querySelector("body").classList.add("scroll-lock");
        }
    },
    destroyed() {
        if (this.scrollLock) {
            document.querySelector("body").classList.remove("scroll-lock");
        }
    },
    computed: {
        ...mapState({
            scrollbarWidth: state => state.global.scrollbarWidth
        })
    },
    methods: {
        onBodyScroll(e) {
            this.bodyScroll = e.target.scrollTop;
        }
    }
};
</script>

<style lang="less" src="./slide-right.less" />
