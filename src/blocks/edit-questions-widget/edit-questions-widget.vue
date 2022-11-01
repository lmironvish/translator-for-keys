<template>
    <div :class="getBemClass('edit-questions-widget', { disabled })">
        <div class="edit-questions-widget__left">
            <button-block
                class="edit-questions-widget__add-question-button"
                color="black"
                padding="50"
                @click="addQuestion()"
            >
                Добавить вопрос
            </button-block>

            <div
                v-for="(question, questionIndex) in internalValue"
                :class="getBemClass('edit-questions-widget__tile', { selected: questionIndex === selectedQuestionIndex })"
                @click="selectedQuestionIndex = questionIndex"
            >
                <div class="edit-questions-widget__tile-title">Вопрос #{{ questionIndex + 1 }}</div>
                <div class="edit-questions-widget__tile-text">{{ question.text }}</div>
                <div class="edit-questions-widget__tile-remove-button" @click="removeQuestion(questionIndex)"></div>
            </div>
        </div>
        <div v-if="selectedQuestion" class="edit-questions-widget__right">
            <div class="edit-questions-widget__right-title">Вопрос</div>
            <filter-input
                class="edit-questions-widget__question-input"
                :field="{
                    value: selectedQuestion.text,
                }"
                @input="selectedQuestion.text = $event.value"
            />

            <div class="edit-questions-widget__right-title">Ответы</div>

            <div v-for="(answer, answerIndex) in selectedQuestion.answers" class="edit-questions-widget__answer-field">
                <input class="edit-questions-widget__answer-input input" v-model="answer.text">
                <div class="edit-questions-widget__answer-input-controls">
                    <switcher-block
                        :value="answer.isCorrect"
                        @input="setCorrect(selectedQuestion, answer, $event)"
                    />
                    <div class="edit-questions-widget__answer-input-remove" @click="removeAnswer(answerIndex)"></div>
                </div>
            </div>

            <div class="edit-questions-widget__add-answer-button" @click="addAnswer()">
                Добавить ответ
            </div>
        </div>
    </div>
</template>

<script>
    import ButtonBlock from '@/blocks/button';
    import FilterInput from '@/blocks/filter-input';
    import SwitcherBlock from '@/blocks/switcher';
    import cloneDeep from 'lodash/cloneDeep';
    import Temporary from '@/pages/temporary-stub/page-temporary-stub';

    export default {
        props: {
            value: Array,
            disabled: Boolean
        },
        components: {
            Temporary,
            ButtonBlock,
            FilterInput,
            SwitcherBlock,
        },
        data: () => ({
            internalValue: null,
            selectedQuestionIndex: null,
        }),
        computed: {
            selectedQuestion() {
                return this.internalValue[this.selectedQuestionIndex];
            },
        },
        watch: {
            value: {
                immediate: true,
                deep: true,
                handler(value) {
                    this.internalValue = cloneDeep(value);
                },
            },
            internalValue: {
                deep: true,
                handler(value, oldValue) {
                    // если старое и новое разные объекты, то считаем что изменение произошло в следствии изменения входного параметра value
                    if (value === oldValue) {
                        this.$emit('input', value);
                    }
                },
            },
        },
        methods: {
            addQuestion() {
                this.internalValue.push({
                    text: '',
                    answers: [],
                });
                this.selectedQuestionIndex = this.internalValue.length - 1;
            },
            removeQuestion(index) {
                this.internalValue.splice(index, 1);
            },
            addAnswer() {
                this.selectedQuestion.answers.push({
                    text: '',
                    isCorrect: false,
                });
            },
            setCorrect(question, answer, value) {
                for (let item of question.answers) {
                    item.isCorrect = false;
                }

                answer.isCorrect = value;
            },
            removeAnswer(index) {
                this.selectedQuestion.answers.splice(index, 1);
            },
        },
    }
</script>

<style src="./edit-questions-widget.less" lang="less"/>
