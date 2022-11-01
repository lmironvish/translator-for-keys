<template>
    <div
        class="aside"
        :class="{'aside_collapsed': isAsideCollapsed && $mq === 'desktop'}"
        @transitionend="$root.$emit('aside-resized')"
    >
        <div class="aside__head">
            <div
                class="aside__head-scroll"
                :style="{right: `-${scrollbarWidth}px`}"
            >
                <div
                    v-if="$mq === 'desktop'"
                    class="aside__toggle"
                    @click="emitToggleAsideCollapse"
                ></div>
                <router-link :to="{name: 'dashboard.Main'}" class="aside__logo" tabindex="-1"/>
                <mobile-header
                    v-if="$mq === 'mobile'"
                    :closeState="true"
                    @menu-close="$emit('menu-close')"
                />
                <nav class="aside__nav">
                    <template v-for="item in nav">
                        <component
                            :is="item.route ? 'router-link' : 'div'"
                            :to="item.route"
                            v-if="isItemVisible(item)"
                            :class="getBemClass('aside__nav-item', {sub: Boolean(item.subnav), opened: item.opened})"
                            tabindex="-1"
                            @click="handleClick(item)"
                        >
                           <span v-if="item.langKey && typeof item.langKey === 'function' && item.langKey()">{{  $t(`global.${item.langKey()}`)  }}<notifications-indicator v-if="item.id === 'notifications'" class="aside__notifications-indicator"/></span>
                           <span v-else-if="item.langKey">{{  $t(`global.${item.langKey}`)  }}<notifications-indicator v-if="item.id === 'notifications'" class="aside__notifications-indicator"/></span>
                           <span v-else>{{ typeof item.name === 'function' ? item.name() : item.name}} <notifications-indicator v-if="item.id === 'notifications'" class="aside__notifications-indicator"/></span>
                        </component>
                        <div
                            v-if="item.subnav"
                            class="aside__sub-nav-holder"
                            ref="subnavHolder"
                        >
                            <div
                                class="aside__sub-nav"
                                ref="subnav"
                            >
                                <template
                                    v-for="subitem in item.subnav"
                                >
                                    <component
                                        v-if="hasAccessToRoute(subitem.route)"
                                        :to="subitem.route"
                                        :is="subitem.route ? 'router-link' : 'div'"
                                        class="aside__sub-nav-item"
                                        tabindex="-1"
                                        @click="handleClick(subitem)"
                                    >{{ subitem.langKey ? $t(`global.${subitem.langKey}`) : subitem.name }}</component>
                                </template>
                            </div>
                        </div>
                    </template>
                </nav>
            </div>
        </div>
        <div class="aside__bottom">
            <support-block class="aside__bottom-content" />
        </div>
        <div
            class="aside__stub"
            :class="{'aside__stub_opened': isAsideCollapsed && $mq === 'desktop'}"
        >
            <div
                class="aside__toggle aside__toggle_stub"
                @click="emitToggleAsideCollapse"
            ></div>
        </div>
    </div>
</template>

<script>
import SupportBlock from '../support';
import NotificationsIndicator from '../notifications-indicator';
import MobileHeader from '../mobile-header';

import { mapState, mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';

import navData from '@/data/nav';

import { hasAccessToRoute } from '@/tools';

export default {
    name: 'Aside',
    components: {
        MobileHeader,
        NotificationsIndicator,
        SupportBlock
    },
    props: {
        isAsideCollapsed: Boolean
    },
    data: () => ({
        isUsersOpened: false,
        isSalesTeamOpened: false,
        isTrainingTeamOpened: false,
        isSettingsOpened: false,
        nav: null
    }),
    created() {
        const nav = cloneDeep(navData);

        //TODO: Удалить когда выкатим вебинары
        if (!this.webinarsShow) {
            const find = nav.findIndex(n => n.name === 'Вебинары')
            nav.splice(find, 1)
            const settingsIndex = nav.findIndex(n => n.name === 'Настройки')
            const deleteFromSettings = nav[settingsIndex].subnav.reduce(function(a, e, i) {
                if (e.name === 'Шаблоны вебинаров' || e.name === 'Тесты')
                    a.push(i);
                return a;
            }, []);
            deleteFromSettings.sort((a,b) => b-a).forEach(i => {
                nav[settingsIndex].subnav.splice(i, 1)})
        }
        //TODO: Закончить удаление здесь

        const findVideoIndex = nav.findIndex(n => n.name === "Видео");
        !this.isInnerRole
            ? delete nav[findVideoIndex].subnav
            : delete nav[findVideoIndex].route;

        this.nav = nav.map(item => ({...item, opened: false}));
        this.subnavList = this.nav.filter(item => item.subnav);
    },
    mounted() {
        this.openInitNavItem();
    },
    computed: {
        ...mapState({
            scrollbarWidth: state => state.global.scrollbarWidth,
        }),
        ...mapGetters({
            permissions: 'user/permissions'
        }),
        categoryVideo() {
            return this.$store.state.resource.categoryVideo;
        },
        isInnerRole() {
            return this.$store.getters['user/isInnerRole']
        },
    },
    watch: {
        categoryVideo: {
            handler(newValue, oldValue) {
                if(newValue !== oldValue) {

                    this.$nextTick(() => {
                        if (!this.isInnerRole) return;

                        const findVideoIndex = this.nav.findIndex(n => n.name === "Видео");
                        const findIntegrationIndex = this.nav[findVideoIndex].subnav.findIndex(subnav => subnav.name === 'Интеграция');
                        const findCategory = newValue.find(category => category.isIntegration);

                        this.nav[findVideoIndex].subnav[findIntegrationIndex].route.params = { category: findCategory ? findCategory.value : {} };
                    });
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        toggleItem(item) {
            const index = this.subnavList.indexOf(item);
            if (item.opened) {
                this.$refs.subnavHolder[index].style.height = this.$refs.subnav[index].offsetHeight + 'px';
                setTimeout(() => {
                    this.$refs.subnavHolder[index].style.height = '0px';
                }, 30);
            } else {
                this.$refs.subnavHolder[index].style.height = this.$refs.subnav[index].offsetHeight + 'px';
                setTimeout(() => {
                    this.$refs.subnavHolder[index].style.height = 'auto';
                }, 300);
            }
            item.opened = !item.opened;
        },
        openInitNavItem() {
            this.subnavList.forEach((item) => {
                item.subnav.forEach((subitem) => {
                    if (subitem.route.name === this.$route.name) {
                        this.toggleItem(item);
                    }
                })
            });
        },
        handleClick(item) {
            if (item.onClick) {
                item.onClick.call(this);
            } else if (item.route) {
                this.$router.push(item.route);
            } else if (item.subnav) {
                this.toggleItem(item);
            }
        },
        isItemVisible(item) {
            let result = true;
            if (item.route && !this.hasAccessToRoute(item.route)) {
                result = false;
            }
            if (item.hiddenOn && item.hiddenOn.includes(this.$mq)) {
                result = false;
            }
            if (item.subnav) {
                result = item.subnav.some(subitem => this.hasAccessToRoute(subitem.route));
            }
            return result;
        },
        emitToggleAsideCollapse() {
            this.$emit('toggle-aside-collapse')
            this.$store.commit(
                    "global/setIsOpenAside"
                );
        },
        hasAccessToRoute
    }
}
</script>

<style src="./aside.less" lang="less"/>
