<template>
  <div
    v-if="activeMode !== 'default'"
    class="page-training-heads page-container"
  >
    <page-header
      :header="
        activeMode === 'create'
          ? 'Создать руководителя обучения'
          : 'Редактировать руководителя обучения'
      "
    />
    <form class="page-training-regions__form" @submit.prevent="submitEdit">
      <div class="page-templates__form-fields">
        <form-field inline :width="100" v-if="webinarsShow">
          <checkbox-block v-model="fields.canCreateWebinar.value">
            Может создавать вебинары
          </checkbox-block>
        </form-field>
        <form-field
          inline
          label="Фамилия"
          :width="25"
          :validator="$v.fields.lastName.value"
          :customErrors="fields.lastName.customErrors"
        >
          <filter-input
            :field="fields.lastName"
            :has-error="
              $v.fields.lastName.value.$error ||
              hasCustomErrors(fields.lastName)
            "
            @input="fields.lastName.value = $event.value"
          />
        </form-field>
        <form-field
          inline
          label="Имя"
          :width="25"
          :validator="$v.fields.firstName.value"
          :customErrors="fields.firstName.customErrors"
        >
          <filter-input
            :field="fields.firstName"
            :has-error="
              $v.fields.firstName.value.$error ||
              hasCustomErrors(fields.firstName)
            "
            @input="fields.firstName.value = $event.value"
          />
        </form-field>
        <form-field
          inline
          label="Отчество"
          :width="25"
          :customErrors="fields.middleName.customErrors"
        >
          <filter-input
            :field="fields.middleName"
            :has-error="hasCustomErrors(fields.middleName)"
            @input="fields.middleName.value = $event.value"
          />
        </form-field>
        <form-field
          inline
          label="Телефон"
          :width="25"
          :validator="$v.fields.phone.value"
          :customErrors="fields.phone.customErrors"
        >
          <filter-input
            :field="fields.phone"
            :has-error="
              $v.fields.phone.value.$error || hasCustomErrors(fields.phone)
            "
            @input="fields.phone.value = $event.value"
          />
        </form-field>
        <form-field
          inline
          label="Email"
          :width="25"
          :validator="$v.fields.email.value"
          :customErrors="fields.email.customErrors"
        >
          <filter-input
            :field="fields.email"
            :has-error="
              $v.fields.email.value.$error || hasCustomErrors(fields.email)
            "
            @input="fields.email.value = $event.value"
          />
        </form-field>
        <form-field
          v-if="this.activeMode === 'create'"
          inline
          label="Пароль"
          :width="25"
          :validator="$v.fields.password.value"
          :customErrors="fields.password.customErrors"
        >
          <filter-input
            :field="fields.password"
            :has-error="
              $v.fields.password.value.$error ||
              hasCustomErrors(fields.password)
            "
            :isTypeToggle="true"
            :isClearable="false"
            @type-toggle="typeToggle(fields.password)"
            @input="fields.password.value = $event.value"
          />
        </form-field>
        <form-field
          inline
          label="Бренд"
          :width="25"
          :customErrors="fields.brand.customErrors"
        >
          <filter-select
            :field="fields.brand"
            :has-error="hasCustomErrors(fields.brand)"
            @input="fields.brand.value = $event.value"
          />
        </form-field>
        <form-field
          inline
          label="Аватар"
          :width="25"
          :customErrors="fields.image.customErrors"
        >
          <file-input
            :field="fields.image"
            :has-error="hasCustomErrors(fields.image)"
            @input="fields.image.value = $event.value"
          />
        </form-field>
      </div>

      <form-buttons
        :hasError="$v.$error"
        :confirmText="activeMode === 'create' ? 'Создать' : 'Изменить'"
        @back="toggleMode('default')"
      />
    </form>
  </div>
  <div v-else class="page-training-heads page-container">
    <page-header
      :header="$mq === 'mobile' ? 'РО' : 'Руководители обучения'"
      :itemCount="totalItemCount"
      :showAdd="tables[0].itemList.meta.permissions.canCreate"
      :hasActiveFilter="hasActiveFilter"
      :hasActiveSorting="hasActiveSorting"
      @clearFilters="clearOnlyFilters(0)"
      @clearSorting="clearOnlySorting(0)"
      @add="openCreate"
    />
    <sorting-block
      class="page-training-heads__sorting"
      :sortingList="tables[0].sortingList"
      @updateSorting="updateSorting($event, 0)"
      @openFilter="openFilter"
    />
    <filter-list
      class="page-training-heads__main-filter"
      :filterList="tables[0].filterList"
      @updateFilters="debouncedFetch(0)"
      @searchChange="searchChange($event, 0)"
      @clearFilters="clearFilters(0)"
    />
    <filter-modal
      :filterList="tables[0].filterList"
      @updateFilters="debouncedFetch(0)"
      @searchChange="searchChange($event, 0)"
      @clearFilters="clearFilters(0)"
    />
    <table-block
      class="page-training-heads__table"
      v-if="tables[0].itemList.items"
      :rows="tables[0].itemList.items"
      :columnsStyle="columns"
      :has-delete-btn="tables[0].itemList.meta.permissions.canRemove"
      :has-edit-btn="tables[0].itemList.meta.permissions.canEdit"
      type="business-consultant"
      rowPaddingSize="50"
      @openEdit="openEdit"
      @openConfirmDelete="openConfirmDelete"
      :routerParams="{
        name: 'dashboard.TrainingHead',
        params: ['id'],
      }"
    />
    <table-pagination
      v-if="tables[0].itemList.meta"
      :pagination="tables[0].itemList.meta.pagination"
      class="page-training-heads__table-pagination"
      @go-to-page="fetchTable($event, 0)"
    />
    <confirm-modal @confirm="confirmDelete" />
  </div>
