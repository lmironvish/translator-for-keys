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
          label="Фамилия"
          label="Фамилий"
          label="Фамилии"
          label="Фамилию"
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
      </div>
    </form>
  </div>
</template>
