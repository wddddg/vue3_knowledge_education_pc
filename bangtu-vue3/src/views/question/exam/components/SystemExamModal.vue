<template>
  <BasicDrawer v-bind="$attrs" @register="registerModal" :closeFunc="closeFunc" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <a-steps :current="current" style="margin-bottom:50px">
      <a-step title="基础信息" />
      <a-step title="试题详情" />
    </a-steps>
            <div v-show="current == 0">
                <BasicForm @register="registerForm" />
            </div>
            <div v-if="current == 1">
                <BasicTable
                    :columns="columns"
                    v-bind="config"
                    :formConfig="formConfig"
                    :api="querySystemExamListByMainId"
                    :searchInfo="searchInfo"
                    :rowSelection="{ type: 'checkbox' }"
                    @register="registerTable"
                    @selection-change="selectionChange"
                >
                <template #tableTitle>
                    <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
                    <a-dropdown v-if="selectedRowKeys.length > 0">
                        <template #overlay>
                            <a-menu>
                            <a-menu-item key="1" @click="batchHandleDelete">
                                <Icon icon="ant-design:delete-outlined"></Icon>
                                删除
                            </a-menu-item>
                            </a-menu>
                        </template>
                        <a-button>批量操作
                            <Icon icon="mdi:chevron-down"></Icon>
                        </a-button>
                    </a-dropdown>
                </template>
                </BasicTable>
            </div>
    <div class="submit">
        <a-button type="primary" class="but" @click="handleSubmit" v-if="isEdit"> 提交 </a-button>
        <a-button type="primary" class="but" @click="handleDown" v-show="current == 0&&!tabDisabled"> 下一步 </a-button>
        <a-button type="primary" class="but" @click="handleOn" v-show="current == 1"> 上一步 </a-button>
    </div>
  </BasicDrawer>
    <AddListDetailModal @register="registerDrawer" @success="handleSuccess"></AddListDetailModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref,h} from 'vue';
    import {BasicDrawer, useDrawerInner,useDrawer} from '/@/components/Drawer';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {formSchema} from '../SystemExam.data';
    import {saveOrUpdate,querySystemExamListByMainId,systemExamListDeleteBatch,queryById} from '../SystemExam.api';
    // import {BasicTable} from '/@/components/Table/src/BasicTable.vue'
    import {BasicTable, useTable, TableAction} from '/@/components/Table';
    import AddListDetailModal from './AddListDetailModal.vue'
    import { number } from 'vue-types';
    import { useUserStore } from '/@/store/modules/user';
    // Emits声明
    const [registerTable, {reload,setSelectedRowKeys}] = useTable();
    const [registerDrawer, {openDrawer}] = useDrawer();
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    let isEdit = ref(false)
    let tabDisabled = ref(true)
    let current = ref(0)
    let userInfo = useUserStore().userInfo;
        //定义表格列
    const columns = [
    {
        title: '题目类型',
        dataIndex: 'questtionType',
        width: 40,
        customRender:({text}) => {
        return h('div',{
        },text==1?'单选题':text==2?'多选题':text==3?'问答题':text==4?'不定项题':text==5?'填空题':'判断题')
        },
        align: 'center',
    },
    {
        title: '试题名称',
        dataIndex: 'questionTitle',
        width: 40,
    },
    ];
    //查询form
    const formConfig = {
    labelWidth: 220,
    showResetButton:false,
    showSubmitButton:false
    };
    //表格配置
    const config = {
    canResize: false,
    bordered: true,
    size: 'small',
    rowKey: 'id',
    };
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        labelWidth: 150,
        schemas: formSchema(userInfo.userRoleType),
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    let searchInfo = ref();
    let cateId = ref()
    let examId = ref()
    let record = ref()
    //表单赋值
    const [registerModal, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {
        //重置表单
        await resetFields();
        current.value = 0
        isEdit.value = data.showFooter
        setDrawerProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
            //表单赋值
            tabDisabled.value = false
            searchInfo.value = {id:data.record.id}
            record.value = data.record
            cateId.value = data.record.cateId
            examId.value = data.record.id
            let param = {
              threeCateId:data.record?.threeCateId,
              twoCateId:data.record?.twoCateId,
              oneCateId:data.record.cateId,
            }
            data.record['cateName'] = param
            await setFieldsValue({
                ...data.record,
            });
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
    let selectedRowKeys = ref([])
    function selectionChange(k){
        selectedRowKeys.value = k.keys
    }
    /**
    * 新增事件
    */
    function handleAdd() {
        openDrawer(true, {
            record:record.value,
            cateId:cateId.value,
            examId:examId.value,
            isUpdate: false,
            showFooter: true,
        });
    }
    /**
    * 批量删除事件
    */
    async function batchHandleDelete() {
    await systemExamListDeleteBatch({ids: selectedRowKeys.value}, handleSuccess);
    }
    /**
    * 成功回调
    */
    function handleSuccess(data) {
        (selectedRowKeys.value = []) && reload();
        console.log(data,'data');
        if(data){
            let param = {
                dxFs:data.inputDanxuanFs,
                duxFs:data.inputDuoxuanFs,
                wdFs:data.inputWdFs,
                bdxFs:data.inputBdxFs,
                tkFs:data.inputTkFs,
                pdFs:data.inputPdFs,
            }
            setFieldsValue({
                ...param,
            });
        }
    }
    function closeFunc(){
        emit('success')
        tabDisabled.value = true
        return true
    }
    function handleDown(){
        current.value += 1
    }
    function handleOn(){
        current.value -= 1
    }
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
            delete values.cateName
            setDrawerProps({confirmLoading: true});
            //关闭弹窗

            //提交表单
            await saveOrUpdate(values, isUpdate.value).then(res=>{
                tabDisabled.value = false
                if(isUpdate.value){
                    closeDrawer();
                    tabDisabled.value = true
                }
                if(!isNaN(parseInt(res))){
                    isUpdate.value = true
                    queryById({id:res}).then(data=>{
                        debugger
                        searchInfo.value = {id:data.id}
                        record.value = data
                        cateId.value = data.cateId
                        examId.value = data.id
                        let param = {
                        threeCateId:data?.threeCateId,
                        twoCateId:data?.twoCateId,
                        oneCateId:data.cateId,
                        }
                        data['cateName'] = param
                        setFieldsValue({
                            ...data,
                        });
                    })
                }
            })


            //刷新列表
            emit('success');
        } finally {
            setDrawerProps({confirmLoading: false});
        }
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
.submit{
  position:fixed;
  background: #fff;
  width: 800px;
  right: 0px;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  z-index: 999;
  display: flex;
  justify-content: center;
}

  .but{
    // margin-left: 50%;
    // transform: translate(-50%);
    margin: 0 10px;
  }
</style>