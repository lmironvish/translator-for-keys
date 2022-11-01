<template>
    <ul class="filter-list">
        <template v-if="renderDefaultList">
            <li
                v-for="field in filterList"
                class="filter-list__item"
                :key="field.code"
                :style="fieldStyles(field.styles)"
            >
                <component
                    v-if="field.component !== 'empty'"
                    :is="getComponent(field)"
                    :key="field.code"
                    :field="field"
                    :isClearable="
                        field.hasOwnProperty('isClearable')
                            ? field.isClearable
                            : true
                    "
                    @input="handleInput(field, $event)"
                    @searchChange="$emit('searchChange', $event)"
                    :tabs="getFieldTabs(field)"
                    :active-tab-id="activeTabIndex"
                    @tab-click="handleTabClick(field, $event)"
                />
            </li>
        </template>

        <template v-else-if="renderAltView">
            <template v-for="field in filterList">
                <li
                    v-if="field.component !== 'empty'"
                    class="filter-list__item filter-list__item_accordion"
                    :class="!field.label ? 'filter-list__item_hidden' : ''"
                    :key="field.code"
                    :style="fieldStyles(field.styles)"
                >
                    <p
                        v-if="field.label !== undefined"
                        class="filter-list__label"
                        v-text="field.langKey ? $t(`global.${field.langKey}`) : field.label"
                        @click="toggleAccordion($event, field)"
                    />
                    <div class="filter-list__accordion">
                        <component
                            :is="getComponent(field)"
                            :key="field.code"
                            :ref="field.code"
                            :field="field"
                            :isClearable="true"
                            @input="handleInput(field, $event)"
                            @searchChange="$emit('searchChange', $event)"
                            :tabs="getFieldTabs(field)"
                            :active-tab-id="activeTabIndex"
                            @tab-click="handleTabClick(field, $event)"
                        />
                    </div>
                </li>
            </template>
        </template>
    </ul>
</template>

<script>
import FilterInput from "@/blocks/filter-input";
import FilterSelect from "@/blocks/filter-select";
import FilterDate from "@/blocks/filter-date";
import FilterTextarea from "@/blocks/textarea";
import Checkbox from "@/blocks/checkbox";
import TabsAdaptive from "@/blocks/tabs-adaptive";

export default {
    name: "FilterList",
    props: {
        filterList: {
            type: Array,
            default: () => []
        },
        view: {
            type: String,
            default: "default"
        }
    },
    data: () => ({
        activeTabIndex: 0
    }),
    components: {
        FilterInput,
        FilterSelect,
        FilterDate,
        FilterTextarea,
        Checkbox,
        TabsAdaptive
    },
    computed: {
        renderDefaultList() {
            return this.$mq === "desktop" && this.view === "default";
        },
        renderAltView() {
            return this.$mq !== "desktop" && this.view !== "default";
        }
    },
    methods: {
        getFieldTabs(field) {
            if (field.component === "tabs") {
                return field.options.map(o => o.index);
            }
            return undefined;
        },
        handleTabClick(field, selectedTab) {
            this.activeTabIndex = selectedTab;
            const clearOptionIndex = field.options.findIndex(
                o => o.index === "Все"
            );
            field.value =
                selectedTab === clearOptionIndex
                    ? ""
                    : field.options[selectedTab];
            this.$emit("updateFilters");
        },
        fieldStyles(styles) {
            if (styles !== undefined) return styles[this.$mq];
        },
        toggleAccordion(e, field) {
            const parent = e.target.parentElement;
            const nextEl = e.target.nextElementSibling;
            const isOpen = parent.classList.contains("_is-open");
            const onOpenTransitionEnd = () => {
                nextEl.style.height = "auto";
                nextEl.removeEventListener(
                    "transitionend",
                    onOpenTransitionEnd
                );
            };

            if (isOpen === true) {
                nextEl.style.height = "0px";
                parent.classList.remove("_is-open");
            } else {
                nextEl.style.height = nextEl.childNodes[0].offsetHeight + "px";
                parent.classList.add("_is-open");

                nextEl.addEventListener("transitionend", onOpenTransitionEnd);
            }

            // Подгружает поля при первом открытии аккордеона
            const { code, component } = field;
            if (component === "select") this.$refs[code][0].handleOpen();
        },
        getComponent(field) {
            if (field.component === "checkbox") {
                return "checkbox";
            }
            if (field.component === "tabs") {
                return "tabs-adaptive";
            }

            return `filter-${field.component}`;
        },
        handleInput(field, value) {
            if (field.component === "checkbox") {
                this.$emit("updateFilters", {
                    value,
                    code: field.code
                });
            } else {
                this.$emit("updateFilters", value);
            }
        }
    }
};
</script>

<style src="./filter-list.less" lang="less" />
