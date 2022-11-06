<template>
  <BasicDrawer v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="adaptiveWidth">
    <BasicForm @register="registerForm">
      <template #expressSlot="{ model, field }">
        <a-radio-group v-model:value="model[field]" :disabled="true">
          <div class="item">
            <a-radio :value="0">无需物流</a-radio>
            <a-radio :value="1">免运费</a-radio>
            <a-radio :value="2">运费金额</a-radio>
            <div class="item"> <a-input-number placeholder="请输入运费" :disabled="true" v-model:value="expressAmount" class="inputValue" />元 </div>
          </div>
        </a-radio-group>
      </template>
      <!-- 商品设置提示信息 -->
      <template #alertSlot>
        <a-alert type="info" showIcon message="规格名称除“实物商品”、“优惠券”、“线下课”、“电子书”、“考点集”外填写规格为-天数" />
      </template>
      <!-- 动态添加表格 -->
      <template #normsSlot>
        <div>
          <BasicTable @register="registerTable" :showIndexColumn="false" />
        </div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
// import {BasicModal, useModalInner} from '/@/components/Modal';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { BasicTable, useTable, TableAction } from '/src/components/Table';
import { BasicForm, useForm } from '/@/components/Form/index';
import { formSchema, columnsForm } from '../MallGoodsInfo.data';
import { saveOrUpdate, getInfoById } from '../MallGoodsInfo.api';
import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
// Emits声明
const emit = defineEmits(['register', 'success']);
const expressAmount = ref(0);
const upgradeInviteList = ref([]);
//表单配置
const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
  labelWidth: 150,
  schemas: formSchema,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
//表单赋值
const [registerModal, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
  //重置表单
  await resetFields();
  setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
  await getInfoById({ id: data.record.id }).then(async (res) => {
    let imgUrlList = null;
    if (res.mallGoodsImgVOList) {
      imgUrlList = res.mallGoodsImgVOList.map((item) => {
        return item.imgUrl;
      });
    }
    await setFieldsValue({
      ...res,
      zeroClassifyId: res.twoClassifyId || res.oneClassifyId,
      imgUrl: imgUrlList,
    });
    expressAmount.value = res.expressAmount;
    upgradeInviteList.value = [...res.mallGoodsNormsVOList];
  });
  // 隐藏底部时禁用整个表单
  setProps({ disabled: !data?.showFooter });
//   updateSchema([
//     { field: 'businessId', componentProps: { disabled:true } },
//     { field: 'imgUrl', componentProps: { disabled:true } },
//   ]);
});
//设置标题
const title = computed(() => '查看');
const { adaptiveWidth } = useDrawerAdaptiveWidth();

const [registerTable, { reload: reloadFun, setTableData: setPropsTable1 }] = useTable({
  dataSource: upgradeInviteList,
  columns: columnsForm,
  pagination: false,
  canResize: false,
  rowKey: 'id',
  searchInfo: {},
});
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