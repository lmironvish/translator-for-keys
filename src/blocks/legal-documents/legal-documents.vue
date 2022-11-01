<template>
    <ul class="legal-documents">
        <li class="legal-documents__item" v-for="item in list" :key="item.id">
            <a
                class="legal-documents__link"
                :href="
                    isCreateStaticUrl ? createStaticUrl(item.link) : item.link
                "
                :target="item.target"
                >{{ item.name }}</a
            >
        </li>
    </ul>
</template>

<script>
export default {
    name: 'LegalDocuments',
    props: {
        isCreateStaticUrl: {
            type: Boolean,
            required: false,
            default: true,
        },
        list: {
            type: Array,
            required: false,
            default: () => [
                {
                    id: 1,
                    name: 'Выходные данные',
                    link: 'documents/legal_output_data.pdf',
                    target: '_blank',
                },
                {
                    id: 2,
                    name: 'Правовые положения',
                    link: 'documents/legal_provisions.pdf',
                    target: '_blank',
                },
                {
                    id: 3,
                    name: 'Заявление о защите данных',
                    link: 'documents/legal_data_protection_statement.pdf',
                    target: '_blank',
                },
                {
                    id: 4,
                    name: 'Список файлов cookie',
                    link: 'documents/legal_cookies.pdf',
                    target: '_blank',
                },
            ],
        },
    },
};
</script>

<style src="./legal-documents.less" lang="less" />
