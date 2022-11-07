<template>
  <div class="page-auth">
    <div class="page-auth__content">
      <select-lang class="page-auth__lang" :is-dark-theme="true" />
      <component
        :is="isLogin ? 'div' : 'router-link'"
        :to="{ name: 'auth.Login' }"
        class="page-auth__logo"
      ></component>
      <router-view class="page-auth__router" />
      <support-block class="page-auth__support" />
      <div class="page-auth__legal-documents-box">
        <button
          class="page-auth__legal-documents-button"
          :class="getClassActiveButton"
          @click="isVisibleLegalDocuments = !isVisibleLegalDocuments"
        >
          Правовые документы
        </button>
        <slide-toggle
          class="page-auth__legal-documents-button-slide-toggle"
        >
          <legal-documents
            class="page-auth__legal-documents"
            v-if="isVisibleLegalDocuments"
          />
        </slide-toggle>
      </div>
      <transition
        :name="
                    $mq === 'mobile' ? 'slide-from-bottom' : 'slide-from-right'
                "
      >
        <help-block v-if="isHelpOpen" @close="isHelpOpen = false" />
      </transition>
      <transition name="page-auth__fade">
        <div
          v-if="isHelpOpen"
          class="page-auth__blackout"
          @click="isHelpOpen = false"
        ></div>
      </transition>
    </div>
  </div>
</template>
