<template>
    <div class="content">
        <h3 class="title">版权信息</h3>
        <!-- <div class="title_text">
            <div> 1.版权信息无法进行排序，只能放在最底部。</div>
        </div> -->
        <a-alert type="info" showIcon message="1.版权信息无法进行排序，只能放在最底部。" style="margin-bottom:20px">
            <!-- <template #description>
            <p> 2.小程序自定义链接仅支持打开站内域名。 </p>
            </template> -->
        </a-alert>
        <div class="input">
            <div>版权信息:</div><a-input style="width:200px;margin-left:10px;" v-model:value="props.componentContent.copyright"></a-input>
        </div>
        <div class="input">
            <span>链接:</span>
            <div style="width:250px;margin-left:10px;">
            <JSelectRelBiz v-model:value="props.componentContent.copyright" v-if="showUpload"  @SelectedClassifyRows="getlink" :availableTabs="setTab"></JSelectRelBiz>
            </div>      
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import JSelectRelBiz from '/@/components/Form/src/jeecg/components/JSelectRelBiz.vue';
let props =  defineProps(['componentContent'])
let showUpload = ref(true)
let setTab = ref(['page-tab', 'link-tab' ])
let selectIndex = 0
function getlink(e){
    
    
    Object.assign(props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex],e[0])
    // props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].sort = selectIndex
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].title = e[0].businessName
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].contentName = e[0].businessName
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].linkType = e[0].onclickType
    if(e[0].onclickType == 1||e[0].onclickType == 2){
        props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].contentUrl = e[0].onclickUrl
    }else {
        props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].courseType = e[0].courseType
        props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].contentUrl = e[0].id?e[0].id:e[0].businessId
    }
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
        margin-bottom: 20px;
    }
    .upload{
        position: absolute;
        top: 20px;
        left: 50%;
        width:250px;
        transform: translateX(-50%);
    }
    .input{
        display: flex;
        align-items: center;
        margin-top: 10px;
    }
    .addButtonIcon {
      width: 80%;
      display: block;
      margin: 50px auto ;
    }
    .delList {
    position: absolute;
    top: -15px;
    right: -15px;
    transform: scale(0.6);
    } 
}
</style>