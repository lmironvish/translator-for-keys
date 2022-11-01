<template>
    <div class="finish-event">
        <slide-right @close="$emit('close')">
            <template v-slot:title>
                Завершить семинар
            </template>
            <template v-slot:default>
                <form
                    class="finish-event__form"
                    @submit.prevent="onSubmit"
                >
                    <form-field label="Участники">
                        <filter-select
                            :field="{
                                value: resultOptions,
                                options,
                                multiple: true,
                                resource: true
                            }"
                            @input="selectedOptions = $event.value || []"
                            @searchChange="handleSearch"
                        />
                    </form-field>
                    <form-field class="finish-event__checkbox-holder">
                        <checkbox-block v-model="isListEmpty">
                            Не было ни одного участника
                        </checkbox-block>
                    </form-field>
                    <div
                        v-if="isError"
                        class="finish-event__error"
                    >
                        Должен быть выбран хотя бы один участник или подтверждено полное отсутствие участников
                    </div>
                    <button-block
                        class="finish-event__button"
                        color="black"
                        font-size="50"
                        padding="50"
                        :is-submit="true"
                    >
                        Завершить
                    </button-block>
                </form>
            </template>
        </slide-right>
    </div>
</template>

<script>
import ButtonBlock from '../button'
import SlideRight from '../slide-right';
import FormField from '../form-field';
import FilterSelect from '../filter-select';
import CheckboxBlock from '@/blocks/checkbox';
import api from "@/api";

export default {
    name: 'FinishEvent',
    components: {
        CheckboxBlock,
        SlideRight,
        ButtonBlock,
        FormField,
        FilterSelect
    },
    props: {
        id: Number
    },
    data: () => ({
        options: [],
        selectedOptions: [],
        isListEmpty: false,
        isFirstSubmitTryHappened: false
    }),
    computed: {
        resultOptions() {
            return this.isListEmpty ? [] : this.selectedOptions;
        },
        isError() {
            return this.isFirstSubmitTryHappened && !this.isListEmpty && this.selectedOptions.length === 0
        }
    },
    methods: {
        async handleSearch({ q }) {
            this.options = await api.resource.getEventFinishOptions({ q, id: this.id });
        },
        async onSubmit() {
            if (!this.isFirstSubmitTryHappened) {
                this.isFirstSubmitTryHappened = true;
            }
            if (!this.isError) {
                try {
                    await api.training.finishEvent(this.id, {
                        stylists: this.resultOptions.map(item => item.value),
                    });
                    this.addActionSuccess({
                        title: 'Успешное завершение',
                        text: 'Семинар завершен'
                    });
                    this.$emit('event-finished');
                } catch (error) {
                    this.addActionError({
                        title: 'Ошибка!',
                        response: error
                    })
                }
            }
        }
    }
}
</script>

<style src="./finish-event.less" lang="less"/>
