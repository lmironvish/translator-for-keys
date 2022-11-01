<template>
    <button
        :type="isSubmit ? 'submit' : 'button'"
        :class="getBemClass('button', {color, fontSize, icon, padding, borderColor})"
        :style="{fontWeight}"
        :disabled="disabled"
        v-on="$listeners"
    >
        <slot/>
        <div
            v-if="icon"
            class="button__icon"
            :class="`button__icon_${icon}`"
        ></div>
        <div
            v-if="additionalIcon"
            class="button__additional-icon"
            :class="`button__additional-icon_${additionalIcon}`"
        ></div>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        color: String,
        fontSize: String,
        icon: String,
        padding: String,
        fontWeight: String,
        borderColor: String,
        additionalIcon: String,
        isSubmit: Boolean,
        disabled: Boolean
    }
}
</script>

<style src="./button.less" lang="less"/>
