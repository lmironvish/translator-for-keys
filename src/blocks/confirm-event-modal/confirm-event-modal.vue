<template>
    <div class="confirm-event-modal">
        <slide-right @close="$emit('cancel')">
            <div class="confirm-event-modal__content">
                <div class="confirm-event-modal__head">Подтвердите добавление семинара</div>

                <template v-if="event.template">
                    <div class="confirm-event-modal__label">Название</div>
                    <div class="confirm-event-modal__text">{{ event.template.index }}</div>
                </template>

                <template v-if="event.salon">
                    <div class="confirm-event-modal__label">Салон</div>
                    <div class="confirm-event-modal__text">{{ event.salon.index }}</div>
                </template>

                <template v-if="event.invitedSalons && event.invitedSalons.length > 0">
                    <div class="confirm-event-modal__label">Приглашенные салоны</div>
                    <div class="confirm-event-modal__text">
                        {{ event.invitedSalons.map(item => item.index).join(', ') }}
                    </div>
                </template>

                <template v-if="event.brand">
                    <div class="confirm-event-modal__label">Бренд</div>
                    <div class="confirm-event-modal__text">{{ event.brand.index }}</div>
                </template>

                <template v-if="event.dateBegin">
                    <div class="confirm-event-modal__label">Дата начала</div>
                    <div class="confirm-event-modal__text">{{ event.dateBegin | dateTime('DD MMMM YYYY года') }}</div>
                </template>

                <template v-if="event.teachers && event.teachers.length > 0">
                    <div class="confirm-event-modal__label">Преподаватели</div>
                    <div class="confirm-event-modal__text">
                        {{ event.teachers.map(item => item.index).join(', ') }}
                    </div>
                </template>

                <template v-if="event.maxStudents !== null && event.maxStudents !== undefined">
                    <div class="confirm-event-modal__label">Максимальное кол-во участников</div>
                    <div class="confirm-event-modal__text">{{ event.maxStudents }}</div>
                </template>

                <template v-if="event.description">
                    <div class="confirm-event-modal__label">Описание</div>
                    <div class="confirm-event-modal__text">{{ event.description }}</div>
                </template>

                <button-block
                    class="confirm-event-modal__button"
                    padding="50"
                    color="linear-black"
                    @click="$emit('cancel')"
                >Редактировать</button-block>
                <button-block
                    class="confirm-event-modal__button"
                    padding="50"
                    color="black"
                    @click="$emit('confirm')"
                >Подтвердить семинар</button-block>
            </div>
        </slide-right>
    </div>
</template>

<script>
    import SlideRight from '../slide-right';
    import ButtonBlock from '../button';

    export default {
        props: {
            event: Object,
        },
        components: {
            SlideRight,
            ButtonBlock,
        },
    }
</script>

<style src="./confirm-event-modal.less" lang="less"/>
