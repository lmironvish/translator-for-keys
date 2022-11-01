<template>
    <router-link v-if="internalTo" class="auto-link" :to="internalTo">
        <slot/>
    </router-link>
    <span v-else>
        <slot/>
    </span>
</template>

<script>
    import { hasAccessToRoute, getUserDetailRoute } from '@/tools';

    export default {
        props: {
            to: Object,
            userId: Number,
            role: String,
        },
        computed: {
            internalTo() {
                if (this.to) {
                    return hasAccessToRoute(this.to) ? this.to : null;
                } else {
                    return getUserDetailRoute(this.userId, this.role);
                }
            },
        },
    }
</script>
