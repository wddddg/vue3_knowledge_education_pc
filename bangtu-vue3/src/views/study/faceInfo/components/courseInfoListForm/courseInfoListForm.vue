<template>
  <BasicDrawer @register="registerBaseDrawer" :title="title" :isDetail="false" :destroyOnClose="true" @visible-change="step1" :closeFunc="handleRedo" width="1200" bodyStyle="background: #f0f2f5;">
    <div class="step-form-form">
      <a-steps :current="current">
        <a-step title="基本信息" />
        <a-step title="授课配置" />
        <!-- <a-step title="关联课程" /> -->
      </a-steps>
    </div>
    <div class="mt-5">
      <Step1 ref="step1" @submitCourse="submitCourse" @next="handleStep1Next" v-show="current === 0" />
      <Step2 @submitCourse="submitCourse" @prev="handleStepPrev" @next="handleStep2Next" @redo="handleRedo" v-show="current === 1" v-if="initSetp2" />
      <!-- <Step3 @submitCourse="submitCourse" @next="handleStep1Next" v-show="current === 2" @redo="handleRedo" v-if="initSetp3" /> -->
    </div>
  </BasicDrawer>
</template>
<script lang="ts" name="courseInfoListForm" setup>
    import {ref, computed, unref,defineComponent, watchEffect,reactive,watch, toRefs,provide, onMounted} from 'vue'
    import { BasicForm, useForm } from '/@/components/Form';
    import { Card } from 'ant-design-vue';
    import { PageWrapper } from '/@/components/Page';
    import { schemasClass,schemasCharge,schemasCentont  } from './courseInfoListForm.data';
    import {saveOrUpdate,byId,addOrUpdatePriceConfig} from '../../courseInfo.api';
    import {useRoute, useRouter} from 'vue-router'
    import { BasicDrawer, useDrawer, useDrawerInner } from '/src/components/Drawer';
    import Step1 from './Step1.vue';
    import Step2 from './Step2.vue';
    // import Step3 from './Step3.vue';
    import { Steps } from 'ant-design-vue';
// import { watch } from 'fs';
 // Emits声明
    const emit = defineEmits(['register','success']);
    //组件参数
    const step1 = ref()
    let isUpdate = ref()
    let id = ref()
    let isEdit = ref(false)
    let typeTo = ref(false)
    let setFormData = ref({})
    provide('isUpdate',isUpdate)
    provide('isEdit',isEdit)
    provide('typeTo',typeTo)
    provide('setFormData',setFormData)
    let title = ref('')
    const [registerBaseDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      isUpdate.value = data.isUpdate
      id.value = data.id
      isEdit.value = data.isEdit
      typeTo.value = data.typeTo
      title.value = data.title
      console.log(data,'data')
      if(isUpdate.value){
        getData()
      }else{
        setFormData.value = {}
      }
    });
    //获取数据
    let oldTeacherData = []
    function getData(){
        
        let parem = {
          id:id.value
        }
        byId(parem).then(res =>{
          setFormData.value = res
          oldTeacherData = setFormData.value.courseTeacherVOList
          toRefs(setFormData)
        })
    }


      //组件操作
      const current = ref(0);

      const state = reactive({
        initSetp2: false,
        initSetp3: false,
      });

      function handleStep1Next(step1Values: any) {
        current.value++;
        state.initSetp2 = true;
        console.log(step1Values);
      }

      function handleStepPrev() {
        current.value--;
      }

      function handleStep2Next(step2Values: any) {
        current.value++;
        state.initSetp3 = true;
        console.log(step2Values);
      }

      function handleRedo() {
        current.value = 0;
        state.initSetp2 = false;
        state.initSetp3 = false;
        closeDrawer()
        return true
      }
      let {initSetp2,initSetp3} = toRefs(state)


    onMounted(()=>{

    })
    watchEffect(()=>{

    })


    // 注册
    const [registerClass,{ getFieldsValue:ClassData,setFieldsValue:setClassData } ] = useForm({
        schemas: schemasClass,
        baseColProps: {
        span: 6,
        },
        showActionButtonGroup: false,
    });
    const [registerCharge,{ getFieldsValue:ChargeData,setFieldsValue:setChargeData  } ] = useForm({
        schemas: schemasCharge,
        baseColProps: {
        span: 6,
        },
        showActionButtonGroup: false,
    });
    const [registerCentont,{ getFieldsValue:CentontData,setFieldsValue:setCentontData  } ] = useForm({
        schemas: schemasCentont,
        baseColProps: {
        span: 6,
        },
        showActionButtonGroup: false,
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
    const submitCourse = (data,step)=>{
      
      let courseServerList = setFormData.value.courseServerVOList?setFormData.value.courseServerVOList.split(','):[]
      setFormData.value.courseServerVOList = courseServerList.map(item=>{
        let param = {}
        param.code=item
        return param
      })
      if(typeof setFormData.value.courseTeacherVOList == 'string'){
        let param = {}
        param.teacherId = setFormData.value.courseTeacherVOList
        setFormData.value.courseTeacherVOList = [] 
        setFormData.value.courseTeacherVOList.push(param)
      }
      if(setFormData.value.courseTeacherVOList&&typeof setFormData.value.courseTeacherVOList[0] == 'string'){
        setFormData.value.courseTeacherVOList = setFormData.value.courseTeacherVOList.map(item=>{
          let param = {}
          param.teacherId=item
          return param
        })
      }
      if(typeof setFormData.value.courseTeacherVOList == "string"){
        setFormData.value.courseTeacherVOList = oldTeacherData 
      }
      data.courseType = 3
      let param = Object.assign({},setFormData.value,data)
      console.log(isEdit.value,'isEdit.value')
      if(!isEdit.value){
        getData()
        return 
      }
      if(step=='step1'){
        if(isUpdate.value){
          saveOrUpdate(param,true).then(res => {
            emit('success')
            getData()
            // closeDrawer()
          })
        }else{
          param.isMemberDiscount = 0
          param.isCoupon = 0
          param.isActivity = 0
          saveOrUpdate(param,false).then(res => {
            emit('success')
            id.value = res.id
            getData()
            // closeDrawer()
            isUpdate.value = true
          })
        }
      }else if(step=='step2'){
        addOrUpdatePriceConfig(param).then(res=>{
          
            emit('success')
            getData()
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
</style>