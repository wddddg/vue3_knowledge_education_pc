<template>
    <div class="content">
        <div class="title">广告位</div>
        <!-- <div class="title_input">
            <div>页面标题:</div><a-input style="width:200px;margin-left:10px;" v-model:value="props.componentContent.webTitle"></a-input>
        </div> -->
        <div class="item">
            <div class="upload">
                <div class="input">
                    <span>图片:</span>
                    <div style="width:250px;margin-left:10px;">
                    <JMsUpload  v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].imgUrl" ></JMsUpload>
                    </div>
                </div>
                
                <div class="input">
                    <span>内容:</span>
                    <div style="width:250px;margin-left:10px;">
                    <JSelectRelBiz v-model:value="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].title"  @SelectedClassifyRows="getlink" :availableTabs="setTab"></JSelectRelBiz>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect,inject } from 'vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import JSelectRelBiz from '/@/components/Form/src/jeecg/components/JSelectRelBiz.vue';
let props =  defineProps(['componentContent'])
const listIndex = inject('listIndex');
let selectIndex = 0
let setTab = ref(['page-tab', 'link-tab', 'course-tab', 'class-tab', 'exam-tab', 'book-tab', 'goods-tab', 'article-tab'])
function getIndex(index){
    
    selectIndex = index
}
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
        // margin-bottom: 30px;
        text-align: center;
        font-weight: 700;
        font-size: 18px;
    }
    .title_input{
        display: flex;
        align-items: center;
        margin-top: 10px;
    }
    .item{
        width: 100%;
        // height:200px;
        border: 1px solid #ccc;
        border-radius: 10px;
        position: relative;
    }
    .upload{
        // position: absolute;
        // top: 20px;
        // left: 50%;
        // transform: translateX(-50%);
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding-bottom: 10px;
    }
    .input{
        display: flex;
        align-items: center;
        margin-top: 10px;
    }
}
</style>