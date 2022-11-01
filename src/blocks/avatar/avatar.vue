<template>
    <div
        class="avatar"
        :style="{backgroundImage: image ? createUploadUrl(image.path, true) : createStaticUrl('images/profile-placeholder.jpg', true)}"
    ></div>
</template>

<script>
export default {
    name: 'Avatar',
    inheritAttrs: false,
    props: {
        image: Object
    }
};
</script>

<style src="./avatar.less" lang="less"/>
