<template>
  <div
      v-if="!(($route.name === 'dashboard.Event' || $route.name === 'dashboard.EventCatalog') && $mq !== 'desktop')"
      class="page-header"
  >
    <template v-if="$mq === 'desktop'">
      <div class="page-header__main">
        <h1 class="page-header__header" :data-item-count="itemCount">{{ header }}</h1>
        <button-block
            v-if="showAdd"
            class="page-header__button"
            slot="right"
            color="black"
            padding="50"
            @click="$emit('add')"
        >
          {{ addButtonText }}
        </button-block>
        <button-block
            v-if="showZoomAuth"
            class="page-header__button"
            slot="right"
            color="black"
            padding="50"
            @click="$emit('zoomAuth')"
        >
          {{ zoomAuthButtonText }}
        </button-block>
        <button-block
            v-if="showZoomLogout"
            class="page-header__button"
            slot="right"
            color="black"
            padding="50"
            @click="$emit('zoomLogout')"
        >
          {{ zoomLogoutButtonText }}
        </button-block>
        <button-block
            v-if="showReport"
            class="page-header__button"
            color="linear-black"
            padding="50"
            @click="$emit('report')"
        >
          Отчет
        </button-block>

        <slot name="middle"/>

        <button-block
            v-if="hasActiveFilter"
            class="page-header__clear"
            color="linear-black"
            padding="50"
            @click="$emit('clearFilters')"
        >
          Очистить фильтры
        </button-block>
        <button-block
            v-if="hasActiveSorting"
            class="page-header__clear"
            color="linear-black"
            padding="50"
            @click="$emit('clearSorting')"
        >
          Убрать сортировку
        </button-block>

        <slot name="right"/>
      </div>

      <div class="page-header__widget">
        <select-lang class="page-header__lang"/>
        <user-avatar class="page-header__icon page-header__icon_profile"
                     @click.native="$root.$emit('toggleProfile', true)"/>
        <div class="page-header__icon">
          <notifications-icon @click.native="$root.$emit('toggleNotificationsWidget', true)"/>
        </div>
      </div>
    </template>

    <mobile-header
        v-else
        :itemCount="itemCount"
        :header="header"
        :showAdd="showAdd"
        :back-state="backStateOnMobile"
        :has-faq-button="hasMobileFaqButton"
        @menu-open="$root.$emit('toggleMenu', true)"
        @add="$emit('add')"
        @report="$emit('report')"
    />
  </div>
</template>

<script>
import SelectLang from '@/blocks/select-lang';
import ButtonBlock from '@/blocks/button';
import NotificationsIcon from '@/blocks/notifications-icon';
import UserAvatar from '@/blocks/user-avatar';
import MobileHeader from '@/blocks/mobile-header';

export default {
  name: 'PageHeader',
  props: {
    header: {
      type: String,
      default: '',
    },
    closeState: {
      type: Boolean,
      default: false,
    },
    backStateOnMobile: {
      type: Boolean,
      default: false,
    },
    hasActiveFilter: {
      type: Boolean,
      default: false,
    },
    hasActiveSorting: {
      type: Boolean,
      default: false,
    },
    showReport: {
      type: Boolean,
      default: false,
    },
    showAdd: {
      type: Boolean,
      default: false,
    },
    addButtonText: {
      type: String,
      default: 'Добавить',
    },
    zoomAuthButtonText: {
      type: String,
      default: 'Войти через Zoom'
    },
    itemCount: {
      type: Number,
      default: null,
    },
    hasMobileFaqButton: Boolean,
    showZoomAuth: {
      type: Boolean,
      default: false
    },
    showZoomLogout: {
      type: Boolean,
      default: false
    },
    zoomLogoutButtonText: {
      type: String,
      default: 'Выйти из Zoom'
    },
  },
  components: {
    ButtonBlock,
    MobileHeader,
    UserAvatar,
    NotificationsIcon,
    SelectLang,
  },
};
</script>

<style src="./page-header.less" lang="less"/>
