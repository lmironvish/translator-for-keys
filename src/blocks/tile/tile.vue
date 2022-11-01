<template>
    <component
        :is="route ? 'router-link' : 'div'"
        :class="classes"
        :to="route"
        :style="style"
    >
        <div class="tile__top-corner">
            <slot name="top-corner"/>
        </div>
        <div class="tile__head">
            <div class="tile__title">
                <slot name="title"/>
            </div>
        </div>

        <template v-if="items">
            <div v-for="item in internalItems" class="tile__item">
                <slot v-if="item.slot" :name="'item:' + item.slot" :item="item"/>
                <template v-else>
                    <div v-html="item.text"></div>
                </template>
            </div>
        </template>

        <ul v-if="levels.length > 0" class="tile__levels">
            <li
                class="tile__level"
                :class="{'tile__level': styleMode === 'small'}"
                v-for="(level, index) in levels"
                :key="index"
            >
                <span class="tile__label" v-html="level.label"></span>
                <span class="tile__range">
                    <span
                        class="tile__range-bg"
                        :style="{width: level.percentage+'%'}"
                    >
                    </span>
                </span>
            </li>
        </ul>

        <div v-if="$slots.bottom" class="tile__bottom">
            <slot name="bottom"/>
        </div>
    </component>
</template>

<script>
    export default {
        props: {
            items: Array,
            levels: {
                type: Array,
                default: () => ([]),
            },
            code: String,
            type: String,
            icon: String,
            width: [Number, String],
            route: Object,
            styleMode: String
        },
        computed: {
            classes() {
                const classes = [
                    this.getBemClass('tile', { icon: this.icon }),
                ];
                classes.push(`tile_${this.code}`)
                if (this.width === 50) {
                    classes.push(`tile_${this.code}_half`);
                }
                return classes;
            },
            internalItems() {
                return this.items.map(item => typeof item === 'object' ? item : { text: item });
            },
            horizontalMargin() {
                return typeof this.width === 'number' ? 10 : 0;
            },
            internalWidth() {
                if (this.$mq === 'desktop') {
                    if (typeof this.width === 'number') {
                        return `calc(${this.width}% - ${this.horizontalMargin * 2}px)`;
                    }

                    return this.width;
                }

                return '100%';
            },
            style() {
                return {
                    width: this.internalWidth,
                    marginLeft: this.horizontalMargin + 'px',
                    marginRight: this.horizontalMargin + 'px'
                };
            },
        },
    }
</script>

<style src="./tile.less" lang="less"/>
