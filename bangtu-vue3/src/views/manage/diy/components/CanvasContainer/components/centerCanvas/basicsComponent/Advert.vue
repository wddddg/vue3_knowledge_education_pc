<template>
    <div>
        <!-- <div class="title">{{props.componentContent.inputValue}}</div> -->
        <div class="logo_item">
            <a-image :src="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].imgUrl" :preview="false" :fallback="'/resource/img/banner_default.png'" width="100%" height="150px" />
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
let props =  defineProps(['componentContent'])

</script>
<style lang="less" scoped>
.title{
    text-align: center;
    margin-bottom: 20px;
}
.logo_item{
    display: flex;
    align-items: center;
     margin: 0 20px;
     border-radius: 10px;
}

</style>