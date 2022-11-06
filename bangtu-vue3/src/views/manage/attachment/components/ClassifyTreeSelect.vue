<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
      <!-- <div class="j-table-operator" style="width: 100%">
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="onAddGroup">新增</a-button>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="onAddChildGroup()">添加下级</a-button>
     </div> -->
    <a-spin :spinning="loading">
        <!--组织机构树-->
        <BasicTree
          v-if="!treeReloading"
          title="分类列表"
          toolbar
          :replaceFields="replaceFields"
          showLine
          :checkStrictly="true"
          :clickRowToExpand="false"
          :treeData="treeData"
          :selectedKeys="selectedKeys"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          @select="onSelect"
          @expand="onExpand"
        />
    </a-spin>
    <AttachmentClassifyModal @register="registerModal" @success="handleSuccess"></AttachmentClassifyModal>
  </div>
</template>

<script lang="ts" setup name="classify-tree" >
  import { inject, nextTick, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTree } from '/@/components/Tree';
  import { list } from '../AttachmentClassify.api';
  import {useModal} from '/@/components/Modal';
  import AttachmentClassifyModal from './AttachmentClassifyModal.vue';


  //注册model
  const [registerModal, {openModal}] = useModal();

  const prefixCls = inject('prefixCls');
  const emit = defineEmits(['select']);
  const { createMessage } = useMessage();

  let loading = ref<boolean>(false);
  // 部门树列表数据
  let treeData = ref<any[]>([]);
  // 当前展开的项
  let expandedKeys = ref<any[]>([]);
  // 当前选中的项
  let selectedKeys = ref<any[]>([]);

  // 当前选中的分类
  const currentGroup = ref<any>(null);

  const replaceFields = ref<any>({key:'id', title:'name', children:'attachmentClassifyVOList'});
  // 是否自动展开父级
  let autoExpandParent = ref<boolean>(true);
  // 树组件重新加载
  let treeReloading = ref<boolean>(false);

  // 加载部门信息
  function loadDepartTreeData() {
    loading.value = true;
    treeData.value = [];
    const param = {pageNo:1, pageSize:100};
    list(param).then((res) => {
          if (Array.isArray(res.records)) {
            treeData.value = res.records;
            autoExpandParentNode();
          }

      })
      .finally(() => (loading.value = false));
  }

  loadDepartTreeData();

  // 自动展开父节点，只展开一级
  function autoExpandParentNode() {
    let keys: Array<any> = [];
    treeData.value.forEach((item, index) => {
      if (item.children && item.children.length > 0) {
        keys.push(item.key);
      }
      if (index === 0) {
        // 默认选中第一个
        //setSelectedKey(item.id, item);
      }
    });
    if (keys.length > 0) {
      reloadTree();
      expandedKeys.value = keys;
    }
  }

  // 重新加载树组件，防止无法默认展开数据
  async function reloadTree() {
    await nextTick();
    treeReloading.value = true;
    await nextTick();
    treeReloading.value = false;
  }

  /**
   * 设置当前选中的行
   */
  function setSelectedKey(key: string, data?: object) {
    selectedKeys.value = [key];
    if (data) {
      currentGroup.value = data;
      emit('select', data);
    }
  }


  // 树选择事件
  function onSelect(selKeys, event) {
    if (selKeys.length > 0 && selectedKeys.value[0] !== selKeys[0]) {
      setSelectedKey(selKeys[0], event.selectedNodes[0].props);
    } else {
      // 这样可以防止用户取消选择
      setSelectedKey(selectedKeys.value[0]);
    }
  }

  // 树展开事件
  function onExpand(keys) {
    expandedKeys.value = keys;
    autoExpandParent.value = false;
  }



  // 添加一级部门
  function onAddGroup() {
    openModal(true, { isUpdate: false, isChild: false, showFooter: true});
  }

  // 添加子级部门
  function onAddChildGroup(data = currentGroup.value) {
    if (data == null) {
      createMessage.warning('请先选择一个分组');
      return;
    }
    openModal(true, { isUpdate: false, isChild: true, showFooter: true, parentId: data.id });
  }

  /**
   * 成功回调
   */
 function handleSuccess() {
     loadDepartTreeData();
  }


</script>
