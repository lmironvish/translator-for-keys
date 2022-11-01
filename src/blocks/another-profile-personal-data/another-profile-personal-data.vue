<template>
    <div class="another-profile-personal-data">
        <template v-for="item in items">
            <div
                v-if="item.values.length > 0"
                class="another-profile-personal-data__item"
            >
                <p class="another-profile-personal-data__item-label">{{ item.label }}</p>
                <div class="another-profile-personal-data__item-value-holder">
                    <template v-for="value in item.values">
                        <router-link
                            class="another-profile-personal-data__item-value another-profile-personal-data__item-value_link"
                            v-if="value.route"
                            :to="value.route"
                        >
                            <span v-html="value.name">{{ value.name }}</span>
                        </router-link>
                        <p
                            v-else
                            class="another-profile-personal-data__item-value"
                            v-html="value.name"
                        ></p>
                    </template>

                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'AnotherProfilePersonalData',
    inheritAttrs: false,
    props: {
        items: Array
    }
};
</script>

<style src="./another-profile-personal-data.less" lang="less"/>
