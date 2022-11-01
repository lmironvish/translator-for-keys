<template>
    <div :class="['select-item-with-image', {'select-item-with-image--dark-theme': isDarkTheme}]">
        <multiselect
            class="select-item-with-image__select"
            :value="selectedValue"
            :options="options"
            :allow-empty="false"
            :hideSelected="true"
            :show-labels="false"
            :placeholder="selectedValue.name"
            :searchable="false"
            track-by="value"
            label="name"
            @select="handleSelect($event)"
        >
            <template slot="singleLabel" slot-scope="props"
                ><img
                    class="select-item-with-image__image"
                    :src="createStaticUrl(props.option.image)"
                    :alt="props.option.name"
                /><span class="select-item-with-image__desc"
                    ><span class="select-item-with-image__title">{{
                        props.option.name
                    }}</span></span
                ></template
            >
            <template slot="option" slot-scope="props"
                ><img
                    class="select-item-with-image__image"
                    :src="createStaticUrl(props.option.image)"
                    :alt="props.option.name"
                />
                <div class="select-item-with-image__desc">
                    <span class="select-item-with-image__title">{{
                        props.option.name
                    }}</span>
                </div>
            </template>
        </multiselect>
    </div>
</template>

<script>
export default {
    name: 'SelectItemWithImage',
    props: {
        selectedValue: {
            type: Object,
            required: false,
            default: () => {},
        },

        options: {
            type: Array,
            required: false,
            default: () => [],
        },
        isDarkTheme: {
            type: Boolean,
            required: false,
            default: false,
        }
    },

    methods: {
        handleSelect(evt) {
            this.$emit('onSelect', evt);
        },

        setDefaultValue() {
            this.selectValue = this.defaultValue;
        },
    },

    mounted() {
        this.setDefaultValue();
    },
};
</script>

<style src="./select-item-with-image.less" lang="less" />
