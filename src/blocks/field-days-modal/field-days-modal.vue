<template>
    <div class="field-days-modal">
        <slide-right @close="$emit('close')">
            <template #title>Расписание</template>

            <div class="field-days-modal__content">
                <tabs-block
                    :tabs="[{ id: 'field', text: 'Полевые' }, { id: 'admin', text: 'Административные' }]"
                    :activeTabId="activeTabId"
                    class="field-days-modal__tabs"
                    @tab-click="activeTabId = $event"
                />
                <div class="field-days-modal__month-selector">
                    <div class="field-days-modal__month-selector-arrow field-days-modal__month-selector-arrow_left" @click="prev()"></div>
                    <div class="field-days-modal__month-selector-content">
                        {{ currentMonthDate | dateTime('MMMM') | firstToUpper }},
                        <div class="field-days-modal__month-selector-year">{{ currentMonthDate | dateTime('Y') }}</div>
                    </div>
                    <div class="field-days-modal__month-selector-arrow" @click="next()"></div>
                </div>

                <full-calendar
                    locale="ru"
                    height="auto"
                    :first-day="1"
                    :plugins="calendarPlugins"
                    :default-date="currentMonthDate"
                    :fixed-week-count="false"
                    :day-render="fcDayRender"
                    :key="fcKey"
                    @dateClick="handleFcDateClick"
                    ref="fc"
                />

                <button-block
                    class="field-days-modal__button"
                    color="black"
                    padding="50"
                    :disabled="!canSave"
                    @click="save()"
                >Сохранить</button-block>
            </div>
        </slide-right>
    </div>
</template>

