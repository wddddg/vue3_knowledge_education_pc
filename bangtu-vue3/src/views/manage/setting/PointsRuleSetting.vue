<template>
  <div class="p-4">
    <div class="consten">
      <a-form :model="formState" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-card title="注册得积分" :bordered="false" class="mt20">
          <a-form-item label="新用户赠送" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.registerCount" />
            <span class="jf">积分</span>
          </a-form-item>
        </a-card>
        <a-card title="签到得积分" :bordered="false" class="mt20">
          <a-form-item label="签到赠送" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.signCount" />
            <span class="jf">积分</span>
          </a-form-item>
          <a-form-item label="每连续签到" :wrapper-col="{ span: 14 }">
            <div style="display: flex; align-items: center">
              <a-input-number :min="0" v-model:value="formState.continueDayCount" />
              <span class="jf">天</span>
              <span class="jf1">赠送</span>
              <a-input-number :min="0" v-model:value="formState.sendSignCount" />
              <span class="jf">积分</span>
              <a-alert style="margin-left: 20px; padding: 2px 15px" message="每获得一次奖励视为一次连续签到" type="info" show-icon />
            </div>
          </a-form-item>
        </a-card>

        <a-card title="文章得积分" :bordered="false" class="mt20">
          <a-form-item label="每发布一篇文章" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.pushNewsCount" />
            <span class="jf">积分</span>
            <span class="jf1">每日上限</span>
            <a-input-number :min="0" v-model:value="formState.pushNewsMostCount" />
            <span class="jf">积分</span>
          </a-form-item>
          <a-form-item label="每发布一条评论" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.pushCommentCount" />
            <span class="jf">积分</span>
            <span class="jf1">每日上限</span>
            <a-input-number :min="0" v-model:value="formState.pushCommentMostCount" />
            <span class="jf">积分</span>
          </a-form-item>
        </a-card>

        <a-card title="学习得积分" :bordered="false" class="mt20">
          <a-form-item label="每观看一次视频" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.courseCount" />
            <span class="jf">积分</span>
            <span class="jf1">每日上限</span>
            <a-input-number :min="0" v-model:value="formState.courseMostCount" />
            <span class="jf">积分</span>
          </a-form-item>
          <a-form-item label="每阅读一篇考点集" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.knowledgeCount" />
            <span class="jf">积分</span>
            <span class="jf1">每日上限</span>
            <a-input-number :min="0" v-model:value="formState.knowledgeMostCount" />
            <span class="jf">积分</span>
          </a-form-item>
          <a-form-item label="每阅读一本书籍" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.bookCount" />
            <span class="jf">积分</span>
            <span class="jf1">每日上限</span>
            <a-input-number :min="0" v-model:value="formState.bookMostCount" />
            <span class="jf">积分</span>
          </a-form-item>
        </a-card>

        <a-card title="题库得积分" :bordered="false" class="mt20">
          <a-form-item label="每参与一次考试" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.examCount" />
            <span class="jf">积分</span>
            <span class="jf1">每日上限</span>
            <a-input-number :min="0" v-model:value="formState.examMostCount" />
            <span class="jf">积分</span>
          </a-form-item>
          <a-form-item label="每正确答题一次" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.questionCount" />
            <span class="jf">积分</span>
            <span class="jf1">每日上限</span>
            <a-input-number :min="0" v-model:value="formState.questionMostCount" />
            <span class="jf">积分</span>
          </a-form-item>
        </a-card>

        <a-card title="消费得积分" :bordered="false" class="mt20">
          <a-form-item label="单笔消费" :wrapper-col="{ span: 14 }">
            <a-input-number :min="0" v-model:value="formState.consumeAmount" />
            <span class="jf">积分</span>
            <span class="jf1">赠送</span>
            <a-input-number :min="0" v-model:value="formState.consumeCount" />
            <span class="jf">积分</span>
          </a-form-item>
        </a-card>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }" style="margin-top: 40px">
          <a-button type="primary" @click="handleSubmit">保存</a-button>
          <a-button style="margin-left: 10px">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" name="PointsRuleSetting" setup>
  import { ref, computed, unref, provide } from 'vue';
  import { saveOrUpdate, queryById } from './PointsRuleSetting.api';
  const formState = ref({});
  const labelCol = { style: { width: '140px' } };
  const wrapperCol = { span: 14 };

  //积分配置-查询详情
  function queryByIdFun() {
    queryById({}).then((result) => {
      formState.value = result;
    });
  }
  queryByIdFun();

  //表单提交事件
  async function handleSubmit() {
    try {
      const values = {
        ...formState.value,
      };
      //提交表单
      await saveOrUpdate(values);
    } finally {
    }
  }
</script>

<style lang="less" scoped>
  ::v-deep .ant-card-body {
    background: rgba(247, 247, 247, 1);
    border-radius: 8px;
  }
  .consten {
    padding: 10px 30px 30px;
    background: #fff;
  }

  .mt20 {
    margin-top: 40px;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
  :deep(#fullAmount) > div {
    display: flex;
    align-items: center;
  }
  :deep(#fullAmount) > div .ant-input-number {
    width: 35%;
    margin: 0 10px;
    text-align: center;
  }
  :deep(.ant-input-number-input) {
    text-align: center;
  }
  .jf {
    margin-left: 10px;
  }
  ::v-deep .ant-form-item {
    margin-top: 24px;
  }
  .jf1 {
    margin-left: 100px;
    margin-right: 10px;
  }
</style>
