<template>
    <div :class="getBemClass('support', {view})">
        <div class="support__title">Служба поддержки</div>
        <a class="support__phone" href="tel:88002001398" tabindex="-1">8 800 505-20-62</a>
        <button-block
            v-if="askButton"
            class="support__ask"
            font-size="50"
            padding="50"
            :color="buttonColor"
            tabindex="-1"
            @click="$root.$emit('toggleHelp')"
        >
            Задать вопрос
        </button-block>
    </div>
</template>

<script>
import ButtonBlock from '../button';

export default {
    name: 'Support',
    components: {
        ButtonBlock
    },
    props: {
        size: String,
        view: String,
        askButton: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        buttonColor() {
            return this.view === 'black' ? 'black' : 'linear';
        },
    },
}
</script>

<style src="./support.less" lang="less"/>
