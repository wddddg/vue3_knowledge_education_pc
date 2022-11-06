<template>
  <BasicDrawer :isDetail="true" v-bind="$attrs" @register="registerDrawer" destroyOnClose :title="title">
    <a-card title="订单状态" :bordered="false" size="small" :headStyle="headStyle">
      <div class="orderStatus">
        {{ rootTreeData?.status === 1 ? '待支付' : '已支付' }}
      </div>
    </a-card>
    <a-form :model="formState" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-card title="购买信息" :bordered="false" size="small" :headStyle="headStyle">
        <a-row style="color: #666666">
          <a-col :span="12">
            <a-form-item labelAlign="left" label="名称">
              {{ rootTreeData.spuName }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item labelAlign="left" label="类型">
              {{ rootTreeData.categoryStr }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item labelAlign="left" label="日期">
              {{ rootTreeData.createTime }}
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="支付信息" :bordered="false" size="small" :headStyle="headStyle">
        <a-row>
          <a-card style="width: 100%" title="订单信息" :bordered="true" size="small" :headStyle="itemHeadStyle">
            <a-row>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="订单编号">
                  {{ rootTreeData.orderNumber }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="支付渠道">
                  {{ rootTreeData.payType === 1 ? '支付宝' : rootTreeData.payType === 2 ? '微信' : rootTreeData.payType === 3 ? 'ios' : rootTreeData.payType === 4 ? '学币' : '卡密兑换' }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="下单时间">
                  {{ rootTreeData.createTime }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="支付时间">
                  {{ rootTreeData.payTime }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="支付方式">
                  {{ rootTreeData.payType === 1 ? '支付宝' : rootTreeData.payType === 2 ? '微信' : rootTreeData.payType === 3 ? 'ios' : rootTreeData.payType === 1 ? '学币支付' : '卡密兑换' }}
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
        <a-row>
          <a-card style="width: 100%" title="付款信息" :bordered="true" size="small" :headStyle="itemHeadStyle">
            <a-row>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="购买数量">
                  {{ rootTreeData.buyNumber }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="规格">
                  {{ rootTreeData.unitPrice }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="快递费">
                  {{ rootTreeData.expressAmount }}
                </a-form-item>
              </a-col>
              <a-col :span="12"> </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="实际支付" style="font-weight: 800">
                  <span class="totalPriceStyle">￥ {{ rootTreeData.totalPrice }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
        <a-row>
          <a-card style="width: 100%" title="收货信息" :bordered="true" size="small" :headStyle="itemHeadStyle">
            <a-row>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="收货姓名">
                  {{ rootTreeData.receivedName }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="联系电话">
                  {{ rootTreeData.receivedPhone }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="详细地址">
                  {{ rootTreeData.receivedAddress }}
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <!-- <a-form-item labelAlign="left" label="优惠券折扣">
                  {{  rootTreeData.couponPrice }}
                </a-form-item> -->
              </a-col>
              <a-col :span="12">
                <a-form-item labelAlign="left" label="发货时间">
                  {{ rootTreeData.sendTime }}
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item labelAlign="left" label="快递单号" style="font-weight: 800">
                  <span class="totalExpressStyle"> {{ rootTreeData.expressName }}{{ rootTreeData.expressNumber }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
      </a-card>
    </a-form>
  </BasicDrawer>
</template>

<script lang="ts" setup>
import { ref, computed, unref, watch } from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { queryById } from '../SystemMemberOrder.api';
// Emits声明
const emit = defineEmits(['register', 'success']);
const isUpdate = ref(true);
const showFooter = ref(true);
const labelCol = { style: { width: '140px' } };
const wrapperCol = { span: 14 };
const rootTreeData = ref({});
const headStyle = { fontWeight: 800, fontSize: '18px' };
const itemHeadStyle = { backgroundColor: '#f7f7f7' };
//表单赋值
const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
  queryById({ id: data.record.id }).then((res) => {
    rootTreeData.value = res;
  });
  showFooter.value = data?.showFooter ?? true;
  setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
  isUpdate.value = !!data?.isUpdate;
});

//设置标题
const title = computed(() => '订单详情');
</script>

<style lang="less" scoped>
/** 时间和数字输入框样式 */
:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-calendar-picker) {
  width: 100%;
}
.orderStatus {
  color: #f00;
  font-size: 16px;
  font-weight: 700;
}
.totalPriceStyle {
  color: #f00;
  font-size: 16px;
  font-weight: 700;
}
.totalExpressStyle {
  font-size: 16px;
  font-weight: 700;
}
</style>
