<template>
    <div class="canvas">
      <div class="bottomWarp">
        <div class="leftBox">
          <leftBar></leftBar>
        </div>
        <div class="mainContentWarp">
          <div class="mainContent">
            <CanvasEditPage @setToolPanel="setToolPanel"></CanvasEditPage>
          </div>
          <!-- <div class='up_and_down'>
              sdfsafsd
          </div> -->
        </div>
        <div class="RightBox">
          <toolPanel v-if="switchContent"></toolPanel>
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect,provide,inject } from 'vue';
import leftBar from './components/leftBar/panel.vue'
import CanvasEditPage from './components/CanvasEditPage.vue'
import toolPanel from './components/toolBar/toolPanel.vue'

let componentsData = ref([{
  itemText: '',
  iconClass: '',
  type: '',
  componentContent:{
            "id": null,
            "htmlCustomId": null,
            "moduleCode": "",
            "sort": 1,
            "pageCount": null,
            "lineCount": null,
            "webTitle": "",
            "webLogo": "",
            "copyright": null,
            "websiteHtmlCustomModuleLinkVOList": [{title:'', imgUrl:'',sort:0}]
        }
}])
const emit = defineEmits(['getListData']);
let listIndex = ref(0)
const setComponentsData =  inject('setComponentsData')

provide('listIndex',listIndex)
provide('componentsData',componentsData)


watch(()=>componentsData,
  ()=>{
    console.log(componentsData,'componentsData')
    emit('getListData',componentsData)
  },
  {deep:true}
)

watch(()=>setComponentsData,
  ()=>{
    console.log(setComponentsData,'setComponentsData')
    componentsData.value = JSON.parse(JSON.stringify(setComponentsData.value))
  },
  {deep:true}
)

let switchContent = ref(true)


</script>

<style lang="less" scoped>
  .canvas {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
    .bottomWarp{
      flex: 1;
      display: flex;
      height: 0;
    }
    .leftBox {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .mainContentWarp{
      background-color: #F0F3F4;
      overflow: auto;
      height: 100%;
      flex: 1;
      div:last-child {
        color: #000;
      }
      .up_and_down{
      }
      .mainContent{
        margin: 0 auto;
        max-width: 100%;
        width: 375px;
        margin-bottom: 30px;
        &.view-4{
          width: 1300px;
        }
      }
    }
    .RightBox {
      height: 100%;
      margin: 10px;
      overflow: auto;
      border-right: 1px solid #F0F3F4;
      .noChoose{
        width: 320px;
        display: flex;
        height: 100%;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        color: #999;
        text-align: center;
        font-size: 16px;
        line-height: 1.8;
        .iconfont{
          font-size: 100px;
          // color: $mainColor;
        }
      }
    }
</style>
