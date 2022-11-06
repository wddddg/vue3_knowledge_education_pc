<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" destroyOnClose :title="title" :showFooter="showFooter" :width="adaptiveWidth" @ok="handleSubmit">
    <BasicForm @register="registerForm">
    <!-- 快递类型 -->
      <template #expressSlot="{ model, field }">
        <a-radio-group v-model:value="model[field]" :disabled="!(model.goodsType == 1)">
          <div class="item">
            <a-radio :value="0">无需物流</a-radio>
            <a-radio :value="1">免运费</a-radio>
            <a-radio :value="2">运费金额</a-radio>
            <div class="item"> <a-input-number placeholder="请输入运费" :disabled="!(model[field] === 2)" v-model:value="expressAmount" class="inputValue" />元 </div>
          </div>
        </a-radio-group>
      </template>
      <!-- 商品设置提示信息 -->
      <template #alertSlot="{ model, field }">
        <a-alert type="info" showIcon message="规格名称除“实物商品”、“优惠券”、“线下课”、“电子书”、“考点集”外填写规格为-天数" />
      </template>
      <!-- 动态添加表格 -->
      <template #normsSlot="{ model, field }">
        <div>
          <BasicTable @register="registerTable" :showIndexColumn="false" />
          <div>
            <a-button @click="addLine">添加行</a-button>
          </div>
        </div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, watch } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { formSchema, columnsForm } from '../MallGoodsInfo.data';
  import { saveOrUpdate,getInfoById } from '../MallGoodsInfo.api';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  const props = defineProps({
    rootTreeData: { type: Array, default: () => [] },
  });
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const showFooter = ref(true);
  const expressAmount = ref(0)
  const upgradeInviteList = ref([]);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    //重置表单
    await resetFields();
    upgradeInviteList.value = []
    expressAmount.value = 0
    showFooter.value = data?.showFooter ?? true;
    setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    
    updateSchema([
      {
        field: 'oneCateId',
        componentProps: { treeData: props.rootTreeData },
      },
    ]);
    if (unref(isUpdate)) {
      //表单赋值
      await getInfoById({id:data.record.id}).then(async (res) =>{
        let imgUrlList = null
        if(res.mallGoodsImgVOList){
           imgUrlList = res.mallGoodsImgVOList.map(item =>{
            return item.imgUrl
          })
        }
        
        await setFieldsValue({
          ...res,
          zeroClassifyId: res.twoClassifyId || res.oneClassifyId,
          imgUrl: imgUrlList
        });
        expressAmount.value = res.expressAmount
        upgradeInviteList.value = [ ...res.mallGoodsNormsVOList ]
      })
      // await setFieldsValue({
      //   ...data.record,
      //   zeroClassifyId: data.record.twoClassifyId || data.record.oneClassifyId
      // });
      // expressAmount.value = data.record.expressAmount
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const { adaptiveWidth } = useDrawerAdaptiveWidth();

  const [registerTable, { reload: reloadFun, setTableData: setPropsTable1 }] = useTable({
    dataSource: upgradeInviteList,
    columns: columnsForm,
    pagination: false,
    canResize: false,
    rowKey: 'id',
    searchInfo: {},
  });
  function addLine() {
    // if(){
    //   upgradeInviteList.value.push({goodsId: values.id});
    // }else{
    //   upgradeInviteList.value.push({});
    // }
    upgradeInviteList.value.push({
      integralAmount:0,
      price:0,
      stockAmount:'',
      norms:''
    });
  }
  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setDrawerProps({ confirmLoading: true });
      values.userIdentity === 1 && (values.departIds = '');
      values.expressAmount = expressAmount.value
      let mallGoodsNormsVOList = values.mallGoodsNormsVOList
      let mallGoodsImgVOList = []
      let imgList = values.imgUrl.split(',')
      imgList.forEach(item => {
        mallGoodsImgVOList.push({
          imgUrl: item,
          goodsId: values.id
        })
      })
      
      values.mallGoodsImgVOList = mallGoodsImgVOList
      values.mallGoodsNormsVOList = [ ...upgradeInviteList.value || { norms:mallGoodsNormsVOList } ]
      
      // 提交表单
      await saveOrUpdate(values, isUpdate.value);
      //关闭弹窗
      closeDrawer();
      //刷新列表
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
  .item {
    display: flex;
    align-items: center;
    .inputValue {
      width: 70px;
      margin-right: 10px;
    }
  }
</style>
