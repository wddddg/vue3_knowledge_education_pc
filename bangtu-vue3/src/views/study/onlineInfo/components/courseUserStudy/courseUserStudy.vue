<template>
  <BasicDrawer @register="registerBaseDrawer" title="阅读统计" :isDetail="true" width="1300" destroyOnClose>
    <a-card>
      <div>
        <div class="c-right">
          <div class="rt-top">
            <div class="title-tip1"></div>
            <div class="top-tie">
              <a-radio-group v-model:value="queryType" @change="onChange">
                <a-radio-button :value="1">本月</a-radio-button>
                <a-radio-button :value="2">本年</a-radio-button>
              </a-radio-group>
              <a-range-picker v-model:value="times" format="YYYY-MM-DD" style="width: 240px" @change="onChange" />
            </div>
          </div>
          <!-- <div>
            <div ref="chartRef" :style="{ width, height }"></div>
          </div> -->
        </div>
        <LineMulti :chartData="barMultiData" height="50vh" :option="multiBarOption" type="line" />
      </div>
    </a-card>
   <div class="study_time" >
      <a-row justify="space-around">
        <a-col :span="5" class="study_itme">
          <div class="study_text">
            <div>课程总时长</div>
            <div style="font-size:30px">{{studyConunt.courseTimeCount}}</div>
          </div>
        </a-col>
        <a-col :span="5" class="study_itme">
          <div class="study_text">
            <div>总学习人数</div>
            <div style="font-size:30px">{{studyConunt.totalCount}}</div>
          </div>
        </a-col>
        <a-col :span="5" class="study_itme">
          <div class="study_text">
            <div>未学习</div>
            <div style="font-size:30px">{{studyConunt.noStudyTotalCount}}</div>
          </div>
        </a-col>
        <a-col :span="5" class="study_itme">
          <div class="study_text">
            <div>已完成</div>
            <div style="font-size:30px">{{studyConunt.completeStudyTotalCount}}</div>
          </div>
        </a-col>
      </a-row>
    </div>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <a-button type="primary" @click="onExportXls"> 导出记录</a-button>
        <!-- <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->

        <!-- <a-dropdown v-if="checkedKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="bx:bx-unlink" />
                取消关联
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="ant-design:down-outlined" />
          </a-button>
        </a-dropdown> -->
      </template>
      <!-- <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template> -->
    </BasicTable>
    <!--用户操作抽屉-->
    <!-- <UserDrawer @register="registerDrawer" @success="handleSuccess" /> -->
    <!--用户选择弹窗-->
    <!-- <UseSelectModal @register="registerModal" @select="selectOk" /> -->
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, defineProps, watch, unref,watchEffect,toRefs } from 'vue';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { BasicDrawer, useDrawer, useDrawerInner } from '/src/components/Drawer';
  import { useModal } from '/src/components/Modal';
  // import UserDrawer from '../../user/UserDrawer.vue';
  // import UseSelectModal from './UseSelectModal.vue';
  import { courseUserStudy,listForReport,getCourseStatistics,getExportUrl  } from '../../courseInfo.api';
  import { userColumns, searchUserFormSchema, getData } from './courseUserStudy.data';
  import LineMulti from '/@/components/chart/LineMulti.vue';
  // import { getUserRoles } from '../../user/user.api';
  import { useListPage } from '/@/hooks/system/useListPage';

  const multiBarOption = {
    title: { text: '基本统计', left: 'center' },
  };
  // const { barDataSource, barMultiData, pieData, barLineData, radarData } = getData;
  // console.log(barMultiData, 'barMultiData');
  let barMultiData = ref([])
  let queryType = ref('1')
  let startTime = ''
  let endTime = ''
  let times = ref([])
  let parem = {
    queryType: queryType.value,
    courseId:''
  }

  const emit = defineEmits(['register', 'hideUserList']);
  const checkedKeys = ref<Array<string | number>>([]);
  const roleId = ref('');

  function bookUserStudyReport(data){
    listForReport(data).then(res=>{
      barMultiData.value = []
      res[0].forEach((item)=>{
        let param = {}
        param.name = item.x
        param.value = item.y
        param.type= '访问量'
        barMultiData.value.push(param)
      })
      res[1].forEach((item)=>{
        let param = {}
        param.name = item.x
        param.value = item.y
        param.type= '学习量'
        barMultiData.value.push(param)
      })
    }) 
  }

  let studyConunt = ref({})
  function CourseStatistics(data){
    getCourseStatistics(data).then(res=>{
        
        studyConunt.value = res
        toRefs(studyConunt)
    }) 
  }

  const [registerBaseDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    roleId.value = data.record.id;
    setProps({ searchInfo: { courseId: data.record.id } });
    reload();
    parem.courseId = data.record.id
    bookUserStudyReport(parem)
    CourseStatistics({ id: data.record.id,queryType:'1' })
  });

  watchEffect(() => {
    console.log(queryType.value)
    console.log(times.value)
    if(times.value.length!=0){
      startTime = times.value[0].format("YYYY-MM-DD")+ ' 00:00:00'
      endTime = times.value[1].format("YYYY-MM-DD")+ ' 23:59:59'
    }else{
      startTime = null
      endTime = null
    }
    console.log(startTime,endTime)
    let param = {}
    param.queryType = queryType.value
    param.startTime = startTime
    param.endTime = endTime
    param.courseId = roleId.value
    bookUserStudyReport(param)
  });

  // 列表页面公共参数、方法
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '用户列表',
      api: courseUserStudy,
      columns: userColumns,
      formConfig: {
        labelWidth: 120,
        schemas: searchUserFormSchema,
        autoSubmitOnEnter: true,
        actionColOptions: { pull: 1 },
      },
      striped: true,
      useSearchForm: true,
      showTableSetting: true,
      clickToRowSelect: false,
      bordered: true,
      showIndexColumn: false,
      tableSetting: { fullScreen: true },
      canResize: false,
      rowKey: 'id',
    },
    exportConfig: {
      name: '学习统计详情',
      url: getExportUrl,
    },
  });
  const [registerTable, { reload, updateTableDataRecord, setProps }] = tableContext

  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();
  //注册drawer
  const [registerModal, { openModal }] = useModal();
  // const [registerTable, { reload, updateTableDataRecord, setProps }] = useTable({
  //   title: '用户列表',
  //   api: courseUserStudy,
  //   columns: userColumns,
  //   formConfig: {
  //     labelWidth: 120,
  //     schemas: searchUserFormSchema,
  //     autoSubmitOnEnter: true,
  //     actionColOptions: { pull: 1 },
  //   },
  //   striped: true,
  //   useSearchForm: true,
  //   showTableSetting: true,
  //   clickToRowSelect: false,
  //   bordered: true,
  //   showIndexColumn: false,
  //   tableSetting: { fullScreen: true },
  //   canResize: false,
  //   rowKey: 'id',
  //   // actionColumn: {
  //   //   width: 180,
  //   //   title: '操作',
  //   //   dataIndex: 'action',
  //   //   slots: { customRender: 'action' },
  //   //   fixed: undefined,
  //   // },
  // });

  /**
   * 选择列配置
   */
  const rowSelection = {
    type: 'checkbox',
    columnWidth: 50,
    selectedRowKeys: checkedKeys,
    onChange: onSelectChange,
  };

  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[], selectionRows) {
    checkedKeys.value = selectedRowKeys;
  }

  /**
   * 新增
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
      selectedroles: [roleId.value],
      isRole: true,
    });
  }
  /**
   * 编辑
   */
  async function handleEdit(record: Recordable) {
    try {
      const userRoles = await getUserRoles({ userid: record.id });
      if (userRoles && userRoles.length > 0) {
        record.selectedroles = userRoles;
      }
    } catch (e) {
      console.log(e);
    }
    openDrawer(true, {
      record,
      isUpdate: true,
      isRole: true,
    });
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteUserRole({ userId: record.id, roleId: roleId.value }, reload);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDeleteUserRole({ userIds: checkedKeys.value.join(','), roleId: roleId.value }, reload);
  }

  /**
   * 成功回调
   */
  function handleSuccess({ isUpdate, values }) {
    isUpdate ? updateTableDataRecord(values.id, values) : reload();
  }
  /**
   * 选择已有用户
   */
  function handleSelect() {
    openModal(true);
  }
  /**
   * 添加已有用户
   */
  async function selectOk(val) {
    await addUserRole({ roleId: roleId.value, userIdList: val }, reload);
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '取消关联',
        popConfirm: {
          title: '是否确认取消关联',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }
</script>
<style lang="less" scoped>
  .c-right {
    width: 84%;
  }

  .title-tip {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 28px;
      background: #2c6afd;
      margin-right: 14px;
    }
  }

  .rt-top {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-tip1 {
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      position: relative;
    }
  }
  .study_time {
    .study_itme{
      border: 1px #ccc solid ;
      height: 130px;
      text-align: center;
      background: linear-gradient(90deg, #9bdbff, #c0ecee, #5deefe);
    }
    .study_text{
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      color: #3b7a95;
      font-weight: bold;
    }
  }
</style>
