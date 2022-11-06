<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
      <BasicForm @register="registerForm">
          <template #jAreaLinkage="{ model, field }">
            <JAreaLinkage v-model:value="model[field]" :showArea="true" :showAll="false" />
          </template>
          <template #selectProvince="{ model, field }">
            <a-select :options="provinceOptions" placeholder='请选择省份' :disabled="isDisabled"  v-model:value="model[field]" @change="selectProvince" allowClear />
          </template>
          <template #selectCity="{ model, field }">
            <a-select :options="cityOptions" placeholder='请选择城市' :disabled="isDisabled" v-model:value="model[field]" @change="selectCity" allowClear />
          </template>
          <template #selectArea="{ model, field }">
            <a-select :options="areaOptions" placeholder='请选择地区' :disabled="isDisabled" v-model:value="model[field]" @change="selectArea" allowClear />
          </template>
      </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref,reactive, onMounted} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import { JAreaLinkage } from '/@/components/Form';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {getFormSchema} from '../SystemMember.data';
    import {saveOrUpdate,updateData, listArea} from '../SystemMember.api';

    // Emits声明
    const emit = defineEmits(['register','success']);
    const isDisabled = ref(true)
    const isUpdate = ref(true);
    let provinceOptions = ref<Object[]>([])
    let cityOptions =  ref<Object[]>([])
    let areaOptions =  ref<Object[]>([])

       onMounted(async()=>{
            let res = await listArea()
            provinceOptions.value = [];
            res.forEach(element => {
                provinceOptions.value.push({value:element.areaNo, label: element.areaName}) ;
            });
        })

        function getAreaOption(areaParentno, type){
            let me = this;
          listArea({areaParentno:areaParentno}).then(function(resp){

              let items = [];
              resp.forEach(element => {
                  items.push({value:element.areaNo, label: element.areaName}) ;
              });
              if(!type){
                  cityOptions.value = items;
              }else{
                  areaOptions.value = items;
              }
           })

       }



    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate, resetSchema}] = useForm({
        labelWidth: 150,
        disabledLabelWidth:true,
        labelCol: {
            xs: {span: 24},
            sm: {span: 4},
        },

        schemas: getFormSchema(provinceOptions, cityOptions, areaOptions),
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        setModalProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
            //表单赋值
            await setFieldsValue({
                ...data.record,
            });
            getAreaOption(data.record.province,0);
            getAreaOption(data.record.city,1);
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
       isDisabled.value = !data?.showFooter
    });
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
            setModalProps({confirmLoading: true});
            if(isUpdate.value){
                //提交表单
                await updateData(values, isUpdate.value);                
            }else{
                await saveOrUpdate(values, isUpdate.value);
            }
            //关闭弹窗
            closeModal();
            //刷新列表
            emit('success');
        } finally {
            setModalProps({confirmLoading: false});
        }
    }

    function selectProvince(e){
        getAreaOption(e,0)
        setFieldsValue({city:null, area:null})
    }

    function selectCity(e){
        getAreaOption(e,1)
        setFieldsValue({ area:null})
    }

    function selectArea(e){

    }

</script>

<style lang="less" scoped>
	/** 时间和数字输入框样式 */
  :deep(.ant-input-number){
		width: 100%
	}

	:deep(.ant-calendar-picker){
		width: 100%
	}
</style>
