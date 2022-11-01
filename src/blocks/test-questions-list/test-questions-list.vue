<template>
    <ul class="test-questions-list" v-if="questions.length">
        <li
            class="test-questions-list__item"
            v-for="(q, i) in questions"
            :key="'test-question_' + i"
        >
            <p class="test-questions-list__counter">
                Вопрос {{ i + 1 }} из {{ questions.length }}
            </p>
            <p class="test-questions-list__question">{{ q.text }}</p>
            <ul class="test-questions-list__answers">
                <li
                    class="test-questions-list__answer"
                    v-for="(anw, index) in q.answers"
                    :key="`quest_${i}_anw_${index}`"
                >
                    <checkbox
                        class="test-questions-list__checkbox"
                        :value="userAnswers[q.id] === anw.id"
                        :disabled="timeOut"
                        @input="selectCheckbox(q.id, anw.id)"
                        :key="`checkbox_${i}_anw_${index}`"
                    >
                        {{ anw.text }}
                    </checkbox>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
import Checkbox from "../checkbox/checkbox";
export default {
    name: "test-questions-list",
    components: { Checkbox },
    props: {
        questions: {
            type: Array,
            default: () => []
        },
        timeOut: Boolean
    },
    data: () => ({
        userAnswers: {}
    }),
    methods: {
        selectCheckbox(questionId, answerId) {
            this.$set(this.userAnswers, questionId, answerId);
            this.$emit("updateUserAnswers", this.userAnswers);
        }
    }
};
</script>

<style src="./test-questions-list.less" lang="less" />
