<template>
    <div class="content">
        <h3 class="title">直播课</h3>
        <!-- <div class="title_text">
            <div> 1.图片建议宽度为750px，不同图片高度必须保持一致。</div>
            <div> 2.小程序自定义链接仅支持打开站内域名。</div>
        </div> -->
        <a-tabs :tabBarStyle="{width:'100%'}"  :tabBarGutter="0" v-model:activeKey="props.componentContent.tabPage"  @change="setCourseType">
            <a-tab-pane key="1" tab="精品课">
                <div style="padding:10px">
                <div class="item" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index" v-show="item.courseType == 1">
                    <a-button shape="circle" type="primary" class="delList" @click="delListItem(item, index)">
                        <close-outlined />
                    </a-button>
                    <div class="upload" @click="getIndex(index)">

                        <div class="input">
                            <span>内容:</span>
                            <div style="width:250px;margin-left:10px;">
                            <JSelectRelBiz v-model:value="item.title" v-if="showUpload"  @SelectedClassifyRows="getlink" :availableTabs="setTab"></JSelectRelBiz>
                            </div>
                        </div>
                        <div class="input">
                            <div>排序:</div><a-input style="width:250px;margin-left:10px;" v-model:value="item.sort"></a-input>
                        </div>
                    </div>
                </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="直播课">
                <div style="padding:10px">
                <div class="item" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index" v-show="item.courseType== 2">
                    <a-button shape="circle" type="primary" class="delList" @click="delListItem(item, index)">
                        <close-outlined />
                    </a-button>
                    <div class="upload" @click="getIndex(index)">
                        <div class="input">
                            <span>内容:</span>
                            <div style="width:250px;margin-left:10px;">
                            <JSelectRelBiz v-model:value="item.title" v-if="showUpload"  @SelectedClassifyRows="getlink" :availableTabs="setTab"></JSelectRelBiz>
                            </div>
                        </div>
                        <div class="input">
                            <div>排序:</div><a-input style="width:250px;margin-left:10px;" v-model:value="item.sort"></a-input>
                        </div>
                    </div>
                </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="线上课">
                <div style="padding:10px">
                <div class="item" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index" v-show="item.courseType== 3">
                    <a-button shape="circle" type="primary" class="delList" @click="delListItem(item, index)">
                        <close-outlined />
                    </a-button>
                    <div class="upload" @click="getIndex(index)">
                        <div class="input">
                            <span>内容:</span>
                            <div style="width:250px;margin-left:10px;">
                            <JSelectRelBiz v-model:value="item.title" v-if="showUpload"  @SelectedClassifyRows="getlink" :availableTabs="setTab"></JSelectRelBiz>
                            </div>
                        </div>
                        <div class="input">
                            <div>排序:</div><a-input style="width:250px;margin-left:10px;" v-model:value="item.sort"></a-input>
                        </div>
                    </div>
                </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="4" tab="面授课">
                <div style="padding:10px">
                <div class="item" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index" v-show="item.courseType== 4">
                    <a-button shape="circle" type="primary" class="delList" @click="delListItem(item, index)">
                        <close-outlined />
                    </a-button>
                    <div class="upload" @click="getIndex(index)">
                        <div class="input">
                            <span>内容:</span>
                            <div style="width:250px;margin-left:10px;">
                            <JSelectRelBiz v-model:value="item.title" v-if="showUpload"  @SelectedClassifyRows="getlink" :availableTabs="setTab"></JSelectRelBiz>
                            </div>
                        </div>
                        <div class="input">
                            <div>排序:</div><a-input style="width:250px;margin-left:10px;" v-model:value="item.sort"></a-input>
                        </div>
                    </div>
                </div>
                </div>
            </a-tab-pane>
        </a-tabs>

        <a-button type="primary" class="addButtonIcon" @click="addListItem">添加课程</a-button>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import JSelectRelBiz from '/@/components/Form/src/jeecg/components/JSelectRelBiz.vue';
import { CloseOutlined } from '@ant-design/icons-vue';
let props =  defineProps(['componentContent'])
let showUpload = ref(true)
let courseType = 1
let setTab = ref(['course-tab', 'class-tab'])
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
    console.log(e,'teahcer');
    
    Object.assign(props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex],e[0])
    // props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].sort = selectIndex
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].title = e[0].businessName
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].contentName = e[0].businessName
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].linkType = e[0].onclickType
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].contentUrl = e[0].id
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].courseType = props.componentContent.tabPage
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].costType = e[0].costType
    props.componentContent.websiteHtmlCustomModuleLinkVOList[selectIndex].presentPrice = e[0].businessPrice
}

function setCourseType(key){
    console.log(props.componentContent.tabPage);
    courseType = key
}
function addListItem(){
    
    props.componentContent.websiteHtmlCustomModuleLinkVOList.push({imgUrl:'',sort:0,courseType:props.componentContent.tabPage})
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
    padding: 20px;
        width: 100%;
        // height:200px;
        border: 1px solid #ccc;
        border-radius: 10px;
        position: relative;
        margin-bottom: 20px;
        padding: 0 20px;
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
