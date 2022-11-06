<template>
    <div style="margin: 20px 0  20px 0;font-size: 20px;font-weight:700">{{titleName}}</div>
    <a-Card>
      <template #title>
         <a-select
          v-model:value="studyType"
          show-search
          placeholder="请选择课程类型"
          style="width: 200px"
          :options="typeOptions"
          @change="handleChange"
        >
        </a-select>
      </template>
      <template #extra>
        <div class="top-tie">
          <a-radio-group v-model:value="queryType" >
            <a-radio-button :value="1">今天</a-radio-button>
            <a-radio-button :value="2">本周</a-radio-button>
            <a-radio-button :value="3">本月</a-radio-button>
          </a-radio-group>
          <a-range-picker v-model:value="times" format="YYYY-MM-DD HH:mm:ss" style="width: 240px" />
        </div>
      </template>
      <div>
          <template v-for="(item,i) in ReportList" :key="item.sex" >
            <div class="list">
              <div class="listItmteLeft">
                <div class="img" :style="{background:i<=2?'#f3bb48':'#cccccc'}">{{i+1}}</div>
                <div class="txt">{{item.name}}</div>
              </div>
              <div class="listItmteLeft">
                <EyeOutlined />
                <div style="margin-left: 5px;">{{item.count}}</div>
              </div>
            </div>
          </template>
          <a-empty v-if="!ReportList.length" />
      </div>
    </a-Card>

</template>
<script lang="ts" setup>
  import { Progress, Row, Col } from 'ant-design-vue';
  import { defineComponent,ref,toRefs,watchEffect,reactive } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { List } from 'ant-design-vue';
  import {listForReport,getReportList} from '../statistics.api'
  import {EyeOutlined} from '@ant-design/icons-vue';
  import moment from 'moment'
    let porps =  defineProps({
      URL:{
        type:String,
        default: ''
      },
      titleName:{
        type:String,
        default: ''
      }
    })
    let studyType = ref('1')
    let queryType = ref('1')
    let startTime = ''
    let endTime = ''
    let times = ref([])
    const typeOptions = ref([
      { value: '1', label: '线上课' },
      { value: '2', label: '直播课' },
      { value: '3', label: '面授课' },
      { value: '4', label: '班级课' },
      { value: '5', label: '书籍' },
      { value: '6', label: '知识库' },
    ])    

    let prefixCls =ref('list-basic')
    let pagination= ref({
      show: true,
      pageSize: 3,
    })


    let param = {
      queryType:queryType.value,
      studyType:studyType.value
    }
    watchEffect(() => {
      console.log(queryType.value)
      console.log(studyType.value)
      console.log(times.value)
      if(times.value.length!=0){
        startTime = times.value[0].format("YYYY-MM-DD HH:mm:ss")
        endTime = times.value[1].format("YYYY-MM-DD HH:mm:ss")
      }else{
        startTime = null
        endTime = null
      }
      console.log(startTime,endTime)
      param.queryType = queryType.value
      param.studyType = studyType.value
      param.startTime = startTime
      param.endTime = endTime
      getData()
    });

    let ReportList = ref([])
    function getData(){
      getReportList(porps.URL,param).then(res=>{
        ReportList.value = res
      })
    }
    getData()



</script>
<style lang="less" scoped>
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
  }
  .listItmteLeft {
    display: flex;
    justify-content: flex start;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 20px;
    .img{
      background: #cccccc;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 10px;
      color: #fff;
    }
    .txt{
      margin-left: 10px;
    }
  }
</style>
