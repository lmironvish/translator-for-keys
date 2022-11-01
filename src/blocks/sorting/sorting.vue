<template>
    <div class="sorting">
        <div
            v-if="$mq !== 'desktop' && (showMobileSorting || showMobileFilter)"
            class="sorting__heading"
        >
            <button
                v-if="showMobileSorting"
                class="sorting__open-sorting"
                :class="{ '_is-open': isOpen }"
                type="button"
                @click="toggleSoringList"
                :aria-label="$t(`global.openSorting`)"
            >
                <span class="sorting__direction" :class="directionClasses">{{
                    headingText
                }}</span>
            </button>
            <button
                v-if="showMobileFilter"
                class="sorting__open-filter"
                type="button"
                @click="$emit('openFilter')"
                :aria-label="$t(`global.showFilters`)"
            ></button>
        </div>

        <div
            class="sorting__list-wrapper"
            :class="{ '_is-open': isOpen }"
            ref="listWrapper"
        >
            <ul class="sorting__list" ref="list">
                <li
                    v-for="(sorting, index) in doubleOptions"
                    class="sorting__list-item"
                    :class="listItemClasses(sorting)"
                    :key="
                        `${sorting.code}-${index}+${{ valueOf: Math.random }}`
                    "
                    :style="fieldStyles(sorting.styles)"
                    v-sticky-cell="stickyCellOptions"
                >
                    <button
                        class="sorting__button"
                        :class="buttonClasses(sorting)"
                        type="button"
                        @click="updateSorting(sorting)"
                        :disabled="isFieldDisabled(sorting)"
                    >
                        <span class="sorting__text">{{ sorting.langKey ? $t(`global.${sorting.langKey}`) : sorting.label }}</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "Sorting",
    props: {
        sortingList: {
            type: Array,
            default: () => []
        },
        fixedLeftColumns: {
            type: Number,
            default: 0
        },
        fixedRightColumns: {
            type: Number,
            default: 0
        },
        showMobileSorting: {
            type: Boolean,
            default: true
        },
        showMobileFilter: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        isOpen: false
    }),
    computed: {
        headingText() {
            return this.currentlySelected
                ? this.currentlySelected.label
                : "По умолчанию";
        },
        currentlySelected() {
            const selected = this.sortingList.filter(el => el.value !== "");
            return selected[0];
        },
        directionClasses() {
            const classes = [];
            if (this.currentlySelected) {
                classes.push(`_${this.currentlySelected.value}`);
                if (this.currentlySelected.type) {
                    classes.push(
                        `sorting__button_${this.currentlySelected.type}`
                    );
                }
            }
            return classes;
        },
        doubleOptions() {
            if (this.$mq === "desktop") return this.sortingList;
            const activeList = [];
            this.sortingList.forEach(el => {
                if (el.isEnabled) {
                    activeList.push({ ...el, value: "asc" });
                    activeList.push({ ...el, value: "desc" });
                }
            });
            return activeList;
        },
        stickyCellOptions() {
            return {
                leftCount: this.fixedLeftColumns,
                rightCount: this.fixedRightColumns,
                rightClass: "sorting__list-item_bg_whitesmoke"
            };
        }
    },
    methods: {
        buttonClasses(sorting) {
            const classes = [];
            if (sorting.value) classes.push(`_${sorting.value}`);
            if (sorting.type) classes.push(`sorting__button_${sorting.type}`);
            return classes;
        },
        fieldStyles(styles) {
            if (styles !== undefined) return styles[this.$mq];
        },
        toggleSoringList() {
            const { listWrapper, list } = this.$refs;
            if (this.isOpen === true) listWrapper.style.height = "0px";
            else listWrapper.style.height = list.offsetHeight + "px";
            this.isOpen = !this.isOpen;
        },
        isFieldDisabled(sorting) {
            return !sorting.isEnabled;
        },
        listItemClasses(sorting) {
            const classes = [];
            if (this.isFieldDisabled(sorting))
                classes.push("sorting__list-item_disabled");

            if (this.currentlySelected === undefined) return classes;
            if (
                sorting.value === this.currentlySelected.value &&
                sorting.code === this.currentlySelected.code
            ) {
                classes.push("_checked");
            }
            return classes;
        },
        updateSorting(sorting) {
            const { value, code } = sorting;
            const setExact = this.$mq !== "desktop";
            this.$emit("updateSorting", { value, code, setExact });
        }
    }
};
</script>

<style src="./sorting.less" lang="less" />
