<template>
    <!-- <div>
        <div class="title">{{props.componentContent.inputValue}}</div>
        <div class="logo_item">
            <a-image :src="props.componentContent.websiteHtmlCustomModuleLinkVOList[0].imgUrl" width="100%" height="230px" />
        </div>
    </div> -->
    <div class="rightDisplay">
    <a-carousel arrows autoplay :dotPosition="'top'">
        <!-- <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: -24px;zIndex: 1">
        <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: -24px">
        <a-icon type="right-circle" />
        </div> -->
        <div v-for="(obj,key) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="key"  v-if="isShow">
            <div style="z-index:999; width: 100% ; height: 200px; position: absolute;"></div>
            <a-image :src="obj.imgUrl" width="100%" height="200px" :preview="false" :fallback="'/resource/img/banner_default.png'" />
        </div>
    </a-carousel>
    </div>

</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect,nextTick } from 'vue';
let props =  defineProps(['componentContent'])
let isShow = ref(true)
watch(()=>props.componentContent.websiteHtmlCustomModuleLinkVOList,
    ()=>{
      reload()
    },
    {deep:true}
)
function reload (){
  isShow.value = false
  nextTick(()=>{
    isShow.value = true
  })
}

</script>
<style lang="less" scoped>
.title{
    text-align: center;
    margin-bottom: 20px;
}
.logo_item{
    display: flex;
    align-items: center;
     margin: 0 10px;
     border-radius: 10px;
}
.rightDisplay .ant-carousel .slick-slide {
  height: 250px;
  overflow: hidden;
  background: #fff;
}
.rightDisplay .ant-carousel .slick-slide .hotBox{
  width: 30%;
  float: left;
  margin-left: 2.5%
}
.rightDisplay .ant-carousel .slick-slide .hotBox img{
  height:200px;
}
.rightDisplay .ant-carousel .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 61, 35, 0.11);
  opacity: 0.5;
}
.rightDisplay .ant-carousel .custom-slick-arrow:before {
  display: none;
}
.rightDisplay .ant-carousel .custom-slick-arrow:hover {
  opacity: 0.7;
}

</style>