<script>
    import SlideRight from '../slide-right';
    import ButtonBlock from '../button';
    import TabsBlock from '../tabs';
    import FullCalendar from '@fullcalendar/vue';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import interactionPlugin from '@fullcalendar/interaction';
    import moment from 'moment';
    import api from '@/api';
    import difference from 'lodash/difference';

    const DATE_FORMAT = 'YYYY-MM-DD';

    export default {
        components: {
            FullCalendar,
            SlideRight,
            ButtonBlock,
            TabsBlock,
        },
        data: () => ({
            calendarPlugins: [dayGridPlugin, interactionPlugin],
            currentMonthDate: moment().startOf('month').format(),
            savedFieldDates: [],
            savedAdminDates: [],
            addedFieldDates: [],
            addedAdminDates: [],
            removedFieldDates: [],
            removedAdminDates: [],
            fcKey: 1000,
            isSaving: false,
            isDatesLoading: false,
            activeTabId: 'field',
        }),
        computed: {
            visibleFieldDates() {
                if (this.isDatesLoading) {
                    return [];
                }

                return difference(this.savedFieldDates, this.removedFieldDates).concat(this.addedFieldDates);
            },
            visibleAdminDates() {
                if (this.isDatesLoading) {
                    return [];
                }

                return difference(this.savedAdminDates, this.removedAdminDates).concat(this.addedAdminDates);
            },
            canSave() {
                return this.addedFieldDates.length + this.addedAdminDates.length
                    + this.removedFieldDates.length + this.removedAdminDates.length > 0;
            },
        },
        methods: {
            async updateDays() {
                this.isDatesLoading = true;
                this.rerenderFc();

                try {
                    const id = this.$store.state.user.data.id;
                    const [fieldDays, adminDays] = await Promise.all([
                        api.training.getFieldDays({
                            id,
                            beginRange: moment(this.currentMonthDate).subtract(1, 'week').format(),
                            endRange: moment(this.currentMonthDate).endOf('month').add(1, 'week').format(),
                        }),
                        api.training.getAdminDays({
                            id,
                            beginRange: moment(this.currentMonthDate).subtract(1, 'week').format(),
                            endRange: moment(this.currentMonthDate).endOf('month').add(1, 'week').format(),
                        }),
                    ]);
                    this.savedFieldDates = fieldDays.map(item => moment(item.date).format(DATE_FORMAT));
                    this.savedAdminDates = adminDays.map(item => moment(item.date).format(DATE_FORMAT));
                    this.rerenderFc();
                } catch (response) {
                    this.addActionError({ response });
                } finally {
                    this.isDatesLoading = false;
                }
            },
            async save() {
                if (!this.canSave || this.isSaving) {
                    return;
                }

                this.isSaving = true;

                try {
                    const requests = [];
                    if (this.addedFieldDates.length > 0 || this.removedFieldDates.length > 0) {
                        requests.push(api.training.setFieldDays({
                            set: this.addedFieldDates,
                            remove: this.removedFieldDates,
                        }));
                    }
                    if (this.addedAdminDates.length > 0 || this.removedAdminDates.length > 0) {
                        requests.push(api.training.setAdminDays({
                            set: this.addedAdminDates,
                            remove: this.removedAdminDates,
                        }));
                    }
                    await Promise.all(requests);
                    this.$emit('close', true);

                    this.addActionSuccess({
                        title: 'Успешно',
                        text: 'Расписание назначено'
                    });
                } catch (response) {
                    this.addActionError({ response });
                } finally {
                    this.isSaving = false;
                }
            },
            fcDayRender({ date, el }) {
                const momentDate = moment(date);
                const isFieldDay = this.visibleFieldDates.some(item => momentDate.isSame(item));
                const isAdminDay = this.visibleAdminDates.some(item => momentDate.isSame(item));

                if (isFieldDay) {
                    el.classList.add('_field');
                } else if (isAdminDay) {
                    el.classList.add('_admin');
                }
            },
            rerenderFc() {
                this.fcKey++;
            },
            handleFcDateClick({ date }) {
                const momentDate = moment(date);
                const dateString = momentDate.format(DATE_FORMAT);
                if (this.activeTabId === 'field') {
                    const isAdminDay = this.visibleAdminDates.some(item => momentDate.isSame(item));
                    if (isAdminDay) {
                        return;
                    }
                    const savedIndex = this.savedFieldDates.indexOf(dateString);
                    const addedIndex = this.addedFieldDates.indexOf(dateString);
                    const removedIndex = this.removedFieldDates.indexOf(dateString);

                    if (addedIndex !== -1) {
                        this.addedFieldDates.splice(addedIndex, 1);
                    } else if (removedIndex !== -1) {
                        this.removedFieldDates.splice(removedIndex, 1);
                    } else if (savedIndex !== -1) {
                        this.removedFieldDates.push(dateString);
                    } else {
                        this.addedFieldDates.push(dateString);
                    }
                } else if (this.activeTabId === 'admin') {
                    const isFieldDay = this.visibleFieldDates.some(item => momentDate.isSame(item));
                    if (isFieldDay) {
                        return;
                    }
                    const savedIndex = this.savedAdminDates.indexOf(dateString);
                    const addedIndex = this.addedAdminDates.indexOf(dateString);
                    const removedIndex = this.removedAdminDates.indexOf(dateString);

                    if (addedIndex !== -1) {
                        this.addedAdminDates.splice(addedIndex, 1);
                    } else if (removedIndex !== -1) {
                        this.removedAdminDates.splice(removedIndex, 1);
                    } else if (savedIndex !== -1) {
                        this.removedAdminDates.push(dateString);
                    } else {
                        this.addedAdminDates.push(dateString);
                    }
                }

                this.rerenderFc();
            },
            next() {
                this.currentMonthDate = moment(this.currentMonthDate).add(1, 'M').format();
                this.$refs.fc.getApi().next();
            },
            prev() {
                this.currentMonthDate = moment(this.currentMonthDate).subtract(1, 'M').format();
                this.$refs.fc.getApi().prev();
            },
        },
        watch: {
            currentMonthDate() {
                this.updateDays();
            }
        },
        created() {
            this.updateDays();
        },
    }
</script>

<style src="./field-days-modal.less" lang="less"/>
