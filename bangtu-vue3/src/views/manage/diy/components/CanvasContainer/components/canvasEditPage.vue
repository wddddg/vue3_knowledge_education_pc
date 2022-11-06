<template>
   <div class="layout hom-layout" v-loading="loading">
     <draggable
       class="dragArea list-group"
       v-model="componentsData"
       group="pageEdit"
       @change="pageChange"
       tag="div"
       :disabled ="false"
     >

    <template #header >
      <div @click="emitTitle" class="list-group-item" :class="{'on':listIndex==999}">
        <Header/>
      </div>
    </template>
    <template #item="{ element,index }">
      <div class="list-group-item"  :class="{'on':listIndex==index,'up':element.webTitle}"  @click="selectComponent(element,index)" v-show="element.type">
        <component  :is="componentMap[element.type]" :componentContent="element.componentContent"   ></component>
        <!-- <div class="no-data" >
          <i class="iconfont icon-kong"></i>
          <p>暂无数据<br>请在右边窗口编辑内容</p>
        </div> -->
        <div class="btns" :class="{'on':listIndex!=index}">
          <span @click.stop="arrowUpOut(element,index)" v-show="listIndex != 0"><ArrowUpOutlined /></span>
          <span @click.stop="arrowDownOut(element,index)" v-show="listIndex != componentsData.length-1"><ArrowDownOutlined /></span>
          <span @click="delComponent(element,index)"><DeleteFilled /></span>
        </div>
      </div>
    </template>
     </draggable>
   </div>
</template>

<script lang="ts" setup >
  import getComponentMap from './centerCanvas/componentMap';
  import Header from './centerCanvas/basicsComponent/Header.vue';
  import { ref, defineProps, watch, unref,watchEffect,inject } from 'vue';
  import draggable from 'vuedraggable';
  import { DeleteFilled ,ArrowUpOutlined,ArrowDownOutlined } from '@ant-design/icons-vue'
  import { Modal } from 'ant-design-vue';
  let props =  defineProps({
      terminal: {
        type: Number,
        default: 4
      }
  })
  const emit = defineEmits(['setToolPanel']);
  let terminal = ref(props.terminal)
  let typeId = ref(props.typeId)
  let shopId = ref(props.shopId)
  let activeComponent= ref(-1)
  let componentMap = ref(getComponentMap)
  let loading= ref(false)
  // let componentsData = ref([{
  //   isEmpty:'',
  //   type:'',
  //   componentContent:''
  // }])
  const componentsData = inject('componentsData');
  const listIndex = inject('listIndex');

  watchEffect(()=>{
    console.log(componentsData.value)
          componentsData.value.forEach((item,i)=>{
            item.webTitle = ''
          })
          componentsData.value.forEach((item,i)=>{
            if(item.type=='BannerBackground'&&componentsData?.value[i+1]){
              componentsData.value[i+1].webTitle = true
            }
          })
  })

  function emitTitle(){
    listIndex.value = 999
  }

      // 画布添加或者移动了组件
      function pageChange (e,l) {
        
        if (e.added) {
          // activeComponent = e.added.newIndex
          // e.added.element.index = e.added.newIndex
          // setActiveComponent(e.added.element)
          if(e.added.newIndex ==1&&componentsData.value[0].type == ''){
            componentsData.value.splice(0,1)
          }
          selectComponent({},e.added.newIndex)
        }
        if (e.moved) {
          // activeComponent = e.moved.newIndex
          // e.moved.element.index = e.moved.newIndex
          // setActiveComponent(e.moved.element)
          selectComponent({},e.moved.newIndex)
        }
      }
      // 选中组件
      function selectComponent (item, index) {
        
          item.index = index
          listIndex.value = index
          // setActiveComponent(item)
          // emit('setToolPanel', index)
      }
      // 向上组件
      function arrowUpOut(item, index) {
        
          [componentsData.value[index],componentsData.value[index-1]]=[componentsData.value[index-1],componentsData.value[index]]
          selectComponent({},index-1)
      }
      // 向下组件
      function arrowDownOut(item, index) {
        
          [componentsData.value[index],componentsData.value[index+1]]=[componentsData.value[index+1],componentsData.value[index]]
          selectComponent({},index+1)
      }
      // 删除组件
      function delComponent (item, index) {
          
        Modal.confirm({
          title: '确认删除',
          content: '是否删除该模块',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            componentsData.value.splice(index,1)
          },
        });
      }
      // 检查组件是否为空
      function checkIsNoData(dataList) {
        for(let i=0;i<dataList.length;i++){
          const newVal = dataList[i].componentContent
          let isEmpty = true
          let _data = ''
          switch (dataList[i].type){
            case 'banner':
              _data=newVal.bannerData
              _data.forEach(function(value ){
                if(value.bannerUrl){
                  isEmpty = false
                }
              })
              break
            case 'notice':
            case 'text':
            case 'imageTextNav':
            case 'imageText':
            case 'imageTextList':
            case 'brandList':
            case 'categoryList':
            case 'assistDiv':
              isEmpty = false
              break
            case 'productList':
              _data = newVal.productData
              if((_data.sourceType=='1' && _data.productIdList.length > 0) || (_data.sourceType=='2' && _data.categoryId != 0)){
                isEmpty = false
              }
              break
            case 'custom':
              _data=newVal.imgData
              _data.forEach(function(value ){
                if(value.src){
                  isEmpty = false
                }
              })
              break
            case 'groupList':
              if(typeId === 1){
                isEmpty = false
              }
              else {
                if(newVal.shopGroupWorkId){
                  isEmpty = false
                }
              }
              break
            case 'spikeList':
              if(newVal.shopSeckillId){
                isEmpty = false
              }
              break
            case 'discountList':
              if(newVal.discountId){
                isEmpty = false
              }
              break
            case 'priceList':
              if(newVal.priceId){
                isEmpty = false
              }
              break
            case 'vip':
              isEmpty = false
              break
            case 'coupon':
              if(newVal.selectedCoupon.length > 0){
                isEmpty = false
              }
              break
            case 'newProduct':
              _data = newVal.productData
              if((_data.sourceType=='1' && _data.productIdList.length > 0) || (_data.sourceType=='2' && _data.categoryId != 0)){
                isEmpty = false
              }
              break
            case 'shop':
              _data=newVal.imgTextData
              _data.forEach(function(value ){
                if(value.img){
                  isEmpty = false
                }
              })
              break
          }
          dataList[i].isEmpty = isEmpty
          $forceUpdate()
        }
        console.log(dataList)
      }
  
