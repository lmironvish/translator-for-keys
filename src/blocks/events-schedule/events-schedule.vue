<template>
    <div class="events-schedule">
        <div v-for="day in days" class="events-schedule__item">
            <div class="events-schedule__item-head">
                {{ day.date | dateTime("dddd, D MMMM") | firstToUpper }}
            </div>

            <router-link
                v-for="event in day.events"
                :class="
                    getBemClass('events-schedule__event', { type: event.type })
                "
                :to="{
                    name: webinars ? 'dashboard.Webinar' : 'dashboard.Event',
                    params: { id: event.id }
                }"
                :key="event.id"
            >
                <div class="events-schedule__cell events-schedule__cell_time">
                    {{ event.start | dateTime("HH:mm") }} –
                    {{ event.end | dateTime("HH:mm") }}
                </div>
                <div class="events-schedule__cell events-schedule__cell_name">
                    {{ event.title }}
                </div>
                <div class="events-schedule__cell events-schedule__cell_tag">
                    <div
                        v-if="event.cancelled"
                        class="events-schedule__tag events-schedule__tag_red"
                    >
                        Отмененный
                    </div>
                    <div
                        v-else-if="event.authorial"
                        class="events-schedule__tag events-schedule__tag_emerald"
                    >
                        Авторский семинар
                    </div>
                    <div
                        v-else-if="event.share && promos[event.share]"
                        class="events-schedule__tag events-schedule__tag_emerald"
                        :style="{ backgroundColor: promos[event.share].color }"
                    >
                        {{ promos[event.share].label }}
                    </div>
                </div>
                <div
                    class="events-schedule__cell events-schedule__cell_teacher"
                >
                    {{ event.teacher }}
                </div>
                <div class="events-schedule__cell events-schedule__cell_place">
                    {{ event.place }}
                </div>
            </router-link>

            <div v-if="day.events.length === 0" class="events-schedule__empty">
                Нет событий для отображения
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { isEventContainDate } from "@/tools/event";

export default {
    props: {
        startDate: String,
        endDate: String,
        events: Array,
        webinars: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        days() {
            const current = moment(this.startDate).startOf("day");
            const endDate = moment(this.endDate).endOf("day");
            const result = [];

            while (current.isBefore(endDate)) {
                result.push({
                    date: current.format(),
                    events: this.events.filter(item =>
                        isEventContainDate(item, current)
                    )
                });
                current.add(1, "day");
            }

            return result;
        },
        promos() {
            const status = this.$store.getters["user/status"];
            const result = {};

            if (status === "new" || status === "onCheck") {
                return result;
            }

            for (const promo of this.$store.getters["user/promoList"]) {
                result[promo.code] = promo;
            }

            return result;
        }
    }
};
</script>

<style src="./events-schedule.less" lang="less" />
