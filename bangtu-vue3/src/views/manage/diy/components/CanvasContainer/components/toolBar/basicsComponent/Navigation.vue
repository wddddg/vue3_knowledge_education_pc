<template>
    <div class="content">
        <h3 class="title">轮播icon导航</h3>
        <!-- <div class="title_text">
            <div> 1.图片大小系统进行统一限制。</div>
            <div> 2.小程序自定义链接仅支持打开站内域名。</div>
        </div> -->
        <a-alert type="info" showIcon message="1.图片大小系统进行统一限制。"  style="margin-bottom:20px">
            <template #description>
            <div style="font-size: 16px ;"> 2.小程序自定义链接仅支持打开站内域名。 </div>
            </template>
        </a-alert>
        <div>
            <div class="input" style="margin-bottom:10px">
                <div style="margin-right:10px">每行显示数量:</div>
                <a-radio-group v-model:value="props.componentContent.lineCount">
                    <a-radio :value="1">1</a-radio>
                    <a-radio :value="2">2</a-radio>
                    <a-radio :value="3">3</a-radio>
                    <a-radio :value="4">4</a-radio>
                    <a-radio :value="5">5</a-radio>
                </a-radio-group>
            </div>

            <div class="input" style="margin-bottom:10px" v-show="props.componentContent.pageCount != 999">
                <div style="margin-right:10px">每页显示行数:</div>
                <a-radio-group v-model:value="props.componentContent.pageCount">
                    <a-radio :value="1">1</a-radio>
                    <a-radio :value="2">2</a-radio>
                    <a-radio :value="3">3</a-radio>
                    <a-radio :value="4">4</a-radio>
                    <a-radio :value="5">5</a-radio>
                </a-radio-group>
            </div>
        </div>
        <div class="item" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index">
            <a-button shape="circle" type="primary" class="delList" @click="delListItem(item, index)">
                <close-outlined />
            </a-button>
            <div class="upload" @click="getIndex(index)">
                <div class="input">
                    <span>图片:</span>
                    <div style="width:250px;margin-left:10px;">
                    <JMsUpload v-model:value="item.imgUrl" v-if="showUpload"></JMsUpload>
                    </div>
                </div>
                <div class="input">
                    <div>标题:</div><a-input style="width:250px;margin-left:10px;" v-model:value="item.title" ></a-input>
                </div>
                <div class="input">
                    <span>链接:</span>
                    <div style="width:250px;margin-left:10px;">
                    <JSelectRelBiz v-model:value="item.contentName" v-if="showUpload"  @SelectedClassifyRows="getlink" :availableTabs="setTab"></JSelectRelBiz>
                    </div>
                </div>
                <!-- <div class="input">
                    <div>标题:</div><a-input style="width:200px;margin-left:10px;" v-model:value="item.title"></a-input>
                </div> -->
                <div class="input">
                    <div>排序:</div><a-input style="width:250px;margin-left:10px;" v-model:value="item.sort" ></a-input>
                </div>
            </div>
        </div>
        <a-button type="primary" class="addButtonIcon" @click="addListItem">添加导航</a-button>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import JSelectRelBiz from '/@/components/Form/src/jeecg/components/JSelectRelBiz.vue';
import { CloseOutlined } from '@ant-design/icons-vue';
let props =  defineProps(['componentContent'])
let showUpload = ref(true)
let setTab = ref(['page-tab', 'link-tab' ])
watch(()=>props.componentContent.websiteHtmlCustomModuleLinkVOList,
    ()=>{
        // showUpload.value = !showUpload.value
        // setTimeout(()=>{
        //     showUpload.value = !showUpload.value
        // },0)
        // console.log(props.componentContent,'componentContent')
    },
    {deep:true}
)
let selectIndex = 0
function getIndex(index){
    
    selectIndex = index
}
function getlink(e){
    
    
    Object.assign(props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex],e[0])
    // props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].sort = selectIndex
    // props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].title = e[0].businessName
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].contentName = e[0].businessName
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].linkType = e[0].onclickType
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].contentUrl = e[0].onclickUrl
}
function addListItem(){
    props.componentContent.websiteHtmlCustomModuleLinkVOList.push({imgUrl:'',sort:0})
}
function delListItem(item,index){
    if(props.componentContent.websiteHtmlCustomModuleLinkVOList.length==1){return}
    props.componentContent.websiteHtmlCustomModuleLinkVOList.splice(index,1)
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
        // height:250px;
        border: 1px solid #ccc;
        border-radius: 10px;
        position: relative;
        margin-bottom: 20px;
    }
    .upload{
        // position: absolute;
        // top: 20px;
        // left: 50%;
        // width:250px;
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