<template>
    <div
        class="table-pagination"
        v-if="pagination.pageCount > 1"
    >
        <button
            class="table-pagination__button-big  table-pagination__button-big_back"
            :disabled="pagination.current === pagination.first"
            @click="onPaginationClick('back')"
        >
            {{ $mq !== 'mobile' ? 'Назад' : '' }}
        </button>
        <div class="table-pagination__pages-holder">
            <component
                v-for="(page, pageIndex) in visiblePagination"
                :is="page !== 'more' ? 'button' : 'div'"
                :key="`${page}-${pageIndex}`"
                class="table-pagination__button"
                :class="{'active': pagination.current === page,
                         'more': page === 'more'}"
                @click="onPaginationClick(page)"
            >
                {{ page !== 'more' ? page : '...' }}
            </component>
        </div>
        <button
            class="table-pagination__button-big table-pagination__button-big_forward"
            :disabled="pagination.current === pagination.last"
            @click="onPaginationClick('forward')"
        >
            {{ $mq !== 'mobile' ? 'Вперед' : '' }}
        </button>
    </div>
</template>

<script>
export default {
    name: 'TablePagination',
    props: {
        pagination: Object
    },
    computed: {
        visiblePagination() {
            const displayedPages = this.$mq !== 'mobile' ? 5 : 1;
            let firstPageNumber = Math.max(this.pagination.current - Math.floor(displayedPages / 2), this.pagination.first);
            const lastNumber = Math.min(firstPageNumber + displayedPages, this.pagination.last + 1);
            let length = lastNumber - firstPageNumber;
            if (length < displayedPages) {
                firstPageNumber = Math.max(firstPageNumber - (displayedPages - length), this.pagination.first);
                length = lastNumber - firstPageNumber;
            }
            let paginationArray = Array.from({length}, (v, k) => k + firstPageNumber);
            if (paginationArray[0] !== this.pagination.first) {
                if (paginationArray[0] - this.pagination.first > 2) {
                    paginationArray.unshift(1, 'more');
                } else if (paginationArray[0] - this.pagination.first === 2) {
                    paginationArray.unshift(1, 2);
                } else {
                    paginationArray.unshift(1);
                }
            }
            if (this.pagination.current === this.pagination.first && this.$mq === 'mobile') { //Костыль для 433 задачи из TT: на мобилке при активности на первой странице должен быть второй пункт
                paginationArray.shift();
                paginationArray.unshift(1, 2);
            }                                                                                 //Конец костыля
            if (paginationArray[paginationArray.length - 1] !== this.pagination.last) {
                if (this.pagination.last - paginationArray[paginationArray.length - 1] > 2) {
                    paginationArray.push('more', this.pagination.last);
                } else if (this.pagination.last - paginationArray[paginationArray.length - 1] === 2) {
                    paginationArray.push(this.pagination.last - 1, this.pagination.last);
                } else {
                    paginationArray.push(this.pagination.last);
                }
            }
            return paginationArray;
        }
    },
    methods: {
        onPaginationClick(page) {
            let targetPage;
            switch (page) {
                case 'back':
                    if (this.pagination.current !== this.pagination.first) {
                        targetPage = this.pagination.current - 1;
                    }
                    break;
                case 'forward':
                    if (this.pagination.current !== this.pagination.last) {
                        targetPage = this.pagination.current + 1;
                    }
                    break;
                case 'more':
                    break;
                default:
                    if (page !== this.pagination.current) {
                        targetPage = page;
                    }
                    break;
            }
            if (targetPage) {
                this.$emit('go-to-page', targetPage);
            }
        }
    }
}
</script>

<style src="./table-pagination.less" lang="less"/>
