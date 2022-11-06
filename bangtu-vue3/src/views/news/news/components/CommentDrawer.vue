<template>
  <BasicDrawer :isDetail="true" v-bind="$attrs" :title="title" @register="registerDrawer">
    <div>
      <BasicTable :rowSelection="rowSelection" @register="registerTable" :searchInfo="searchInfo" @expand="handleExpand" @fetch-success="onFetchSuccess">
        <template #tableTitle>
          <a-button type="primary" @click="handleAdd">添加评论</a-button>
          <a-button type="primary" @click="batchHandleDelete">批量删除</a-button>
        </template>
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" />
        </template>
      </BasicTable>
    </div>
    <AddCommentDrawer @register="registerDrawerComment" @success="handleSuccess" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useDrawer, BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { commentColumns } from '../NewsInfo.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AddCommentDrawer from './AddCommentDrawer.vue';
  import { getCommentList, commentDeleteBatch, commentDeleteOne, getChildList } from '../NewsInfo.api';

  //注册drawer
  // const [registerDrawerComment, { openDrawer: openDrawerComment }] = useDrawer();
  const [registerDrawerComment, { openModal: openDrawerComment }] = useModal();
  const { createMessage } = useMessage();

  const searchInfo = { newsId: '' };
  const expandedRowKeys = ref([]);

  // 列表页面公共参数、方法
  const { tableContext: tableContext1 } = useListPage({
    tableProps: {
      title: '分类字典',
      rowKey: 'id',
      api: getCommentList,
      columns: commentColumns,
      canResize: false,
      expandRowByClick: true,
      useSearchForm: false,
      actionColumn: {
        width: 180,
      },
    },
  });
  //注册table数据
  const [registerTable, { reload, collapseAll, updateTableDataRecord, findTableDataRecord, getDataSource }, { rowSelection, selectedRowKeys }] = tableContext1;

  // 打开弹出框
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    searchInfo.newsId = data.record?.id;
    handleSuccess();
    setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
  });

  //设置标题
  const title = computed(() => '评论管理');

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    if (selectedRowKeys.value.length === 0) {
      createMessage.info('请选中需要删除的数据！');
      return;
    }
    await commentDeleteBatch({ ids: selectedRowKeys.value.toString() }, handleSuccess);
  }

  /**
   * 接口请求成功后回调
   */
  function onFetchSuccess(result) {
    getDataByResult(result.items);
    // getDataByResult(result.items) && loadDataByExpandedRows();
  }
  /**
   * 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
   */
  async function loadDataByExpandedRows() {
    if (unref(expandedRowKeys).length > 0) {
      const res = await getChildList({ parentId: unref(expandedRowKeys).join(',') });
      if (res.success && res.result.records.length > 0) {
        //已展开的数据批量子节点
        let records = res.result.records;
        const listMap = new Map();
        for (let item of records) {
          let pid = item['parentId'];
          if (unref(expandedRowKeys).includes(pid)) {
            let mapList = listMap.get(pid);
            if (mapList == null) {
              mapList = [];
            }
            mapList.push(item);
            listMap.set(pid, mapList);
          }
        }
        let childrenMap = listMap;
        let fn = (list) => {
          if (list) {
            list.forEach((data) => {
              if (unref(expandedRowKeys).includes(data.id)) {
                data.children = getDataByResult(childrenMap.get(data.id));
                fn(data.children);
              }
            });
          }
        };
        fn(getDataSource());
      }
    }
  }
  /**
   * 添加下级
   */
  function handleAddSub(record) {
    openDrawerComment(true, {
      newsId: searchInfo.newsId,
      record,
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 处理数据集
   */
  function getDataByResult(result) {
    if (result && result.length > 0) {
      return result.map((item) => {
        //判断是否标记了带有子节点
        if (item.isChild == '1') {
          let loadChild = { id: item.id + '_loadChild', name: 'loading...', isLoading: true };
          item.children = [loadChild];
        }
        return item;
      });
    }
  }
  /**
   *树节点展开合并
   * */
  async function handleExpand(expanded, record) {
    // 判断是否是展开状态，展开状态(expanded)并且存在子集(children)并且未加载过(isLoading)的就去查询子节点数据
    if (expanded) {
      expandedRowKeys.value.push(record.id);
      if (record.children.length > 0 && !!record.children[0].isLoading) {
        let result = await getChildList({ parentId: record.id });
        if (result && result.length > 0) {
          record.children = getDataByResult(result);
        } else {
          record.children = null;
          record.isChild = '0';
        }
      }
    } else {
      let keyIndex = expandedRowKeys.value.indexOf(record.id);
      if (keyIndex >= 0) {
        expandedRowKeys.value.splice(keyIndex, 1);
      }
    }
  }
  /**
   *操作表格后处理树节点展开合并
   * */
  async function expandTreeNode(key) {
    let record = findTableDataRecord(key);
    expandedRowKeys.value.push(key);
    let result: any = await getChildList({ parentId: key });
    if (result && result.length > 0) {
      record.children = getDataByResult(result);
    } else {
      record.children = null;
      record.isChild = '0';
    }
    updateTableDataRecord(key, record);
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await commentDeleteOne({ id: record.id }, handleSuccess);
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    openDrawerComment(true, {
      newsId: searchInfo.newsId,
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openDrawerComment(true, {
      newsId: searchInfo.newsId,
      record,
      isUpdate: true,
      showFooter: true,
    });
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
        label: '删除',
        onClick: handleDelete.bind(null, record),
      },
      {
        label: '添加下级',
        onClick: handleAddSub.bind(null, record),
      },
    ];
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    ((selectedRowKeys.value = []), (expandedRowKeys.value = [])) && reload();
  }
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
