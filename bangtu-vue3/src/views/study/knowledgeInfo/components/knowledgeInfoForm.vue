<template>
  <BasicDrawer @register="registerBaseDrawer" :title="title" :isDetail="false"  width="1200" @ok="submitAll"   destroyOnClose bodyStyle="background: #f0f2f5;">
    <!-- <PageWrapper class="high-form" > -->
      <a-card title="课程信息" :bordered="false">
        <BasicForm @register="registerClass" :disabled="!isEdit"/>
      </a-card>
      <a-card title="收费信息" :bordered="false" class="!mt-5">
        <BasicForm @register="registerCharge" :disabled="!isEdit"/>
      </a-card>
      <a-card title="内容介绍" :bordered="false" class="!mt-5">
        <BasicForm @register="registerCentont" :disabled="!isEdit"/>
      </a-card>

      <!-- <template #rightFooter v-if="isEdit"> -->
      <div class="submit">
        <a-button type="primary" class="but" @click="submitAll" v-if="isEdit"> 提交 </a-button>
      </div>
        
      <!-- </template> -->
    <!-- </PageWrapper> -->
  </BasicDrawer>
</template>
<script lang="ts" name="knowledgeInfoForm" setup>
    import {ref, computed, unref,defineComponent, watchEffect} from 'vue'
    import { BasicForm, useForm } from '/@/components/Form';
    import { Card } from 'ant-design-vue';
    import { PageWrapper } from '/@/components/Page';
    import { schemasClass,schemasCharge,schemasCentont  } from './knowledgeInfoForm.data';
    import {saveOrUpdate,byId,loadTreeRoot} from '../knowledgeInfo.api';
    import {useRoute, useRouter} from 'vue-router'
    import { BasicDrawer, useDrawer, useDrawerInner } from '/src/components/Drawer';
    import { useUserStore } from '/@/store/modules/user';
    let userInfo = useUserStore().userInfo;
 // Emits声明
    const emit = defineEmits(['register','success']);
    //组件参数
    let isUpdate = ref()
    let id = ref()
    let isEdit = ref(false)
    let typeTo = ref(false)
    let threeCateId =  ref('')
    let twoCateId = ref('')
    let oneCateId =  ref('')
    let title = ref('')
    const [registerBaseDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      isUpdate.value = data.isUpdate
      id.value = data.id
      isEdit.value = data.isEdit
      typeTo.value = data.typeTo
      title.value = data.title
      console.log(data,'data')
      if(isUpdate.value){
        
        let parem = {
          id:id.value
        }
        byId(parem).then(res =>{
          let setForm = {}
          setForm = res
          setForm['teacherId_dictText'] = "teacherName";
          let param = {
            threeCateId:setForm.threeCateId,
            twoCateId:setForm.twoCateId,
            oneCateId:setForm.oneCateId,
          }
          setForm['cateName'] =param
          setClassData(setForm)
          setChargeData(setForm)
          setCentontData(setForm)
        })
      }else if(userInfo.userRoleType === 2){
        let setForms = {}
        setForms['teacherId'] = userInfo.id
        setClassData(setForms)
      }
      updateSchema([
        {
          field: 'oneCateId',
          componentProps: { treeData: rootTreeData },
        },
      ]);
    });

    watchEffect(()=>{
        console.log(isUpdate.value,'isDisabled')

    })

    // 注册
    const [registerClass,{ validate:ClassData,setFieldsValue:setClassData,updateSchema,setProps:setAddprops, } ] = useForm({
        schemas: schemasClass(threeCateId,twoCateId,oneCateId,userInfo.userRoleType),
        baseColProps: {
        span: 6,
        },
        showActionButtonGroup: false,
    });
    const [registerCharge,{ validate:ChargeData,setFieldsValue:setChargeData  } ] = useForm({
        schemas: schemasCharge,
        baseColProps: {
        span: 6,
        },
        showActionButtonGroup: false,
    });
    const [registerCentont,{ validate:CentontData,setFieldsValue:setCentontData  } ] = useForm({
        schemas: schemasCentont,
        baseColProps: {
        span: 6,
        },
        showActionButtonGroup: false,
    });
    // 树rootTreeData触发
    let rootTreeData = ref([])
    function processTreeDataItem(element){
        element.value = element.key;
        if(element.children){
            element.children.forEach(element1 => {
                processTreeDataItem(element1);
            })
        }
    }
    loadTreeRoot({ async: true, pcode: '' }).then((result) => {
        result.forEach(element => {
            processTreeDataItem(element);
        });
      rootTreeData.value = result;
    });

    // 路由参数
    // const route = useRoute()
    const router = useRouter()
    // if(route.query.isUpdate=='true'){
    //   
    //   let parem = {
    //     id:route.query.id
    //   }
    //   byId(parem).then(res =>{
    //     let setForm = {}
    //     setForm = res
    //     setClassData(setForm)
    //     setChargeData(setForm)
    //     setCentontData(setForm)
    //   })
    // }
    // let isDisabled = route.query.isEdit?true:false

    // 提交
    const submitAll = async ()=>{
      
      let classdata = await ClassData()
      let chargeData = await ChargeData()
      let centontData = await CentontData()
      classdata.threeCateId =  threeCateId.value
      classdata.twoCateId = twoCateId.value
      classdata.oneCateId =  oneCateId.value
      classdata.teacherId = classdata.teacherId
      let data = Object.assign({},classdata,chargeData,centontData)
      console.log(isEdit.value,'isEdit.value')
      if(isUpdate.value){
        saveOrUpdate(data,true).then(res => {
          emit('success')
          closeDrawer()
        })
      }else{
        saveOrUpdate(data,false).then(res => {
          emit('success')
          closeDrawer()
        })
      }

    }

</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
  .but{
    margin-left: 50%;
    transform: translate(-50%);
  }
.submit{
  position:fixed;
  background: #fff;
  width: 1200px;
  right: 0px;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  z-index: 999;
}
</style>