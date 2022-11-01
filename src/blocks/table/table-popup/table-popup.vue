<template>
    <div class="table-popup" v-click-outside="handleClickOutside">
        <button
            class="table-popup__button"
            type="button"
            aria-label="Ещё"
            @click.prevent.stop.stop="isOpen = !isOpen"
        />
        <div v-if="isOpen === true" class="table-popup__popup">
            <button
                v-if="hasAcceptBtn === true"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleAccept"
            >
                Подтвердить
            </button>

            <button
                v-if="hasEditBtn === true"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleEdit"
            >
                Редактировать
            </button>

            <button
                v-if="hasBlockBtn === true"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleBlock"
            >
                {{ status === "blocked" ? "Разблокировать" : "Заблокировать" }}
            </button>

            <button
                v-if="hasActivateBtn === true"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleActivate"
            >
                {{ isActive === true ? "Деактивировать" : "Активировать" }}
            </button>

            <button
                v-if="hasSalesDepartmentKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('clients')"
            >
                KPI: Регистрации клиентов
            </button>
            <button
                v-if="hasSalesDepartmentKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('sales')"
            >
                KPI: Продажи
            </button>
            <button
                v-if="hasSalesDepartmentKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('zakb')"
            >
                KPI: ЗАКБ, двери
            </button>
            <button
                v-if="hasSalesDepartmentKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('skp')"
            >
                KPI: CLUB SKP
            </button>
            <button
                v-if="hasSalesDepartmentKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('indola')"
            >
                KPI: INDOLA LOYALTY
            </button>
            <button
                v-if="hasEducationDepartmentKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('seminars')"
            >
                KPI: Семинары
            </button>
            <button
                v-if="hasEducationDepartmentKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('salons')"
            >
                KPI: Салоны
            </button>
            <button
                v-if="hasEducationDepartmentKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('contacts')"
            >
                KPI: Контакты
            </button>
            <button
                v-if="hasWebinarsKpiOptions"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleKpiSelect('webinars')"
            >
                KPI: Тренинги
            </button>
            <button
                v-if="hasManualTestingBtn === true"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleManualTesting"
            >
                Ручной тест
            </button>
            <button
                v-if="hasUncompletedRegsBtns === true"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleContact"
            >
                Связались
            </button>
            <button
                v-if="hasUncompletedRegsBtns === true"
                class="table-popup__item"
                type="button"
                @click.prevent.stop="handleSmsDisable"
            >
                Отключить смс
            </button>

            <button
                v-if="hasDeleteBtn === true"
                class="table-popup__item table-popup__item_red"
                type="button"
                @click.prevent.stop="handleDelete"
            >
                Удалить
            </button>
        </div>
    </div>
</template>

<script>
import Button from "@/blocks/button/button";

export default {
    name: "TablePopup",
    components: { Button },
    props: {
        itemId: {
            type: Number,
            default: null
        },
        hasAcceptBtn: {
            type: Boolean,
            default: true
        },
        hasEditBtn: {
            type: Boolean,
            default: true
        },
        hasDeleteBtn: {
            type: Boolean,
            default: true
        },
        hasBlockBtn: {
            type: Boolean,
            default: true
        },
        hasActivateBtn: {
            type: Boolean,
            default: true
        },
        hasSalesDepartmentKpiOptions: {
            type: Boolean,
            default: false
        },
        hasEducationDepartmentKpiOptions: {
            type: Boolean,
            default: false
        },
        hasWebinarsKpiOptions: {
            type: Boolean,
            default: false
        },
        hasManualTestingBtn: {
            type: Boolean,
            default: false
        },
        hasUncompletedRegsBtns: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        },
        status: String
    },
    data: () => ({
        isOpen: false
    }),
    methods: {
        handleClickOutside() {
            this.isOpen = false;
        },
        handleDelete() {
            this.$emit("handleDelete");
            this.isOpen = false;
        },
        handleEdit() {
            this.$emit("handleEdit");
            this.isOpen = false;
        },
        handleAccept() {
            this.$emit("handleAccept");
            this.isOpen = false;
        },
        handleActivate() {
            this.$emit("handleActivate");
            this.isOpen = false;
        },
        handleKpiSelect(eventName) {
            this.$emit("handleKpiSelect", eventName);
            this.isOpen = false;
        },
        handleBlock() {
            if (this.status === "blocked") {
                this.$emit("handleUnblock");
            } else {
                this.$emit("handleBlock");
            }
            this.isOpen = false;
        },
        handleManualTesting() {
            this.$emit("handleManualTestingBtn");
            this.isOpen = false;
        },
        handleContact() {
            this.$emit("handleContact");
            this.isOpen = false;
        },
        handleSmsDisable() {
            this.$emit("handleSmsDisable");
            this.isOpen = false;
        }
    }
};
</script>

<style src="./table-popup.less" lang="less" />
