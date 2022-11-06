<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer"  :isDetail="true" title="章节管理" @close="onCloseBut">
    <a-row>
      <a-col :xs="5" class="class_hours_img">
        <div class="imgStyleo">
          <field-time-outlined />
        </div>
        <div class="class_hours_text">
          <div style="font-size:12px; color: rgb(152, 152, 152);" >课程时长</div>
          <div style="font-size:20px">{{ time }}</div>
        </div>
      </a-col>
      <a-col :span="3" class="class_hours_img">
        <div class="imgStylet">
          <inbox-outlined />
        </div>
        <div class="class_hours_text">
          <div style="font-size:12px; color: rgb(152, 152, 152);" >课时数量</div>
          <div style="font-size:20px">{{ lassHours }}课时</div>
        </div>
      </a-col>
    </a-row>
    <a-row  type="flex" :gutter="10" class="pageDrawer" :justify="'space-around'">
      <a-col :xl="7" :lg="24" :md="24" style="margin: 20px 0 20px 5px;background: #fff;">
        <SectionTree ref="leftTree" @select="onTreeSelect" @rootTreeData="onRootTreeData" @setNode="setNode" @resetForm="resetForm" :pageData="pageData" :recordId="recordId"/>
      </a-col>
      <a-col :xl="16" :lg="24" :md="24" style="margin: 20px 0">
        <div style="height: 100%; background-color: white">
          <div style="padding: 20px">
            <SectionForm ref="rightForm" :data="departData" :rootTreeData="rootTreeData" @success="onSuccess" :showCurrent="current" />
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
  import SectionTree from './SectionTree.vue';
  import SectionForm from './SectionForm.vue';
  import { InboxOutlined,FieldTimeOutlined } from '@ant-design/icons-vue'
  import { queryCourseById } from '../../courseInfo.api';
  
  const { prefixCls } = useDesign('depart-manage');
  let pageData = reactive({})
  let recordId = ref("")
  const lassHours = ref(0)
  const time = ref('')
  const current = ref(0)

  provide('prefixCls', prefixCls);
  provide("recordId", recordId);
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    pageData = data;
    recordId.value = data.record.id;
    queryCourseById({id:data.record.id}).then(res=>{
      lassHours.value = res.courseSectionCount
      time.value = res.courseTimeCount
    })
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
    current.value = 0
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
  function resetForm(value) {
    rightForm.value.onReset(value);
  }
  function onCloseBut(){
    resetForm(true)
    current.value = 1
  }
</script>

<style lang="less">
  // @import './index.less';
  .pageDrawer{
    background: #f0f2f5;
  }
  .class_hours_img{
    text-align: center;
    display: flex;
    margin: 0px 10px 10px;
    align-items: center;
    .imgStyleo{
      background-color: rgb(255,216,110);
      color: #fff;
      border-radius: 50%;
      line-height: 35px;
      margin: 10px;
      font-size: 35px;
      padding: 10px;
    }
    .imgStylet{
      background-color: rgb(243,133,124);
      color: #fff;
      border-radius: 50%;
      line-height: 35px;
      margin: 10px;
      font-size: 35px;
      padding: 10px;
    }
    .class_hours_text{
      text-align: left;
    }
  }
</style>
