<template>
  <div>
    <!--引用表格-->
   <BasicTable ref="basicTable" @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys" @expand="handleExpand"  @fetch-success="onFetchSuccess"> 
     <!--插槽:table标题-->
      <template #tableTitle>
          <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
          <a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
          <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>
          <!-- <a-button type="primary" preIcon="ic:round-expand" @click="expandAll">展开全部</a-button>
          <a-button type="primary" preIcon="ic:round-compress" @click="collapseAll">折叠全部</a-button> -->
          <a-dropdown v-if="selectedRowKeys.length > 0">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="batchHandleDelete">
                    <Icon icon="ant-design:delete-outlined"></Icon>
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>批量操作
                <Icon icon="mdi:chevron-down"></Icon>
              </a-button>
        </a-dropdown>
      </template>
       <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{text}">
         <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{text}">
         {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{text}">
         <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
         <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <SystemQuestionsChapterModal @register="registerModal" @success="handleSuccess"></SystemQuestionsChapterModal>
  </div>
</template>

<script lang="ts" name="systemQuestionsChapter-systemQuestionsChapter" setup>
  import {ref, computed, unref, toRaw, nextTick } from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {useModal} from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  import SystemQuestionsChapterModal from './components/SystemQuestionsChapterModal.vue'
  import {columns, searchFormSchema} from './SystemQuestionsChapter.data';
  import {list, deleteOne, batchDelete, getImportUrl,getExportUrl,getChildList,getChildListBatch} from './SystemQuestionsChapter.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  const checkedKeys = ref<Array<string | number>>([]);
  const expandedRowKeys = ref([]);
  const basicTable = ref();
  //注册model
  const [registerModal, {openModal}] = useModal();
  //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '题库章节',
           api: list,
           columns,
           canResize:false,
           formConfig: {
              labelWidth: 120,
              schemas: searchFormSchema,
              autoSubmitOnEnter:true,
              showAdvancedButton:true,
              fieldMapToNumber: [
              ],
              fieldMapToTime: [
              ],
            },
           actionColumn: {
               width: 120,
               fixed:'right'
            },
      },
       exportConfig: {
            name:"题库章节",
            url: getExportUrl,
          },
          importConfig: {
            url: getImportUrl,
            success: handleSuccess
          },
  })

  const [registerTable, {reload,collapseAll, updateTableDataRecord, findTableDataRecord, getDataSource,expandAll},{ rowSelection, selectedRowKeys }] = tableContext


  /**
   * 接口请求成功后回调
   */
  function onFetchSuccess(result) {
    getDataByResult(result.items)&&loadDataByExpandedRows()
  }
  /**
   * 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
   */
  async function loadDataByExpandedRows() {
    if (unref(expandedRowKeys).length > 0) {
      const res = await getChildListBatch({ parentIds: unref(expandedRowKeys).join(',') });
      if (res.success && res.result.records.length > 0) {
        //已展开的数据批量子节点
        let records = res.result.records;
        const listMap = new Map();
        for (let item of records) {
        // debugger
          let pid = item['pid'];
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
  let hasChildrenField ="hasChild"
    /**
   * 处理数据集
   */
  function getDataByResult(result) {
    if (result && result.length > 0) {
      return result.map((item) => {
        //判断是否标记了带有子节点
        if (item[hasChildrenField]=='1') {
          let loadChild = { id: item.id + '_loadChild', name: 'loading...', isLoading: true };
          item.children = [loadChild];
          // item['hasChild'] = '1';
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
        let result = await getChildList({ pid: record.id });
        // result = result.records ? result.records : result;
        if (result && result.records.length > 0) {
          record.children = result.records;//.getDataByResult(result);
        } else {
          record.children = null;
          record.hasChild = '0';
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
    let result = await getChildList({ key: key });
    if (result && result.length > 0) {
      record.children = getDataByResult(result);
    } else {
      record.children = null;
      record.hasChild = '0';
    }
    updateTableDataRecord(key, record);
  }
   /**
    * 新增事件
    */
  function handleAdd() {
     openModal(true, {
       isUpdate: false,
       showFooter: true,
     });
  }
   /**
    * 编辑事件
    */
  function handleEdit(record: Recordable) {
     openModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
   /**
    * 详情
   */
  function handleDetail(record: Recordable) {
     openModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
  /**
   * 添加下级
   */
  function handleAddSub(record) {
    openModal(true, {
      record,
      isUpdate: false,
      showFooter: true,
    });
  }
   /**
    * 删除事件
    */
  async function handleDelete(record) {
     await deleteOne({id: record.id}, deleteSuccess);
   }
   /**
    * 批量删除事件
    */
  async function batchHandleDelete() {
     await batchDelete({ids: selectedRowKeys.value}, deleteSuccess);
   }
  function deleteSuccess() {
    (selectedRowKeys.value = []) && reload();
  }
  function setDataSource(){
    debugger
    let data =  getDataSource()
    data.forEach(item=>{
      handleExpand(true,item)
    })
  }  
  /**
   * 成功回调
   */
  async function handleSuccess({ isUpdate, values, expandedArr, changeParent }) {
    (selectedRowKeys.value = []) &&reload();
    // setDataSource()
    // collapseAll()
    // basicTable.value.collapseAll()
    return
    if (isUpdate) {
      if (changeParent) {
        reload();
      } else {
        // 编辑回调
        updateTableDataRecord(values.id, values);
      }
    } else {
      if (values['pid']=="0"||!values['pid']) {
        //新增根节点
        reload();
      } else {
        //新增子集
        expandedRowKeys.value = [];
        for (let key of unref(expandedArr)) {
          await expandTreeNode(key);
        }
      }
    }
  }
   /**
      * 操作栏
      */
  function getTableAction(record){
       return [
         {
           label: '编辑',
           onClick: handleEdit.bind(null, record),
         }
       ]
   }
     /**
        * 下拉操作栏
        */
  function getDropDownAction(record){
      return [
          //  {
          //    label: '详情',
          //    onClick: handleDetail.bind(null, record),
          //  },
            {
             label: '删除',
             popConfirm: {
               title: '是否确认删除',
               confirm: handleDelete.bind(null, record),
             }
           },
            {
              label: '添加下级',
              onClick: handleAddSub.bind(null, { pid: record.id }),
              ifShow: () => record.pid == "0"
            },
      ]
   }
</script>

<style scoped>

</style>