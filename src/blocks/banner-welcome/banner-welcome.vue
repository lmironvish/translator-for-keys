<template>
    <div class="banner-welcome">
        <div class="banner-welcome__content">
            <div class="banner-welcome__conten-wrapper">
                <div class="banner-welcome__head">
                    Доступные семинары
                </div>
                <div class="banner-welcome__text">
                    Вам доступны приветственные семинары. Если вы хотите
                    получить доступ ко всем семинарам Платформы, вашей торговой
                    точке необходимо осуществить закупку продукции.
                </div>
            </div>
            <router-link
                :to="{ name: 'dashboard.Calendar' }"
                class="banner-welcome__button"
            >
                <button-block color="linear-white" font-size="50" padding="50">
                    Посмотреть семинары
                </button-block></router-link
            >
        </div>
    </div>
</template>

<script>
import ButtonBlock from "@/blocks/button";

export default {
    components: {
        ButtonBlock
    }
};
</script>

<style src="./banner-welcome.less" lang="less" />
