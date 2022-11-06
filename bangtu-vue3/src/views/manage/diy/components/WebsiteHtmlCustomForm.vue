<template>
  <BasicModal @register="registerBaseModal" :title="title" :isDetail="true" :width="1300" destroyOnClose @ok="handleSubmit" >
    <!-- <div class="title">
          <div>标题：</div><a-input placeholder="请输入标题" style="width:800px" v-model:value="pageTitle"></a-input>
    </div> -->

   <CanvasContainer @getListData = "getListData"></CanvasContainer>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, defineProps, watch, unref,watchEffect,provide } from 'vue';
  import {BasicModal, useModalInner} from '/@/components/Modal';
  import { BasicDrawer, useDrawer, useDrawerInner } from '/src/components/Drawer';
  import { useModal } from '/src/components/Modal';
  import { queryById,queryAddInit,saveOrUpdate } from '../WebsiteHtmlCustom.api';
  // import { userColumns, searchUserFormSchema, getData } from './BookUserStudy.data';
  // import { getUserRoles } from '../../user/user.api';
  import { useListPage } from '/@/hooks/system/useListPage';
  import CanvasContainer from './CanvasContainer/CanvasContainer.vue';
import { values } from 'xe-utils';


  let title = ref('')
  let id = ref('')
  let list = ref([])
  let pageTitle = ref('')
  let setComponentsData = ref([])
  let setPanelList = ref([])
  let oldPanelList = []
  let isUpdate = null
  provide('pageTitle',pageTitle)
  provide('setPanelList',setPanelList)
  provide('setComponentsData',setComponentsData)
  const emit = defineEmits(['register','success']);
  function initPanelList(res){
        oldPanelList = res.websiteHtmlModuleVOList
        setPanelList.value = res.websiteHtmlModuleVOList
        let websiteHtmlCustomModule = {
            "id": null,
            "htmlCustomId": null,
            "moduleCode": "",
            "sort": 1,
            "pageCount": null,
            "lineCount": null,
            "webTitle": "",
            "webLogo": "",
            "copyright": null,
            "websiteHtmlCustomModuleLinkVOList": [{title:'', imgUrl:'',sort:0,courseType:1}]
        }
        setPanelList.value.forEach(itme =>{
          if(itme.title == '顶部样式'){
            itme.sysDictItemVOList.forEach(element => {
              element.type = 'Search'
              // element.content = 'https://www.baidu.com/img/bd_logo1.png'
              element.componentContent =  JSON.parse(JSON.stringify(websiteHtmlCustomModule))
              
              if(element.itemValue == '1001'){
                element.componentContent.isLogo = true
                element.componentContent.isDate = true
              }
              if(element.itemValue == '1002'){
                element.componentContent.isLogo = false
                element.componentContent.isDate = false
              }
              if(element.itemValue == '1003'){
                element.componentContent.isLogo = false
                element.componentContent.isDate = true
              }
              if(element.itemValue == '1004'){
                element.componentContent.isLogo = true
                element.componentContent.isDate = false
              }
            });
          }
          if(itme.title == '基础组件'){
            itme.sysDictItemVOList.forEach(element => {
              // element.content = 'https://www.baidu.com/img/bd_logo1.png'
              element.componentContent = JSON.parse(JSON.stringify(websiteHtmlCustomModule))
              if(element.itemValue == '1005'){
                element.type = 'Banner'
              }
              if(element.itemValue == '1006'){
                element.type = 'BannerBackground'
              }
              if(element.itemValue == '1007'){
                element.type = 'Navigation'
                element.componentContent.lineCount = 4
                element.componentContent.pageCount = 999
                for(let i = 0;i<3;i++){
                  element.componentContent.websiteHtmlCustomModuleLinkVOList.push({title:'', imgUrl:'',sort:0,courseType:1})
                }
              }
              if(element.itemValue == '1008'){
                element.type = 'NavigationBanner'
                element.componentContent.lineCount = 4
                element.componentContent.pageCount = 1
                for(let i = 0;i<3;i++){
                  element.componentContent.websiteHtmlCustomModuleLinkVOList.push({title:'', imgUrl:'',sort:0,courseType:1})
                }
              }
              if(element.itemValue == '1009'){
                element.type = 'Statement'
                element.componentContent.copyright = 'XXX提供技术支持'
              }
            });
          }
          if(itme.title == '内容组件'){
            itme.sysDictItemVOList.forEach(element => {
              // element.content = 'https://www.baidu.com/img/bd_logo1.png'
              element.componentContent = JSON.parse(JSON.stringify(websiteHtmlCustomModule))
              if(element.itemValue == '1010'){
                element.type = 'Live'
              }
              if(element.itemValue == '1011'){
                element.type = 'Class'
                element.componentContent.tabPage = '1'
              }
              if(element.itemValue == '1012'){
                element.type = 'Book'
              }
              if(element.itemValue == '1013'){
                element.type = 'Data'
              }
              if(element.itemValue == '1014'){
                element.type = 'News'
              }
            });
          }
          if(itme.title == '营销组件'){
            itme.sysDictItemVOList.forEach(element => {
              // element.content = 'https://www.baidu.com/img/bd_logo1.png'
              element.componentContent = JSON.parse(JSON.stringify(websiteHtmlCustomModule))
              if(element.itemValue == '1015'){
                element.type = 'Advert'
              }
              if(element.itemValue == '1016'){
                element.type = 'Propaganda'
              }
            });
          }
        })
        

  }

  const [registerBaseModal, { setModalProps,closeModal }] = useModalInner(async (data) => {
    title.value = data.title
    isUpdate = data.isUpdate
    pageTitle.value = ''
    if(data.record){
      id = data.record.id
    }else{
      id  = ''
    }
    setModalProps({ defaultFullscreen: true });
    if(data.isUpdate){
      queryById({id:id}).then((res)=>{
        setComponentsData.value = []
        pageTitle.value = res.webTitle
        initPanelList(res)
        res.websiteHtmlCustomModuleVOList.forEach(itme=>{
          res.websiteHtmlModuleVOList.forEach(element => {
            element.sysDictItemVOList.forEach(values=>{
              if(values.itemValue==itme.moduleCode){
                let data =  JSON.parse(JSON.stringify(values))
                data.componentContent = itme
                if(data.itemValue == '1001'){
                  data.componentContent.isLogo = true
                  data.componentContent.isDate = true
                }
                if(data.itemValue == '1002'){
                  data.componentContent.isLogo = false
                  data.componentContent.isDate = false
                }
                if(data.itemValue == '1003'){
                  data.componentContent.isLogo = false
                  data.componentContent.isDate = true
                }
                if(data.itemValue == '1004'){
                  data.componentContent.isLogo = true
                  data.componentContent.isDate = false
                }
                if(data.itemValue == '1011'){
                  data.componentContent.tabPage = '1'
                }
                setComponentsData.value.push(data)
              }
            })
          });
        })
      
      })
    }else{
      queryAddInit({}).then(res=>{
        initPanelList(res)
      })
    }
  });

  function getListData(data){
    list.value = data.value
  }

  function handleSubmit(){
    let newList = []
    list.value.forEach((item,index) =>{
    
      item.componentContent.sort = index
      item.componentContent.moduleCode = item.itemValue
      newList.push(item.componentContent)
    })
    saveOrUpdate({webTitle:pageTitle.value,id:id,websiteHtmlCustomModuleVOList:newList,websiteHtmlModuleVOList:oldPanelList},isUpdate).then(res=>{
      closeModal()
      emit('success')
    })
    console.log(newList,'newList')
  }




</script>
<style lang="less" scoped>
.title{
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-bottom: 10px;
  padding-bottom: 10px;
  marin: 0 auto;
  border-bottom: 1px solid #f0f0f0;
}
</style>
