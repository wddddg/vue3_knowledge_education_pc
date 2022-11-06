<template>
    <div class="content">
        <div class="title">宣传模块</div>
        <!-- <div class="title_text">
            <div> 1.小程序自定义链接仅支持打开站内域名。</div>
        </div> -->
        <a-alert type="info" showIcon message="1.小程序自定义链接仅支持打开站内域名。" style="margin-bottom:20px">
            <!-- <template #description>
            <p> 2.小程序自定义链接仅支持打开站内域名。 </p>
            </template> -->
        </a-alert>
        <div class="input">
            <div style="width:100px">左一配置:</div>
            <div class="title_input">
                <div>第一行:</div><a-input style="width:250px;margin-left:10px;" v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneOneRows"></a-input>
            </div>
            <div class="title_input">
                <div>第二行:</div><a-input style="width:250px;margin-left:10px;" v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneTwoRows"></a-input>
            </div>
            <!-- <JMsUpload  v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneUrl"></JMsUpload> -->
            <div class="title_input">
                <span>链接:</span>
                <div style="width:250px;margin-left:24px;">
                <JSelectRelBiz v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneUrl" @SelectedClassifyRows="getLeftOneUrl" :availableTabs="setTab"></JSelectRelBiz>
                </div>      
            </div>
        </div>
        <div class="input">
            <div style="width:100px">右一配置:</div>
            <div class="title_input">
                <div>第一行:</div><a-input style="width:250px;margin-left:10px;" v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightOneOneRows"></a-input>
            </div>
            <!-- <JMsUpload  v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightOneUrl"></JMsUpload> -->
            
            <div class="title_input">
                <span>{{'链接:'}}</span>
                <div style="width:250px;margin-left:24px;">
                <JSelectRelBiz v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightOneUrl" @SelectedClassifyRows="getRightOneUrl" :availableTabs="setTab"></JSelectRelBiz>
                </div>      
            </div>
        </div>
        <div class="input">
            <div style="width:100px">右二配置:</div>
            <div class="title_input">
                <div>第一行:</div><a-input style="width:250px;margin-left:10px;" v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightTwoOneRows"></a-input>
            </div>
            <!-- <JMsUpload  v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightTwoUrl"></JMsUpload> -->
            
            <div class="title_input">
                <span>链接:</span>
                <div style="width:250px;margin-left:24px;">
                <JSelectRelBiz v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightTwoUrl" @SelectedClassifyRows="getRightTwoUrl" :availableTabs="setTab"></JSelectRelBiz>
                </div>      
            </div>
        </div>
        <!-- <div class="item">
            <div class="upload">
                <JMsUpload  v-model:value="props.componentContent.webLogo"></JMsUpload>
            </div>
        </div> -->
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect,inject } from 'vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import JSelectRelBiz from '/@/components/Form/src/jeecg/components/JSelectRelBiz.vue';

let props =  defineProps(['componentContent'])
const listIndex = inject('listIndex');
let setTab = ref(['link-tab'])
let ardde = ref('')

let selectIndex = 0
function getIndex(index){
    
    selectIndex = index
}
function getLeftOneUrl(e){
    
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].leftOneUrl = e[0].onclickUrl
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].linkType = e[0].onclickType
}
function getRightOneUrl(e){
    
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].rightOneUrl = e[0].onclickUrl
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].linkType = e[0].onclickType
}
function getRightTwoUrl(e){
    
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].rightTwoUrl = e[0].onclickUrl
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].linkType = e[0].onclickType
}


</script>
<style lang="less" scoped>
.content{
    .title{
        margin-bottom: 30px;
        text-align: center;
        font-weight: 700;
        font-size: 18px;
    }
    .input {
        border: 1px solid #ccc;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        border-radius: 10px;
        margin-bottom: 20px;
    }
    .title_input{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .title_text{
        margin-bottom: 30px;
        background: #ffff99;
        padding: 10px;
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