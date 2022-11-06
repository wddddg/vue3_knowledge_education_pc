<template>
  <div class="p-4">
    <a-form :model="formState" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-card title="" :bordered="false">
        <div class="flexs">
          <span class="labe">推广商品</span>
          <a-form-item label="会员">
            <a-switch v-model:checked="formState.memberEnable" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <a-form-item label="课程">
            <a-switch v-model:checked="formState.courseEnable" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <a-form-item label="书籍">
            <a-switch v-model:checked="formState.examEnable" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <a-form-item label="知识库">
            <a-switch v-model:checked="formState.delivery" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <a-form-item label="商城">
            <a-switch v-model:checked="formState.mallEnable" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <a-form-item label="学币充值">
            <a-switch v-model:checked="formState.learnMoneyEnable" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <a-form-item label="用户邀新">
            <a-switch v-model:checked="formState.inviteEnable" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
        </div>
      </a-card>
      <a-card title="" :bordered="false" class="mt20">
        <a-form-item label="分销等级" :wrapper-col="{ span: 14, offset: 1 }">
          <a-radio-group v-model:value="formState.ruleGrade">
            <a-radio :value="1">一级分销</a-radio>
            <a-radio :value="2">二级分销</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-divider />
        <div class="flexs">
          <span class="labe">佣金比例设置</span>
          <div class="xfz">
            <a-avatar style="background-color: #87d068">
              <template #icon> <UserOutlined /> </template>
            </a-avatar>
            <a-tag style="margin-left: 10px" color="green">消费者</a-tag>
          </div>
          <template v-if="formState.ruleGrade == 2">
            <div class="xfz"> <arrow-right-outlined /></div>
            <div class="xfz">
              <a-avatar style="background-color: purple">
                <template #icon> <UserOutlined /> </template>
              </a-avatar>
              <a-tag style="margin-left: 10px" color="purple">一级分销</a-tag>
            </div>
            <a-form-item label="佣金比例" :wrapper-col="{ span: 14, offset: 1 }"> <a-input :min="0" v-model:value="formState.oneRate" addon-after="%" /><span class="yuan"></span> </a-form-item>
          </template>
          <div class="xfz"> <arrow-right-outlined /></div>
          <div class="xfz">
            <a-avatar style="background-color: purple">
              <template #icon> <UserOutlined /> </template>
            </a-avatar>
            <a-tag style="margin-left: 10px" color="purple">{{ formState.ruleGrade == 1 ? '一级分销' : '二级分销' }}</a-tag>
          </div>
          <a-form-item v-if="formState.ruleGrade == 2" label="佣金比例" :wrapper-col="{ span: 14, offset: 1 }">
            <a-input :min="0" v-model:value="formState.twoRate" addon-after="%" /><span class="yuan"></span>
          </a-form-item>
          <template v-if="formState.ruleGrade == 1">
            <a-form-item label="佣金比例" :wrapper-col="{ span: 14, offset: 1 }"> <a-input :min="0" v-model:value="formState.oneRate" addon-after="%" /><span class="yuan"></span> </a-form-item>
          </template>
        </div>
      </a-card>

      <a-card title="" :bordered="false" class="mt20">
        <a-form-item label="邀新奖励" :wrapper-col="{ span: 14, offset: 1 }">
          <a-radio-group v-model:value="formState.inviteRule">
            <a-radio :value="1">现金奖励</a-radio>
            <a-radio :value="2">优惠券奖励</a-radio>
            <a-radio :value="3">积分奖励</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-divider />
        <div class="flexs flexs2">
          <a-form-item label="新用户" :wrapper-col="{ span: 14, offset: 1 }" v-if="formState.inviteRule == 1">
            <a-input :min="0" v-model:value="formState.newAmount" addon-after="元" /><span class="yuan"></span>
          </a-form-item>
          <a-form-item label="老用户" :wrapper-col="{ span: 14, offset: 1 }" v-if="formState.inviteRule == 1">
            <a-input :min="0" v-model:value="formState.oldAmount" addon-after="元" /><span class="yuan"></span>
          </a-form-item>
          <a-form-item label="新用户" :wrapper-col="{ span: 14, offset: 1 }" v-if="formState.inviteRule == 2">
            <a-select v-model:value="formState.newCouponId" style="width: 320px" placeholder="请选择优惠券">
              <a-select-option v-for="(item, index) in downSelectList" :key="item.id" :value="item.id"> {{ item.title }} </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="老用户" :wrapper-col="{ span: 14, offset: 1 }" v-if="formState.inviteRule == 2">
            <a-select v-model:value="formState.oldCouponId" style="width: 320px" placeholder="请选择优惠券">
              <a-select-option v-for="(item, index) in downSelectList" :key="item.id" :value="item.id"> {{ item.title }} </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="新用户" :wrapper-col="{ span: 14, offset: 1 }" v-if="formState.inviteRule == 3">
            <a-input :min="0" v-model:value="formState.newIntegral" addon-after="分" /><span class="yuan"></span>
          </a-form-item>
          <a-form-item label="老用户" :wrapper-col="{ span: 14, offset: 1 }" v-if="formState.inviteRule == 3">
            <a-input :min="0" v-model:value="formState.oldIntegral" addon-after="分" /><span class="yuan"></span>
          </a-form-item>
        </div>
      </a-card>

      <a-card title="" :bordered="false" class="mt20">
        <div class="flexs">
          <a-form-item label="邀新升级奖励" :wrapper-col="{ span: 14, offset: 1 }" style="width: 16%">
            <a-switch v-model:checked="formState.inviteUpgradeEnable" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
          <a-form-item label="" style="width: 30%">
            <a-radio-group v-model:value="formState.inviteUpgradeType" :wrapper-col="{ span: 20, offset: 1 }">
              <a-radio :value="1">现金奖励</a-radio>
              <a-radio :value="2">积分奖励</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
        <a-divider />
        <div class="showTable" v-if="!loading">
          <BasicTable @register="registerTable">
            <template #thresholdCount="{ text }">
              <span>dsssssssssss {{ text }}</span>
            </template>
            <template #headerCell="{ column }">
              <template v-if="column.key === 'rewardCount'">
                <span> {{ `奖励（${formState.inviteUpgradeType == 1 ? '元' : '分'}）` }} </span>
              </template>
            </template>
          </BasicTable>
          <div>
            <a-button @click="addLine">添加行</a-button>
          </div>
        </div>
      </a-card>
      <a-card title="" :bordered="false" class="mt20">
        <div class="flexs">
          <a-form-item label="佣金升级奖励" :wrapper-col="{ span: 14, offset: 1 }" style="width: 20%">
            <a-switch v-model:checked="formState.learnMoneyEnable" :checkedValue="1" :unCheckedValue="0" checked-children="开" un-checked-children="关" />
          </a-form-item>
        </div>
        <a-divider />
        <div class="showTable" v-if="!loading">
          <BasicTable @register="registerTable1" />
          <div>
            <a-button @click="addLine1">添加行</a-button>
          </div>
        </div>
      </a-card>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }" style="margin-top: 40px">
        <a-button type="primary" @click="handleSubmit">保存</a-button>
        <a-button style="margin-left: 10px">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" name="came-camePayInfo" setup>
  import { h } from 'vue';
  import { InputNumber, Button } from 'ant-design-vue';
  import { ArrowRightOutlined, UserOutlined } from '@ant-design/icons-vue';
  import { ref, computed, onMounted, watch } from 'vue';
  import { columnsForm1 } from '../CamePayInfo.data';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { retailRuleAddOrEdit, findSelectList } from '../CamePayInfo.api';
  const props = defineProps({
    loading: Boolean,
    retailRuleInfo: { type: Object, default: () => {} },
  });
  const formState = ref({});
  const labelCol = { style: { width: '108px' } };
  const wrapperCol = { span: 14 };
  const upgradeInviteList = ref([]); // 邀请升级奖励
  const upgradeMoneyList = ref([]); // 	佣金升级奖励
  const downSelectList = ref([]);
  //	邀请升级奖励
  const columnsForm = [
    {
      title: '梯度',
      align: 'center',
      dataIndex: 'sort',
      customRender: ({ record }) => {
        return h(InputNumber, {
          defaultValue: record.sort || 0,
          onChange(value) {
            record.sort = value;
          },
        });
      },
    },
    {
      title: '累计邀请(人)',
      align: 'center',
      dataIndex: 'thresholdCount',
      customRender: ({ record }) => {
        return h(InputNumber, {
          defaultValue: record.thresholdCount || 0,
          onChange(value) {
            record.thresholdCount = value;
          },
        });
      },
    },
    {
      title: `奖励（元/积分）`,
      align: 'center',
      dataIndex: 'rewardCount',
      customRender: ({ record }) => {
        return h(InputNumber, {
          defaultValue: record.rewardCount || 0,
          onChange(value) {
            record.rewardCount = value;
          },
        });
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: '',
      customRender: ({ index }) => {
        return h(
          Button,
          {
            type: 'link',
            onClick() {
              upgradeInviteList.value.splice(index, 1);
            },
          },
          ['删除']
        );
      },
    },
  ];

  const [registerTable, { reload, setTableData }] = useTable({
    dataSource: upgradeInviteList,
    columns: columnsForm,
    pagination: false,
    canResize: false,
    rowKey: 'id',
    searchInfo: {},
  });
  const [registerTable1, { reload: reloadFun, setTableData: setPropsTable1 }] = useTable({
    dataSource: upgradeMoneyList,
    columns: columnsForm1(upgradeMoneyList),
    pagination: false,
    canResize: false,
    rowKey: 'id',
    searchInfo: {},
  });
  //表单提交事件
  async function handleSubmit() {
    try {
      const values = {
        ...props.retailRuleInfo,
        ...formState.value,
        upgradeInviteList: upgradeInviteList.value,
        upgradeMoneyList: upgradeMoneyList.value,
      };
      //提交表单
      await retailRuleAddOrEdit(values);
    } finally {
    }
  }

  function addLine() {
    upgradeInviteList.value.push({ rewardCategory: 1, rewardType: formState.value.inviteUpgradeType });
  }
  function addLine1() {
    upgradeMoneyList.value.push({ rewardCategory: 2, rewardType: 1 });
  }

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      formState.value = props.retailRuleInfo || {};
      upgradeMoneyList.value = props.retailRuleInfo.upgradeMoneyList || [];
      upgradeInviteList.value = props.retailRuleInfo.upgradeInviteList || [];
      reloadFun();
      reload();
    },
    { deep: true }
  );
  onMounted(() => {
    // watch(
    //   () => upgradeInviteList.value,
    //   () => {
    //     setTableData(upgradeInviteList.value);
    //     reload();
    //   },
    //   { deep: true }
    // );
    // watch(
    //   () => upgradeMoneyList.value,
    //   () => {
    //     setPropsTable1(upgradeMoneyList.value);
    //     reloadFun();
    //   },
    //   { deep: true }
    // );
    findSelectList().then((res) => {
      downSelectList.value = res;
    });
  });
</script>

<style scoped>
  .flexs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }
  .mt20 {
    margin-top: 40px;
  }
  .flexs ::v-deep .ant-form-item {
    margin-bottom: 0;
  }
  .labe {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 120px;
    padding-right: 12px;
  }
  .labe::after {
    content: ':';
    position: relative;
    top: -0.5px;
    margin: 0 8px 0 2px;
  }
  ::v-deep .ant-card-body {
    background: rgba(247, 247, 247, 1);
    border-radius: 8px;
  }
  .flexs2 ::v-deep .ant-form-item {
    width: 50%;
  }
  .yuan {
    margin-left: 10px;
  }
  .xfz {
    margin-left: 20px;
    display: flex;
    align-items: center;
  }
  ::v-deep .ant-table-tbody .ant-input-number-input {
    text-align: center;
  }
</style>