</script>

<style lang="less" scoped>
.hom-layout {
  background-color: #fff;
  ::v-deep .sortable-chosen {
    .contentBox {
      display: none;
    }
    .cloneText {
      display: block;
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      text-align: center;
      //background-color: $mainColor;
      color: #fff;
    }
  }
  .list-group {
    min-height: calc(100vh - 50px);
    margin-top: 20px;
  }
  .list-group-item {
    position: relative;
    //cursor: move;
    background-color: #fff;
    border: 1px dashed #fff;
    // min-height: 100px;
    &.item-assistDiv,&.item-notice,&.item-text{
      min-height: 0px;
    }
    // .btns {
    //   display: none;
    // }
    &:hover {

        border: 1px dashed #4589fa;

    }
    &.on {

        border: 1px solid #4589fa;

    }
    &.up {
        //border: 2px solid #000;
        transform: translateY(-10%);
        border-radius: 10px 10px 0 0;
        margin-bottom: -5%;
    }
      .btns {
        display: block;
        position: absolute;
        right: -30px;
        top: 50%;
        z-index: 9;
        transform: translateY(-50%);
        span {
          display: block;
          width: 26px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: #666;
          background-color: #fff;
          box-shadow: 0 0 2px rgba(51, 51, 51, 0.2);
          cursor: pointer;
        }
        &.on {
          display:none
        }
      }
  }
}
.no-data {
  width: 100%;
  display: flex;
  height: 300px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: #999;
  text-align: center;
  font-size: 16px;
  line-height: 1.8;
  .iconfont {
    font-size: 100px;
    //color: $mainColor;
    margin-right: 50px;
  }
}

.warp {
  width: 690px;
  margin: 0 auto;
  max-width: 100%;
  &.terminal4 {
    width: 1200px;
    max-width: 100%;
  }
}
.flex-box {
  display: flex;
}

</style>

