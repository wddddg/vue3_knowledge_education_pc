<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 上传素材</a-button>
        <div style="color:#ce2f2f;font-size:16px;margin-right:15px"> 必看！"上传素材"点击"确认"按钮三秒后会自动关闭上传框，一段时间后"点击刷新"查看文件即可。 </div>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <AttachmentInfoModal @register="registerModal" @success="handleSuccess" />
    <!-- 编辑表单区域 -->
    <AttachmentInfoEditModal @register="registerEditModal" @success="handleSuccess" />
    <ChakInfo @register="registerChakInfoModal"></ChakInfo>
  </div>
</template>

<script lang="ts" name="AttachmentInfoListTab" setup>
  import { ref, computed, unref, provide, watch } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import AttachmentInfoModal from './AttachmentInfoModal.vue';
  import AttachmentInfoEditModal from './AttachmentInfoEditModal.vue';
  import ClassifyTree from '../ClassifyTree.vue';
  import { columns, searchFormSchema } from '../AttachmentInfo.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from '../AttachmentInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import ChakInfo from './ChakInfo.vue'

  const { prefixClsTree } = useDesign('attachmentinfo');
  provide('prefixClsTree', prefixClsTree);
  const props = defineProps({
    data: { require: true, type: Object },
    fileType: { require: true, type: String },
  });
  // const fileType = defineProps({
  //   fileType: { require: true, type: String },
  // });

  const oneCateId = computed(() => props.data?.oneCateId);
  const twoCateId = computed(() => props.data?.twoCateId);
  const parentName = computed(() => props.data?.name);
  const fileType = computed(() => props.fileType);

  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册editmodel
  const [registerEditModal, { openModal: openEditModal }] = useModal();
  // 注册查看modal
  const [registerChakInfoModal, {openModal: openChakInfoModal}] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '素材管理表',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      // 请求之前对参数做处理
      beforeFetch(params) {
        params.oneCateId = oneCateId.value;
        params.twoCateId = twoCateId.value;
        if (fileType.value != '0') {
          params.fileType = fileType.value;
        } else {
          params.fileType = '';
        }
      },
      actionColumn: {
        width: 150,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '附件管理表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  watch(
    () => [props.data, props.fileType],
    ([newData, newFileType], [oldData, oldFileType]) => {
      reload();
    }
  );

  /**
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
      showFooter: true,
      record: { twoCateId: twoCateId, oneCateId: oneCateId, parentName: parentName },
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openEditModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 查看
   */
  function handleDetail(record: Recordable) {
    if(record.fileType === 4) return open(record.fileUrl)
    openChakInfoModal(true, {
      record,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    (selectedRowKeys.value = []) && reload();
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
        label: '查看',
        onClick: handleDetail.bind(null, record),
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
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      // {
      //   label: '详情',
      //   onClick: handleDetail.bind(null, record),
      // }, {
      //   label: '删除',
      //   popConfirm: {
      //     title: '是否确认删除',
      //     confirm: handleDelete.bind(null, record),
      //   }
      // }
    ];
  }

  // 当前选中的部门信息
  let departData = ref({});

  // // 左侧树选择后触发
  // function onTreeSelect(data) {
  //   departData.value = data;
  // }
</script>

<style lang="less">
  @import '../index.less';
</style>
