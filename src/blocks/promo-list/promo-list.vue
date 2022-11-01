<template>
    <div
        v-if="userStatus !== 'new' && userStatus !== 'onCheck'"
        v-swiper:swiper="swiperOption"
        class="promo-list"
        @mouseenter="onSlideMouseenter"
        @mouseleave="onSlideMouseleave"
    >
        <tile-list
            class="promo-list__tiles swiper-wrapper"
            :class="{ 'promo-list__tiles_disabled': isSliderDisabled }"
        >
            <div v-if="isOnlyWelcomeEvents" class="promo-list__tile-holder swiper-slide">
                <banner-welcome />
            </div>
            <template v-for="promo in promoList">
                <div
                    v-if="
                        !(
                            role === 'ROLE_MARKET' &&
                            ['club_indola', 'club_skp'].includes(promo.code)
                        )
                    "
                    class="promo-list__tile-holder swiper-slide"
                    :key="promo.code"
                >
                    <tile-block
                        :items="promo.description.split('\n')"
                        :levels="promo.levels"
                        :type="promo.type"
                        :code="promo.code || promo.data.code"
                        class="promo-list__tile"
                    >
                        <template #title>
                            <div
                                v-html="promo.title"
                                :class="getTileTitleClass(promo)"
                            ></div>
                        </template>

                        <template #top-corner>
                            <div
                                class="promo-list__indicator promo-list__indicator_type_percent"
                                :style="{ backgroundColor: promo.color }"
                            >
                                %
                            </div>
                            <router-link
                                v-if="promo.anchor"
                                class="promo-list__indicator promo-list__indicator_type_question"
                                :to="{
                                    name: 'dashboard.Information',
                                    hash: '#' + promo.anchor
                                }"
                                >?</router-link
                            >
                        </template>

                        <template
                            v-if="
                                promo.type === 'club' ||
                                    hasButton(promo) ||
                                    hasCountdown(promo)
                            "
                            #bottom
                        >
                            <div class="promo-list__bottom">
                                <button-block
                                    v-if="hasButton(promo)"
                                    padding="50"
                                    color="white"
                                    @click="
                                        $router.push({
                                            name: 'dashboard.Calendar'
                                        })
                                    "
                                >
                                    Записаться
                                </button-block>
                                <!-- TODO чтобы таймер был справа при отсутсувии кнопки -->
                                <div v-else-if="hasCountdown(promo)"></div>

                                <countdown-block
                                    v-if="hasCountdown(promo)"
                                    :date="getTimestamp(promo.data.expiredAt)"
                                />

                                <a
                                    v-if="promo.type === 'club'"
                                    class="promo-list__link"
                                    :href="createStaticUrl(promo.pdf)"
                                    target="_blank"
                                    v-html="promo.pdfText"
                                ></a>
                            </div>
                        </template>
                    </tile-block>
                </div>
            </template>
        </tile-list>
        <div
            v-if="!isSliderDisabled"
            class="promo-list__slider-pagination"
        ></div>
    </div>
</template>

<script>
import TileList from "../tile-list";
import TileBlock from "../tile";
import ButtonBlock from "@/blocks/button/button";
import CountdownBlock from "@/blocks/countdown";
import BannerOsis from "@/blocks/banner-osis";
import BannerWelcome from "@/blocks/banner-welcome";
import { directive as swiperDirective } from "vue-awesome-swiper";
import moment from "moment";

export default {
    directives: {
        swiper: swiperDirective
    },
    components: {
        ButtonBlock,
        TileList,
        TileBlock,
        CountdownBlock,
        BannerOsis,
        BannerWelcome
    },
    props: {
        buttonsAvailable: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        swiperOption: {
            pagination: {
                el: ".promo-list__slider-pagination",
                clickable: true
            },
            slidesPerView: 1,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            speed: 500
        }
    }),
    created() {
        this.$root.$on("aside-resized", this.onAsideResize);
    },
    destroyed() {
        this.$root.$off("aside-resized", this.onAsideResize);
    },
    computed: {
        promoList() {
            return this.$store.getters["user/promoList"].filter(
                item => item.visible
            );
        },
        userStatus() {
            return this.$store.getters["user/status"];
        },
        isSliderDisabled() {
            return this.promoList.length === 1;
        },
        role() {
            return this.$store.state.user.data.role;
        },
        isOnlyWelcomeEvents() {
            return this.$store.state.user.data.isOnlyWelcomeEvents;
        },
    },
    methods: {
        getTileTitleClass(promo) {
            if (promo.anchor) {
                return "tile__title_pr2";
            }
            return "tile__title_pr1";
        },
        getTileWidth(index, type) {
            // если остаётся один элемент в ряду, то растягиваем его на всю ширину
            if (
                this.promoList.length % 2 !== 0 &&
                index === this.promoList.length - 1
            ) {
                return 100;
            }

            if (type === "club") {
                return 100;
            }

            return 50;
        },
        hasButton(promo) {
            if (promo.type === "club") return false;
            return this.buttonsAvailable && promo.data.active;
        },
        hasCountdown(promo) {
            return !!promo.data.expiredAt;
        },
        getTimestamp(date) {
            return moment(date).format("x");
        },
        onSlideMouseenter() {
            this.swiper.autoplay.stop();
        },
        onSlideMouseleave() {
            this.swiper.autoplay.start();
        },
        onAsideResize() {
            if (this.swiper) {
                this.swiper.update();
            }
        }
    }
};
</script>

<style src="./promo-list.less" lang="less" />
