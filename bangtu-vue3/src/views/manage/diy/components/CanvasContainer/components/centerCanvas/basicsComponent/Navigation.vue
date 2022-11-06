<template>
    <div class="content">
        <div class="navigation">
            <div class="navigation_itme" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index" :style="{ width: 300/props.componentContent.lineCount + 'px' }" 
            v-show="index+1 <= props.componentContent.lineCount*props.componentContent.pageCount">
                <a-image :src="item.imgUrl" width="40px" height="40px" style="" :preview="false" :fallback="'/resource/img/banner_default.png'"/>
                <div style="height:30px">{{item.title}}</div>
            </div>
        </div>
        <div class="box" v-show="props.componentContent.pageCount != 999">
            <div class="box_itme" v-for="(item, index) in Math.ceil(props.componentContent.websiteHtmlCustomModuleLinkVOList.length/(props.componentContent.lineCount*props.componentContent.pageCount))"></div>
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
let props =  defineProps(['componentContent'])

</script>
<style lang="less" scoped>

.content{
    margin: 10px 10PX;
    border: 1px solid #fff;
    border-radius: 10px;
    font-size: 15px;
    .navigation{
        display: flex;
        align-items: center;
        flex-wrap:wrap;
        justify-content: space-around;
        margin: 0 20px;
        border-radius: 10px;
        margin: 10px 0;
    }
    .navigation_itme{
        text-align: center;
    }

    .box{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .box_itme{
        height: 10px;
        width: 40px;
        background: #ccc;
        margin: 10px;
    }
}


</style>