</template>

<script>
import columns from "./data/columns"
import sorting from "./data/sorting"
import defaultEditFields from "./data/defaultEditFields"

import PageHeader from "@/blocks/page-header"
import SortingBlock from "@/blocks/sorting"
import FilterList from "@/blocks/filter-list"
import FilterModal from "@/blocks/modals/filter-modal"
import TableBlock from "@/blocks/table"
import TablePagination from "@/blocks/table/table-pagination"
import ConfirmModal from "@/blocks/modals/confirm-modal"

import FormField from "@/blocks/form-field"
import FormButtons from "@/blocks/form-buttons"
import MultipleInput from "@/blocks/multiple-input"
import FileInput from "@/blocks/file-input"
import FilterInput from "@/blocks/filter-input"
import FilterSelect from "@/blocks/filter-select"
import CheckboxBlock from "@/blocks/checkbox"

import api from "@/api"
import { mapActions } from "vuex"
import filterLogic from "@/mixins/filter-logic"
import { validationMixin } from "vuelidate"
import { passwordValidators, phone } from "@/validators"
import { email, required } from "vuelidate/lib/validators"

export default {
  metaInfo: {
    title: "Руководители обучения",
  },
  mixins: [filterLogic, validationMixin],
  components: {
    PageHeader,
    SortingBlock,
    FilterList,
    FilterModal,
    TableBlock,
    TablePagination,
    ConfirmModal,
    FormField,
    FormButtons,
    MultipleInput,
    FileInput,
    FilterInput,
    FilterSelect,
    CheckboxBlock,
  },
  data: () => ({
    columns,
    activeItemId: null,
    activeMode: "default",
    fields: {},
    tables: [
      {
        filterList: columns,
        sortingList: sorting,
        itemList: {
          items: [],
          meta: {
            pagination: {},
            permissions: {},
          },
        },
        api: api.profile.getTrainingHeadList,
      },
    ],
  }),
  validations() {
    return {
      fields: {
        phone: {
          value: { required, phone },
        },
        lastName: {
          value: { required },
        },
        firstName: {
          value: { required },
        },
        email: {
          value: { email },
        },
        password: {
          value: {
            required: this.activeMode === "create" ? required : false,
            ...passwordValidators,
          },
        },
      },
    }
  },
  computed: {
    hasActiveFilter() {
      return Object.keys(this.getFilterParams(0)).length > 0 // filter-logic.js
    },
    hasActiveSorting() {
      return Object.keys(this.getSoringParams(0)).length > 0 // filter-logic.js
    },
    totalItemCount() {
      const { totalCount } = this.tables[0].itemList.meta.pagination
      return totalCount > 0 ? totalCount : null
    },
  },
  methods: {
    async toggleMode(mode) {
      if (!mode || mode === "default")
        await this.fetchTable(this.getCurPage(0), 0) // filter-logic.js
      this.activeMode = mode ? mode : "default"
    },
    openFilter() {
      this.$modal.show("filter-modal")
    },
    openCreate() {
      this.fields = JSON.parse(JSON.stringify(defaultEditFields))
      this.toggleMode("create")
    },
    async openEdit(item) {
      let { id } = item
      const data = await api.profile.getTrainingHead({ id })
      this.fields = JSON.parse(JSON.stringify(defaultEditFields))
      Object.assign(this.fields, this.filledFields(this.fields, data)) // filter-logic.js
      this.enablePreloadedFields(this.fields)
      this.activeItemId = id
      this.toggleMode("edit")
      this.loadAllSelects(this.fields) // filter-logic.js
    },
    typeToggle(field) {
      field.type = field.type === "password" ? "text" : "password"
    },
    async submitEdit() {
      this.$v.$touch()
      if (this.$v.$error) return
      try {
        if (this.activeMode === "create") {
          await api.profile.postTrainingHead(this.getEditParams(this.fields)) // filter-logic.js
        } else if (this.activeMode === "edit") {
          await api.profile.putTrainingHead({
            id: this.activeItemId,
            params: this.getEditParams(this.fields), // filter-logic.js
          })
        }
        this.addActionSuccess({
          title: "Успешное сохранение",
          text: "Руководитель обучения сохранен",
        })
        this.toggleMode("default")
        this.$v.$reset()
      } catch (error) {
        this.fields = this.getObjWithResponseErrors(error, this.fields) // filter-logic.js
        this.addActionError({
          title: "Ошибка!",
          response: error,
        })
      }
    },
    openConfirmDelete(id) {
      this.$modal.show("confirm", { id })
    },
    async confirmDelete({ id }) {
      try {
        await api.profile.deleteTrainingHead(id)
        this.addActionSuccess({
          title: "Успешное удаление",
          text: "Руководитель обучения удален",
        })
        this.fetchTable(1, 0) // filter-logic.js
      } catch (error) {
        this.addActionError({
          title: "Ошибка!",
          response: error,
        })
      }
    },
  },
}
</script>

<style src="./page-training-heads.less" lang="less" />
