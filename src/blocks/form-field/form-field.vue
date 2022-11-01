<template>
    <div class="form-field" :style="style" v-if="isRendered">
        <div v-if="label" class="form-field__label">{{ label }}</div>
        <slot/>
        <validation-errors
            v-if="validator || customErrors.length"
            class="form-field__errors"
            :validator="validator"
            :customErrors="customErrors"
        />
        <div v-if="$slots.hint" class="form-field__hint">
            <slot name="hint"/>
        </div>
    </div>
</template>

<script>
    import ValidationErrors from '../validation-errors';

    export default {
        props: {
            label: String,
            // если Number, то значение расценивается как процент с учётом отступов
            width: [String, Number],
            validator: Object,
            customErrors: {
                type: Array,
                default: () => ([]),
            },
            inline: {
                type: Boolean,
                default: false
            },
            onlyDesktop: {
                type: Boolean,
                default: false,
            },
        },
        components: {
            ValidationErrors
        },
        computed: {
            isRendered() {
                return this.onlyDesktop ? this.$mq === 'desktop' : true;
            },
            style() {
                return {
                    width: this.internalWidth,
                    marginLeft: this.horizontalMargin + 'px',
                    marginRight: this.horizontalMargin + 'px'
                };
            },
            horizontalMargin() {
                return this.inline && this.$mq === 'desktop' ? 15 : 0;
            },
            internalWidth() {
                if (this.$mq === 'desktop') {
                    if (typeof this.width === 'number') {
                        return `calc(${this.width}% - ${this.horizontalMargin * 2}px)`;
                    }

                    return this.width;
                }

                return '100%';
            }
        }
    }
</script>

<style src="./form-field.less" lang="less"/>
