<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer"  :isDetail="true" title="课程管理" @close="handleClose">
    <div>
      <a-row  type="flex" justify="center"  class="topReport">
        <a-col class="itme" :span="6">全部学员： {{topReportData.totalCount}}</a-col>
        <a-col class="itme" :span="6">今日增加： {{topReportData.todayCount}}</a-col>
        <a-col class="itme" :span="6">本周增加： {{topReportData.weekCount}}</a-col>
        <a-col class="itme" :span="6">本月增加： {{topReportData.monthCount}}</a-col>
        <a-col class="itme" :span="6">总课程数： {{topReportData.courseCount}}</a-col>
        <a-col class="itme" :span="6">总课时数： {{topReportData.courseSectionCount}}</a-col>
        <a-col class="itme" :span="6">今日学习： {{topReportData.todayStudyCount}}</a-col>
        <a-col class="itme" :span="6">老师数量： {{topReportData.teacherCount}}</a-col>
      </a-row>
    </div>
    <a-radio-group v-model:value="radioValue" style="margin-top:20px">
        <a-radio-button :value="true">学员管理</a-radio-button>
        <a-radio-button :value="false">排课表</a-radio-button>
    </a-radio-group>
    <courseClassStudentList v-if="radioValue"/>
    <coursePageList v-else/>
  </BasicDrawer>
</template>

<script lang="ts" name="courseInfoAdmin" setup >
  import { provide, reactive, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicDrawer,useDrawerInner  } from '/@/components/Drawer';
  import {getCourseClassReport} from './courseInfoAdmin.api'
  import BookInfoSectionTree from './BookInfoSectionTree.vue';
  import { toRefs } from '@vueuse/shared';
  import courseClassStudentList from './courseClassStudentList.vue';
  import coursePageList from './coursePageList.vue';
  const { prefixCls } = useDesign('depart-manage');
  let pageData = ref({})
  let topReportData = ref({})
  let recordId = ref("")
  let radioValue = ref(true)

  provide('prefixCls', prefixCls);
  provide("recordId", recordId);
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    pageData = data;
    recordId.value = data.record.id;
    let param = {
      id:data.record.id
    }
    await getCourseClassReport(param).then(res=>{
      console.log(res,'res')
      topReportData.value = res
    })
    radioValue.value = data.radioValue
  });
  
  const handleClose = () =>{
    radioValue.value = true
  }
</script>

<style lang="less">
  // @import './index.less';
  .topReport{
    background: #56D8A8;
    text-align: center;
    font-size: 20px;
    color: #fff;
  }
  .itme {
    height: 100px;
    line-height: 100px;
  }
</style>
