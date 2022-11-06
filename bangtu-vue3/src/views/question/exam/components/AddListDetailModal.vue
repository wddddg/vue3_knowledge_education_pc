<template>
  <BasicDrawer v-bind="$attrs" @register="registerModal" :closeFunc="closeFunc" destroyOnClose :title="title" :width="1200" @ok="handleSubmit">
            
            <BasicTable
                :columns="columns1"
                v-bind="config"
                :formConfig="formConfig"
                :useSearchForm="true"
                :api="getQuestionCount"
                :searchInfo="searchInfo"
                :rowSelection="{ type: 'checkbox' }"
                @register="registerTable1"
                @selection-change="selectionChange1"
            ></BasicTable>
            <BasicForm @register="registerForm" />
            <BasicTable
                :columns="columns"
                v-bind="config"
                :formConfig="formConfig"
                :useSearchForm="true"
                :dataSource="questionList"
                :rowSelection="{ type: 'checkbox' }"
                @register="registerTable"
                @selection-change="selectionChange"
                style="margin-bottom:50px"
                v-show="record?.examPattern==1"
            >
            <template #tableTitle>
                <a-button type="primary" @click="handleAdd(true)" preIcon="ant-design:plus-outlined"> 关联</a-button>
                <a-button  @click="handleAdd(false)"> 取消关联</a-button>
            </template>
            </BasicTable>
    <div class="submit">
        <a-button type="primary" class="but" @click="handleAdd(true)" v-if="isEdit"> 保存 </a-button>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
    import {ref, computed, unref,h} from 'vue';
    import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {addformSchema} from '../SystemExam.data';
    import {saveOrUpdate,getQuestionCount,getByChapter,addByType,addList} from '../SystemExam.api';
    // import {BasicTable} from '/@/components/Table/src/BasicTable.vue'
    import {BasicTable, useTable, TableAction} from '/@/components/Table';
    import { useMessage } from '/@/hooks/web/useMessage';
    
    const { createMessage } = useMessage();
    // Emits声明
    const [registerTable1, {reload:reload1,setSelectedRowKeys:setSelectedRowKeys1}] = useTable();
    const [registerTable, {reload,setSelectedRowKeys}] = useTable();
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    let isEdit = ref(false)
    let questionList = ref([])
        //定义表格列
    const columns1 = [
        {
            title: '题库',
            dataIndex: 'name',
            width: 40,
        },
        {
            title: '单选题',
            dataIndex: 'danxuanCount',
            width: 40,
        },
        {
            title: '多选题',
            dataIndex: 'duoxuanCount',
            width: 40,
        },
        {
            title: '问答题',
            dataIndex: 'wendaCount',
            width: 40,
        },
        {
            title: '不定项题',
            dataIndex: 'budxiangCount',
            width: 40,
        },
        {
            title: '填空题',
            dataIndex: 'tiankongCount',
            width: 40,
        },
        {
            title: '判断题',
            dataIndex: 'panduanCount',
            width: 40,
        },
    ];
    const columns = [
    {
        title: '试题名称',
        dataIndex: 'title',
        width: 40,
    },
    {
        title: '关联状态',
        dataIndex: 'relationed',
        customRender:({text}) => {
        return h('div',{
        style:{color:text?'#0080FF':'#000'}
        },text?'已关联':'未关联')
        },
        width: 40,
    },
    {
        title: '题目类型',
        dataIndex: 'questonType',
        width: 40,
        customRender:({text}) => {
        return h('div',{
        },text==1?'单选题':text==2?'多选题':text==3?'问答题':text==4?'不定项题':text==5?'填空题':'判断题')
        },
        align: 'center',
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
    let Count = ref({
        danxuanCount:0,
        duoxuanCount:0,
        wendaCount:0,
        budingxiangCount:0,
        tiankongCount:0,
        panduanCount:0,
    })
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate,updateSchema}] = useForm({
        labelWidth: 150,
        schemas: addformSchema(Count),
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    let searchInfo = ref();
    let examId = ref()
    let record = ref()
    //表单赋值
    const [registerModal, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {
        //重置表单
        debugger
        await resetFields();
        questionList.value = []
        isEdit.value = data.showFooter
        examId.value = data.examId
        record.value = data.record
        searchInfo.value = {cateId:data.cateId}
        setDrawerProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        //表单赋值
        console.log(record,'record.value.dxFs');
        let param = {
            // inputDanxuan:data.record.danxuanCount,
            // inputDuoxuan:data.record.duoxuanCount,
            inputDanxuanFs:data.record.dxFs,
            inputDuoxuanFs:data.record.duxFs,
            // inputWd:data.record.wendaCount,
            // inputBdx:data.record.budingxiangCount,
            inputWdFs:data.record.wdFs,
            inputBdxFs:data.record.bdxFs,
            // inputTk:data.record.tiankongCount,
            // inputPd:data.record.panduanCount,
            inputTkFs:data.record.tkFs,
            inputPdFs:data.record.pdFs,
            examPattern:data.record.examPattern,
        }
        await setFieldsValue({
            ...param
        });
        
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
    let selectedRowKeys1 = ref([])
    function selectionChange1(k){
        selectedRowKeys1.value = k.keys
        let chapterId =  k.keys.join(',')
        getByChapter({examId:examId.value,chapterId:chapterId,pageSize: 9999999,pageNumber: 1}).then(res=>{
            questionList.value = res
        })
        Count.value = {
        danxuanCount:0,
        duoxuanCount:0,
        wendaCount:0,
        budingxiangCount:0,
        tiankongCount:0,
        panduanCount:0,
    }
        k.rows.forEach(res=>{
            Count.value.danxuanCount += res.danxuanCount?res.danxuanCount:0
            Count.value.duoxuanCount += res.duoxuanCount?res.duoxuanCount:0
            Count.value.wendaCount += res.wendaCount?res.wendaCount:0
            Count.value.budingxiangCount += res.budingxiangCount?res.budingxiangCount:0
            Count.value.tiankongCount += res.tiankongCount?res.tiankongCount:0
            Count.value.panduanCount += res.panduanCount?res.panduanCount:0
        })
        const itemProp = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        updateSchema([
            { field: 'inputDanxuan',   itemProps: {...itemProp,extra: '共'+Count.value.danxuanCount+'道',},componentProps:{max:Count.value.danxuanCount},},
            { field: 'inputDuoxuan', itemProps: {...itemProp,extra: '共'+Count.value.duoxuanCount+'道',},componentProps:{max:Count.value.duoxuanCount},},
            { field: 'inputBdx', itemProps: {...itemProp,extra: '共'+Count.value.budingxiangCount+'道',},componentProps:{max:Count.value.budingxiangCount},},
            { field: 'inputWd', itemProps: {...itemProp,extra: '共'+Count.value.wendaCount+'道',},componentProps:{max:Count.value.wendaCount},},
            { field: 'inputPd', itemProps: {...itemProp,extra: '共'+Count.value.panduanCount+'道',},componentProps:{max:Count.value.panduanCount},},
            { field: 'inputTk', sitemProps: {...itemProp,extra: '共'+Count.value.tiankongCount+'道',},componentProps:{max:Count.value.tiankongCount},},
        ]);
    }
    let selectedRowKeys = ref([])
    function selectionChange(k){
        selectedRowKeys.value = k.keys
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
    function handleSuccess() {
        (selectedRowKeys.value = []) && reload();
    }
    function closeFunc(){
        emit('success')
        return true
    }
    /**
    * 关联
    */
    async function handleAdd(value) {
        
        let values = await validate();
        if(record.value.examPattern == 1){
            // delete values.examPattern
            values.inputDanxuan = 0
            values.inputDuoxuan = 0
            values.inputWd = 0
            values.inputBdx = 0
            values.inputTk = 0
            values.inputPd = 0
            questionList.value.forEach((item,index)=>{
                if(item.relationed){
                    if(item.questonType==1){
                        values.inputDanxuan++ 
                    }else if (item.questonType==2){
                        values.inputDuoxuan++
                    }else if (item.questonType==3){
                        values.inputWd++
                    }else if (item.questonType==4){
                        values.inputBdx++
                    }else if (item.questonType==5){
                        values.inputTk++
                    }else if (item.questonType==5){
                        values.inputPd++
                    }
                }
            })
            addByType({allCount:values,examId:examId.value,examQuestionIds:selectedRowKeys.value.join(','),gl:value}).then(res=>{
                getByChapter({examId:examId.value,chapterId:selectedRowKeys1.value.join(','),pageSize: 9999999,pageNumber: 1}).then(res=>{
                    questionList.value = res
                })
                emit('success',values);
            })
        }else if(record.value.examPattern == 2){
            if (selectedRowKeys1.value.length <= 0) {
                createMessage.warning('请选择一条题库记录！');
                return;
            }
            let param = {
                    allCount:values,
                    examId:examId.value,
                    cateId:record.value.cateId,
                    chaper:selectedRowKeys1.value,
                    examQuestionIds:selectedRowKeys.value.join(','),
                    examQuestionType:record.value.examPattern,
                }
            addList(param).then(res=>{
                getByChapter({examId:examId.value,chapterId:selectedRowKeys1.value.join(','),pageSize: 9999999,pageNumber: 1}).then(res=>{
                    questionList.value = res
                })
            })
        }
        handleSubmit()
    }
    
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            // let values = await validate();
            setDrawerProps({confirmLoading: true});
            //提交表单
            // await saveOrUpdate(values, isUpdate.value);
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
  width: 1200px;
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