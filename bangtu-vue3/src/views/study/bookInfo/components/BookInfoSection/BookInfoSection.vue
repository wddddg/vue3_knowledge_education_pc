<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer"  :isDetail="true" title="章节管理" >
    <a-row  type="flex" :gutter="10" class="pageDrawer" :justify="'space-around'">
      <a-col :xl="10" :lg="24" :md="24" style="margin: 20px 0 20px 5px;background: #fff;">
        <BookInfoSectionTree ref="leftTree" @select="onTreeSelect" @rootTreeData="onRootTreeData" @setNode="setNode" @resetForm="resetForm" :pageData="pageData" :recordId="recordId"/>
      </a-col>
      <a-col :xl="13" :lg="24" :md="24" style="margin: 20px 0">
        <div style="height: 100%; background-color: white">
          <div style="padding: 20px">
            <BookInfoSectionForm ref="rightForm" :data="departData" :rootTreeData="rootTreeData" @success="onSuccess" />
          </div>
          <!-- <div v-show="departData == null" style="padding-top: 40px">
            <a-empty description="尚未选择部门" />
          </div> -->
        </div>
      </a-col>
    </a-row>
  </BasicDrawer>
</template>

<script lang="ts" setup name="BookInfoSection">
  import { provide, reactive, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicDrawer,useDrawerInner  } from '/@/components/Drawer';
  import BookInfoSectionTree from './BookInfoSectionTree.vue';
  import BookInfoSectionForm from './BookInfoSectionForm.vue';
  const { prefixCls } = useDesign('depart-manage');
  let pageData = reactive({})
  let recordId = ref("")

  provide('prefixCls', prefixCls);
  provide("recordId", recordId);
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    pageData = data;
    recordId.value = data.record.id;
  });
  // 给子组件定义一个ref变量
  const leftTree = ref();
  const rightForm = ref();

  // 当前选中的部门信息
  const departData = ref({});
  const rootTreeData = ref<any[]>([]);

  // 左侧树选择后触发
  function onTreeSelect(data) {
    departData.value = data;
    console.log(data,'data')
  }

  // 左侧树rootTreeData触发
  function onRootTreeData(data) {
    rootTreeData.value = data;
  }

  function onSuccess() {
    leftTree.value.loadRootTreeData();
  }
  function setNode() {
    rightForm.value.clearNode();
  }
  function resetForm() {
    rightForm.value.onReset();
  }
</script>

<style lang="less">
  // @import './index.less';
  .pageDrawer{
    background: #f0f2f5;
  }
</style>
