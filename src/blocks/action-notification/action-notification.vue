<template>
    <div
        class="action-notification"
        :class="`action-notification_${status}`"
    >
        <div class="action-notification__content">
            <p class="action-notification__title">{{ title }}</p>
            <p
                class="action-notification__text"
                v-html="text ? text : errorText"
            ></p>
        </div>
        <button-block
            class="action-notification__button"
            color="black"
            font-size="50"
            padding="50"
            @click="deleteActionNotification(id)"
        >
            Ок
        </button-block>
    </div>
</template>

<script>
import ButtonBlock from '../button';
import { mapActions } from 'vuex';

import { getErrorText } from '@/tools';


export default {
    name: 'ActionNotification',
    components: {
        ButtonBlock
    },
    props: {
        title: String,
        text: String,
        response: [Object, Error],
        id: Number,
        status: String
    },
    created() {
        this.timeout = setTimeout(() => {
            this.deleteActionNotification(this.id);
        }, 5000);
    },
    destroyed() {
        clearTimeout(this.timeout);
    },
    computed: {
        errorText () {
            return getErrorText(this.response);
        }
    },
    methods: {
        ...mapActions({
            deleteActionNotification: 'notifications/deleteActionNotification'
        }),
    }
}
</script>

<style src="./action-notification.less" lang="less"/>
