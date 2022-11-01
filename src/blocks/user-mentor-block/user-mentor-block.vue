<template>
    <div class="user-mentor">
        <div
            class="user-mentor__box"
            v-for="mentor in mentors"
            :key="'mentor_' + mentor.id"
        >
            <avatar-block :image="mentor.avatar" class="user-mentor__avatar" />

            <div class="user-mentor__data-wrapper">
                <div class="user-mentor__title">{{ mentor.prettyRole }}</div>
                <div class="user-mentor__name">{{ mentor.fio }}</div>
                <a :href="`tel:+${mentor.prettyPhone}`"
                    ><div class="user-mentor__phone">
                        {{ `+${mentor.prettyPhone}` }}
                    </div></a
                >
            </div>
        </div>
    </div>
</template>

<script>
import AvatarBlock from "@/blocks/avatar/avatar";
export default {
    name: "user-mentor-block",
    components: { AvatarBlock },
    props: {
        mentors: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<style lang="less" src="./user-mentor-block.less" />
