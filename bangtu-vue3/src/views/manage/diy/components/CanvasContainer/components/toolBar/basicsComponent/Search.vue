<template>
    <div class="content">
        <div class="title">Logo设置</div>
        <!-- <div class="title_input">
            <div>页面标题:</div><a-input style="width:200px;margin-left:10px;" v-model:value="props.componentContent.webTitle"></a-input>
        </div> -->
        <div class="item" v-if="props.componentContent.isLogo">
            <div class="upload">
                <JMsUpload  v-model:value="props.componentContent.webLogo" ></JMsUpload>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect,inject } from 'vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
let props =  defineProps(['componentContent'])
const listIndex = inject('listIndex');


</script>
<style lang="less" scoped>
.content{
    .title{
        margin-bottom: 30px;
        text-align: center;
        font-weight: 700;
        font-size: 18px;
    }
    .title_input{
        display: flex;
        align-items: center;
        margin-bottom: 30px;
    }
    .item{
        width: 100%;
        height:200px;
        border: 1px solid #ccc;
        border-radius: 10px;
        position: relative;
    }
    .upload{
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>