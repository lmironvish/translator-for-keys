<template>
    <ul class="test-answers-list" v-if="answers.length">
        <li
            class="test-answers-list__item"
            v-for="(q, i) in answers"
            :key="'test-question_' + i"
        >
            <p class="test-answers-list__counter">
                Вопрос {{ i + 1 }} из {{ answers.length }}
            </p>
            <p class="test-answers-list__question">{{ q.text }}</p>
            <ul class="test-answers-list__answers">
                <li
                    class="test-answers-list__answer"
                    v-for="(anw, index) in q.answers"
                    :key="`quest_${i}_anw_${index}`"
                >
                    <div
                        :class="
                            getBemClass('test-answers-list__checkbox', {
                                color: getColor(anw)
                            })
                        "
                    >
                        <div
                            :class="
                                getBemClass(
                                    'test-answers-list__checkbox-marker',
                                    { checked: anw.chosen }
                                )
                            "
                        ></div>
                        <div
                            :class="
                                getBemClass('test-answers-list__checkbox-label')
                            "
                        >
                            {{
                                anw.right ? `${anw.text} (Верный)` : anw.text
                            }}
                        </div>
                    </div>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
export default {
    name: "test-answers-list",
    props: {
        answers: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        getColor(anw) {
            if (anw.right && anw.chosen) {
                return "green";
            }
            if (!anw.right && anw.chosen) {
                return "red";
            }

            return "black";
        }
    }
};
</script>

<style src="./test-answers-list.less" lang="less" />
