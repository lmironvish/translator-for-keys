<template>
    <div :class="getBemClass('event-alert', {red: isConditions})" v-on="$listeners">
        <component
            v-if="isIconVisible"
            :is="anchor ? 'router-link' : 'div'"
            :to="{name: 'dashboard.Information', hash: `#${anchor}`}"
            :class="getBemClass(
                'event-alert__icon',
                {
                          type: alert.type,
                          information: anchor && (alert.type === 'Invite' || alert.type === 'Simple')
                      })"
            :style="{backgroundColor: currentPromo ? currentPromo.color : null}"
        />
        <div :class="getBemClass('event-alert__message', {white: isConditions})">
            {{ alert.message }}
            <div
                v-if="alert.type === 'Invite'"
                class="event-alert__cancel-button"
                @click="$emit('cancel-invite')"
            >
                Отказаться
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EventAlert',
    inheritAttrs: false,
    props: {
        alert: Object,
        isConditions: Boolean,
    },
    computed: {
        currentPromo() {
            if (this.userStatus === 'new' || this.userStatus === 'onCheck') {
                return;
            }
            return this.$store.getters['user/promoList'].find(promo => promo.code === this.alert.share);
        },
        isIconVisible() {
            return this.anchor || this.alert.type === 'Share' || this.alert.type === 'Canceled' || this.alert.type === 'Authorial';
        },
        anchor() {
            if (this.alert.anchor) {
                return this.alert.anchor;
            } else if (this.currentPromo) {
                return this.currentPromo.anchor
            }
        },
        userStatus() {
            return this.$store.getters['user/status'];
        }
    }
};
</script>

<style src="./event-alert.less" lang="less"/>
