<template>
  <BasicDrawer @register="registerBaseDrawer" title="评论答疑" :isDetail="true"  destroyOnClose>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleCreate"> 新增用户</a-button> -->
        <!-- <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->
        <a-dropdown v-if="checkedKeys.length > 0">
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
        </a-dropdown>
        <div style="margin-left:100px;display:flex;align-items: center;">
          <span>评分:</span> 
          <span style="color:red;font-size:26px;margin-left:10px">{{score}}</span>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <a-modal v-model:visible="visible" title="回复" @ok="handleOk" >
        <div style="padding:0 20px">
         <a-textarea  v-model:value="value" showCount  :rows="10" />
        </div>
    </a-modal>
    <!--用户操作抽屉-->
    <!-- <UserDrawer @register="registerDrawer" @success="handleSuccess" /> -->
    <!--用户选择弹窗-->
    <!-- <UseSelectModal @register="registerModal" @select="selectOk" /> -->
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, defineProps, watch, unref,provide,toRefs } from 'vue';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { BasicDrawer, useDrawer, useDrawerInner } from '/src/components/Drawer';
  import { useModal } from '/src/components/Modal';
  // import UserDrawer from '../../user/UserDrawer.vue';
  // import UseSelectModal from './UseSelectModal.vue';
  import { list, deleteOne, batchDelete ,saveOrUpdate,getCourseScore } from './courseComment.api';
  import { columns, searchFormSchema } from './courseComment.data';
  // import { getUserRoles } from '../../user/user.api';

  // const emit = defineEmits(['register', 'hideUserList']);
  const checkedKeys = ref<Array<string | number>>([]);
  const roleId = ref('');
  let visible = ref(false)
  let value = ref()
  let score = ref('')
  // const [registerBaseDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
  //   roleId.value = data.id;
  //   setProps({ searchInfo: { roleId: data.id } });
  //   reload();
  // });
  // 注册抽屉
  const [registerFormDrawe, { openDrawer: openFormDrawe }] = useDrawer();
 // Emits声明
    const emit = defineEmits(['register','success']);
    //组件参数
    let isUpdate = ref()
    let id = ref()
    let isEdit = ref(false)
    let typeTo = ref(false)
    let setFormData = ref({})
    provide('isUpdate',isUpdate)
    provide('isEdit',isEdit)
    provide('typeTo',typeTo)
    provide('setFormData',setFormData)
    const [registerBaseDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      roleId.value = data.id;
      setProps({ searchInfo: { courseId: data.id } });
      reload();
      isUpdate.value = data.isUpdate
      id.value = data.id
      isEdit.value = data.isEdit
      typeTo.value = data.typeTo
      console.log(data,'data')
      let parem = {
        id:id.value
      }
      if(isUpdate.value){
        
        byId(parem).then(res =>{
          setFormData.value = res
          toRefs(setFormData)
        })
      }
      getCourseScore(parem).then(res=>{
        score.value = res.score
      })
    });
  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();
  //注册drawer
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, updateTableDataRecord, setProps }] = useTable({
    title: '用户列表',
    api: list,
    columns: columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      actionColOptions: { pull: 1 },
      fieldMapToTime: [
        ['datetime', ['createTime', 'updateTime'], 'YYYY-MM-DD HH:mm:ss']
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
    actionColumn: {
      width: 180,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

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
  let selectId = ''
  /**
   * 回复
   */
  async function handleEdit(record: Recordable) {
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
    if(record.replyContent){
      return
    }
    visible.value = true
    selectId = record.id
  }
  
  function handleOk(){
    let param = {
      replyContent:value.value,
      id:selectId
    }
    saveOrUpdate(param,true)
    reload()
    visible.value = false
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
    return [
      {
        label: record.replyContent?'回复':'回复',
        color: record.replyContent?'error':'success',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }
</script>
