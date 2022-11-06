<template>
  <BasicDrawer v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800"  @ok="handleSubmit">
      <BasicForm :style="`margin-bottom:${record?.questonType == 5?'0px':'100px'}`" @register="registerForm"/>
      <div style="margin-bottom:50px" v-if="record?.questonType == 5">
        <BasicTable @register="registerTable" :rowSelection="rowSelection" >
        </BasicTable>
        <div>
          <a-button @click="addLine" v-if="isEdit">添加行</a-button>
        </div>
      </div>
    <div class="submit">
      <a-button type="primary" class="but" @click="handleSubmit" v-if="isEdit"> 提交 </a-button>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
    import {ref, computed, unref,h} from 'vue';
    import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {formSchema} from '../SystemQuestions.data';
    import {saveOrUpdate} from '../SystemQuestions.api';
    import { BasicTable, useTable, TableAction } from '/src/components/Table';
    import {  Input } from 'ant-design-vue';
    import { useUserStore } from '/@/store/modules/user';
    import { useMessage } from '/@/hooks/web/useMessage';
    const { createMessage } = useMessage();
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    let isEdit = ref(false)
    let TableData = ref([])
    let userInfo = useUserStore().userInfo;
    const [registerTable, { reload, updateTableDataRecord, setProps: setPropsTable, setTableData }] = useTable({
        title: '答案',
        // api: list,
        dataSource:TableData.value,
        columns: [
            {
                title: '答案',
                align:"center",
                dataIndex: 'answer',
                customRender: ({ record }) => {
                    return h('div',{},[
                    h(Input, {
                        defaultValue: record.answer || '',
                        onChange(value) {
                            record.answer = value.target.value;
                            console.log(record.answer);
                        },
                    }),
                    ])
                },
            },
        ],
        pagination: false,
        canResize: false,
        rowKey: 'id',
        searchInfo: {},
    });
    function addLine() {
        TableData.value.push({answer:''});
        setTableData(TableData.value);
        reload();
    }
    let record = ref({questonType:''})
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        labelWidth: 150,
        schemas: formSchema(record,userInfo.userRoleType),
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    //表单赋值
    const [registerModal, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {
        //重置表单
        await resetFields();
        TableData.value=[]
        isEdit.value = data.showFooter
        setDrawerProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
            //表单赋值
            record.value = JSON.parse(JSON.stringify(data.record))
            let param = {
                threeCateId:data.record?.threeCateId,
                twoCateId:data.record?.twoCateId,
                oneCateId:data.record?.sysCategory,
            }
            data.record['cateName'] = param
            if(data.record.questonType=='1'){
                data.record.answer1 = data.record.answer
            }else if(data.record.questonType=='6'){
                data.record.answer6 = data.record.answer
            }else if(data.record.questonType=='2'||data.record.questonType=='4'){
                data.record.answer24 = data.record.answer
            }else if(data.record.questonType=='3'){
                data.record.answer3 = data.record.answer
            }
            await setFieldsValue({
                ...data.record,
            });
            
            if(record.value.questonType=='5'){
                let arr = record.value.answer.split(',')
                arr.forEach(item=>{
                    let listItem = {}
                    listItem.answer = item
                    TableData.value.push(listItem)
                })
                setTableData(TableData.value);
                reload();
            }
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
                debugger
            if(values.questonType=='5'){
                if (TableData.value.length <= 0) {
                    createMessage.warning('请添加答案');
                    return;
                }
                let answer = []
                TableData.value.forEach(itme=>{
                    answer.push(itme.answer)
                })
                Object.assign(values,{answer:answer.join(',')})
            }else if(values.questonType=='1'){
                values.answer = values.answer1
            }else if(values.questonType=='6'){
                values.answer = values.answer6
            }else if(values.questonType=='2'||values.questonType=='4'){
                values.answer = values.answer24
            }else if(values.questonType=='3'){
                values.answer = values.answer3
            }
            delete values.answer1
            delete values.answer6
            delete values.answer24
            delete values.answer3
            setDrawerProps({confirmLoading: true});
            //提交表单
            await saveOrUpdate(values, isUpdate.value);
            //关闭弹窗
            closeDrawer();
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
}

  .but{
    margin-left: 50%;
    transform: translate(-50%);
  }
</style>