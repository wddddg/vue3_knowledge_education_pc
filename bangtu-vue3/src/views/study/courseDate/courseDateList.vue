<template>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>

        <a-tabs type="card"  v-model:activeKey="activeKey" :defaultActiveKey="15" :style="{ width: '1500px' }">
          <a-tab-pane :key="itme.date" :tab="itme.date" v-for="(itme,i) in tabItem" ></a-tab-pane>
        </a-tabs>
        <!-- <a-button type="primary" @click="handleCreate"> 新增用户</a-button> -->
        <!-- <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->

        <!-- <a-dropdown v-if="checkedKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="bx:bx-unlink"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="ant-design:down-outlined"></Icon>
          </a-button>
        </a-dropdown> -->
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <!--用户操作抽屉-->
    <!-- <UserDrawer @register="registerDrawer" @success="handleSuccess" /> -->
    <!--用户选择弹窗-->
    <liveSetModal @register="registerModal" @success="handleSuccess" />
    <LiveTelecastModal @register="registeLiveTelecast" @success="handleSuccess"></LiveTelecastModal>
</template>
<script lang="ts" name='coursePageList' setup>
  import { ref, defineProps, watch, unref,provide,toRefs,inject,watchEffect,onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { BasicDrawer, useDrawer, useDrawerInner } from '/src/components/Drawer';
  import { useModal,BasicModal  } from '/src/components/Modal';
  // import UserDrawer from '../../user/UserDrawer.vue';
  import liveSetModal from './components/liveSetModal.vue';
  import { CoursePagelist, deleteOne, batchDelete, editLiveStatus  } from './courseDate.api';
  import { columnsPage, searchFormPageSchema } from './courseDate.data';
  import LiveTelecastModal from './components/liveTelecast/LiveTelecastModal.vue'
  // import { getUserRoles } from '../../user/user.api';
  import { useUserStore } from '/@/store/modules/user';
  let userInfo = useUserStore().userInfo;
  // const emit = defineEmits(['register', 'hideUserList']);
  const checkedKeys = ref<Array<string | number>>([]);
  const roleId = ref('');
 // Emits声明
    const emit = defineEmits(['register','success']);
    //组件参数
    let isUpdate = ref()
    let id = ref()
    let isEdit = ref(false)
    let typeTo = ref(false)
    let setFormData = ref({})
    let activeKey = ref(GetDateStr(0))
    provide('isUpdate',isUpdate)
    provide('isEdit',isEdit)
    provide('typeTo',typeTo)
    provide('setFormData',setFormData)
  const [registerModal, { openModal }] = useModal();
  const [registeLiveTelecast, { openModal:openLiveTelecast }] = useModal();

  const [registerTable, { reload, updateTableDataRecord, setProps }] = useTable({
    title: '用户列表',
    api: CoursePagelist,
    columns: columnsPage,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormPageSchema(userInfo),
      autoSubmitOnEnter: true,
      // actionColOptions: { pull: 1 },
      showAdvancedButton: userInfo.userRoleType != 2 ,
      fieldMapToTime: [
        // ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']
      ],
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
    searchInfo: { searchTime:activeKey },
    actionColumn: {
      width: 180,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    }
  });

	
  function  GetDateStr(AddDayCount) { 
      var  dd =  new  Date();
      dd.setDate(dd.getDate()+AddDayCount); //获取AddDayCount天后的日期
      var  y = dd.getFullYear(); 
      var  m = (dd.getMonth()+1)<10? "0" +(dd.getMonth()+1):(dd.getMonth()+1); //获取当前月份的日期，不足10补0
      var  d = dd.getDate()<10? "0" +dd.getDate():dd.getDate(); //获取当前几号，不足10补0
      return  y+ "-" +m+ "-" +d; 
  }
  let tabItem = ref([])
  for(let i=-15;i<15;i++){
    let itme = {}
    itme.key = i
    itme.date = GetDateStr(i)
    tabItem.value.push(itme)
  }
  watch(
    ()=>activeKey.value,
    ()=>{
      reload();
    }
  )
  
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
  function handleOpen(record: Recordable) {
    openLiveTelecast(true, {
      record
    });
  }
  /**
   * 回复
   */
  async function handleEdit(record: Recordable, type:String) {
    // try {
    //   const userRoles = await getUserRoles({ userid: record.id });
    //   if (userRoles && userRoles.length > 0) {
    //     record.selectedroles = userRoles;
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
    // openDrawer(true, {
    //   record,
    //   isUpdate: true,
    //   isRole: true,
    // });
    // try {
    //   editLiveStatus({})
    // } catch {

    // }
    let params = { ...record }
    if(type === 'stop'){
      params.liveStatus = 3
    }else if(type === 'end'){
      params.liveStatus = 2
    }
    await editLiveStatus(params,handleSuccess)
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ userId: record.id, roleId: roleId.value }, reload);
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ userIds: checkedKeys.value.join(','), roleId: roleId.value }, reload);
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
  // async function selectOk(val) {
  //   await addUserRole({ roleId: roleId.value, userIdList: val }, reload);
  // }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    if(record.sectionType === 3){
      return [
        {
          label: '开播',
          onClick: handleOpen.bind(null, record),
          disabled:record.liveStatus == 2
        },
        {
          label: '暂停',
          onClick: handleEdit.bind(null, record, 'stop'),
          disabled:record.liveStatus == 2
        },
        {
          label: '结束',
          onClick: handleEdit.bind(null, record, 'end'),
          disabled:record.liveStatus == 2
        },
      ];
    }else{
      return [
        {
          label: '点名',
          onClick: handleEdit.bind(null, record),
          disabled:!(record.liveStatus == 1)
        },
      ];
    }
    
  }
</script>
