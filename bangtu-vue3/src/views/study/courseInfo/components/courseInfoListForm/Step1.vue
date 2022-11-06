<template>
  <div class="step1">
    <div class="step1-form">
      <a-card title="课程信息" :bordered="false">
        <BasicForm @register="registerClass" :disabled="!isEdit" />
      </a-card>
      <a-card title="联系信息" :bordered="false" class="!mt-5">
        <template #extra v-if="isEdit"><span style="color: #3a89e6; margin-right: 20px">使用默认信息</span><a-button style="color: #fff; background: #fe9b42" @click="getTeacherMsg">一键导入</a-button></template>
        <BasicForm @register="registerCharge" :disabled="!isEdit" />
      </a-card>
      <a-card title="课程介绍" :bordered="false" class="!mt-5">
        <BasicForm @register="registerCentont" :disabled="!isEdit" />
      </a-card>
    </div>
    <a-divider />
    <div class="submit">
      <a-button type="primary" class="but" @click="customSubmitFunc"> 下一步 </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, inject, watchEffect, watch, onMounted, isRef } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { step1Schemas } from './courseInfoListForm.data';
  import { Select, Input, Divider } from 'ant-design-vue';
  import { schemasClass, schemasCharge, schemasCentont } from './courseInfoListForm.data';
  import { getDict, teacherQueryById } from '../../courseInfo.api';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  const setFormData = inject('setFormData');
  const isEdit = inject('isEdit');
  const isUpdate = inject('isUpdate');
  const emit = defineEmits(['next', 'submitCourse']);
  let userInfo = useUserStore().userInfo;
  let threeCateId =  ref('')
  let twoCateId = ref('')
  let oneCateId =  ref('')
  // 注册
  const [registerClass, { validate: ClassData, setFieldsValue: setClassData, resetFields: resetClassData,getFieldsValue }] = useForm({
    fieldMapToTime: [
      // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
      // 'YYYY-MM-DD'为时间格式，参考moment
      ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss'],
    ],
    schemas: schemasClass(userInfo.userRoleType,threeCateId,twoCateId,oneCateId),
    baseColProps: {
      span: 6,
    },
    showActionButtonGroup: false,
  });
  const [registerCharge, { validate: ChargeData, setFieldsValue: setChargeData, resetFields: resetChargeData }] = useForm({
    schemas: schemasCharge,
    baseColProps: {
      span: 6,
    },
    showActionButtonGroup: false,
  });
  const [registerCentont, { validate: CentontData, setFieldsValue: setCentontData, resetFields: resetCentontData }] = useForm({
    schemas: schemasCentont,
    baseColProps: {
      span: 6,
    },
    showActionButtonGroup: false,
  });
  function resetForm() {
    resetClassData();
    resetChargeData();
    resetCentontData();
  }

  // getDict({}).then(res=>{
  //   
  // })

  onMounted(() => {
    watch(
      () => isUpdate.value,
      (o, n) => {
        resetForm();
      }
    );
    watch(
      () => setFormData.value,
      (o, n) => {
        // setFormData.value.startTime = null
        
        if(JSON.stringify(setFormData.value) == '{}'){
          setClassData(setFormData.value);
          setChargeData(setFormData.value);
          setCentontData(setFormData.value);
          return
        }
        let arr = setFormData.value.courseServerVOList;
        if (setFormData.value.courseServerVOList && typeof setFormData.value.courseServerVOList != 'string') {
          setFormData.value.courseServerVOList = arr
            .map((item, i) => {
              return item.code;
            })
            .join(',');
        }
        setFormData.value['teacherId_dictText'] = 'teacherName';
        if (typeof setFormData.value.courseTeacherVOList != 'string' && setFormData.value.courseTeacherVOList.length != 0) {
          setFormData.value.courseTeacherVOList = setFormData.value.courseTeacherVOList[0].teacherId;
          setFormData.value['courseTeacherVOList_dictText'] = 'teacherName';
          // setFormData.value.teacherName = setFormData.value.courseTeacherVOList[0].teacherName;
        }
        // setFormData.value.datetime = null
        setFormData.value['datetime'] = [
          setFormData.value.startTime ? new Date(setFormData.value.startTime) : new Date(),
          setFormData.value.endTime ? new Date(setFormData.value.endTime) : new Date(),
        ];
        let param = {
          threeCateId:setFormData.value.threeCateId,
          twoCateId:setFormData.value.twoCateId,
          oneCateId:setFormData.value.oneCateId,
        }
        setFormData.value['cateName'] = param
        setClassData(setFormData.value);
        setChargeData(setFormData.value);
        setCentontData(setFormData.value);
      }
      // {deep:true}
    );
    watchEffect(() => {
      // if(isUpdate.value){
      //   resetForm()
      // }

      console.log(setFormData, 'setFormData');
    });
  });

  //讲师选择处理
  if (userInfo.userRoleType == '2' && !isEdit.value) {
    let teacherFromData = {};
    teacherFromData.teacherId = userInfo.id;
    teacherFromData.teacherId_dictText = userInfo.realname;
    setClassData(teacherFromData);
  }
  console.log(userInfo, 'userInfo');
  async function getTeacherMsg(){
    // 
    if(userInfo.userRoleType === 2){
      teacherQueryById({id:userInfo.id}).then(res=>{
        setChargeData({
          wechatNumber:res.wechatNum,
          qqNumber:res.qqNum,
          onlineContactUrl:res.onlineUrl,
          contactPhone:res.cellphone,
          contactUrl:res.wechatUrl,
          enterpriseContactUrl:res.wechatEnterpriseUrl,
        })
      })
    }else{
      let classdata = { ...getFieldsValue() }
      if(classdata.teacherId){
        teacherQueryById({id:classdata.teacherId[0]}).then(res=>{
          setChargeData({
            wechatNumber:res.wechatNum,
            qqNumber:res.qqNum,
            onlineContactUrl:res.onlineUrl,
            contactPhone:res.cellphone,
            contactUrl:res.wechatUrl,
            enterpriseContactUrl:res.wechatEnterpriseUrl,
          })
        })
      }
    }
  }

  async function customSubmitFunc() {
    try {
      
      let classdata = await ClassData();
      console.log(classdata, 'classdata');
      let chargeData = await ChargeData();
      let centontData = await CentontData();
      classdata.threeCateId =  threeCateId.value
      classdata.twoCateId = twoCateId.value
      classdata.oneCateId =  oneCateId.value
      let courseServerList = classdata.courseServerVOList ? classdata.courseServerVOList.split(',') : [];
      classdata.courseServerVOList = courseServerList.map((item) => {
        let param = {};
        param.code = item;
        return param;
      });
      if (typeof classdata.courseTeacherVOList == 'string') {
        let param = {};
        param.teacherId = classdata.courseTeacherVOList;
        classdata.courseTeacherVOList = [];
        classdata.courseTeacherVOList.push(param);
      }
      if (classdata.courseTeacherVOList && typeof classdata.courseTeacherVOList[0] == 'string') {
        classdata.courseTeacherVOList = classdata.courseTeacherVOList.map((item) => {
          let param = {};
          param.teacherId = item;
          return param;
        });
      }
      // if(classdata.startTime&&typeof classdata.startTime != 'string'){
      //   classdata.endTime = classdata.startTime[1]
      //   classdata.startTime = classdata.startTime[0]
      // }

      let data = Object.assign({}, classdata, chargeData, centontData);
      emit('next', data);
      emit('submitCourse', data, 'step1');
    } catch (error) {}
  }
</script>
<style lang="less" scoped>
  .step1 {
    &-form {
      // width: 550px;
      margin: 0 auto;
    }

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 32px;
      color: @text-color;
    }

    h4 {
      margin: 0 0 4px;
      font-size: 14px;
      line-height: 22px;
      color: @text-color;
    }

    p {
      color: @text-color;
    }
  }
  .but {
    margin-left: 50%;
    transform: translate(-50%);
  }
  .pay-select {
    width: 20%;
  }

  .pay-input {
    width: 70%;
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
