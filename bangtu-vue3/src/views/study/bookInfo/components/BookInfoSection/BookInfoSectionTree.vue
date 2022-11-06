<template>
  <div style="margin-top:20px">
    <a-button type="primary" @click="addSection">添加章</a-button>
    <a-button type="primary" style="margin-left:10px" @click="addNode">添加节</a-button>
    <a-button style="margin-left:10px" @click="onDelete">删除</a-button>
    <a-button style="margin-left:10px" @click="toggleExpandAll()">展开/折叠</a-button>
  </div>
  <a-card style="margin-top:20px">
    <BasicTree
      ref="basicTree"
      :expandedKeys="expandedKeys"
      :tree-data="sectionList"
      @select="onSelect"
      @expand="onExpand"
    >
    </BasicTree>
  </a-card>
  <a-modal v-model:visible="visible" title="添加章" @ok="handleOk">
    <BasicForm @register="registerForm" />
  </a-modal>
  <a-modal v-model:visible="visibleDelete" title="删除" @ok="handleOkDelete">
    <div style="margin-left:20px">确定删除选择中的章/节吗</div>
  </a-modal>
</template>

<script lang="ts" name="BookInfoSectionTree" setup>
  import { inject, nextTick, ref, unref, defineExpose,onMounted,watchEffect} from 'vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useMethods } from '/@/hooks/system/useMethods';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import {  getSectionList,bookByIdDelete  } from '../../BookInfo.api';
  import { searchByKeywords } from '/@/views/system/departUser/depart.user.api';
  import { Popconfirm } from 'ant-design-vue';
  import { useBasicFormSchema } from './BookInfoSection.data';
  import { setBookAddSection } from '../../BookInfo.api';
  import {Modal} from 'ant-design-vue';
  import { BasicTree } from '/@/components/Tree/index';

  const emit = defineEmits(['select', 'rootTreeData','setNode','resetForm']);
  //注册model
  const visible = ref<boolean>(false)
  const visibleDelete = ref<boolean>(false)
  const basicTree = ref();
  const pageData= inject('pageData')
  const recordId= inject('recordId')
  //弹窗添加章窗口
  const addSection = () => {
    visible.value = true;
  };
  const handleOk = async (e: MouseEvent) => {
    let values = await validate();
    values.bookId = recordId.value
    await setBookAddSection(values)
    visible.value = false;
    loadRootTreeData()
  };
  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    schemas: useBasicFormSchema().stctionFormSchema,
    showActionButtonGroup: false,
  });

  //添加节事件
  const addNode = () => {
      emit('setNode')
  };

  //删除弹窗框
  const onDelete = () => {
    if(!selectNode.value){
      const { createMessage } = useMessage()
      createMessage.error('请选择章/节')
      return
    }
    Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return bookByIdDelete(selectNode.value[0].props.id).then(res=>{
        loadRootTreeData()
      })
    }
  });
    // visibleDelete.value = true;
  };
  const handleOkDelete = async (e: MouseEvent) => {
    // let parem = {
    //   id:selectNode.value[0].props.id
    // }
    await bookByIdDelete(selectNode.value[0].props.id)
    visibleDelete.value = false;
    loadRootTreeData()
  };
  const expandedKeys = ref<Array<any>>([]);
  let isExpand = false
  // 切换展开收起
  async function toggleExpandAll(flag) {
    isExpand = !isExpand
    basicTree.value.expandAll(isExpand);
    await nextTick();
    // expandedKeys.value = basicTree.value.getExpandedKeys();
  }
  function onExpand($expandedKeys) {
    expandedKeys.value = $expandedKeys;
  }
  let sectionList = ref<any[]>([]);
  let oldSectionList = ref<any[]>([]);
  watchEffect(() => {
    sectionList.value = []
    if(recordId.value){
      getSectionList({bookId:recordId.value}).then(res =>{
        oldSectionList = res
        res.forEach((itme,i) => {
                let section = {}
                section.id = itme.id
                section.bookId = itme.bookId
                section.title = itme.name
                section.name = itme.name
                section.sort = itme.sort
                section.key = i + ''
                section.type = 'section'
                section.children = []
                itme.childBookSectionList?.forEach((even,c) => {
                  let node = {}
                  node.id = even.id
                  node.bookId = even.bookId
                  node.title = even.name
                  node.name = even.name
                  node.sort = even.sort
                  node.isTryLook = even.isTryLook
                  node.content = even.content
                  node.parentId = even.parentId
                  node.type = 'node'
                  node.key = i + '-' + c
                  section.children.push(node)
                })
                sectionList.value.push(section)
              });
      })
    }

  })

  //刷新树
  async function loadRootTreeData(){
    let parme = recordId.value
    recordId.value = ''
    recordId.value = parme

  }
  let selectNode = ref()
  //点击树节点事件
  function onSelect(key,e){
    selectNode.value = e.selectedNodes
    console.log(selectNode.value,'onSelect')
    if(e.selected){
      emit('select',e.selectedNodes[0].props)
    }else{
      selectNode.value = null
      emit('select',{})
      // emit('resetForm')
    }
  }
 onMounted(async()=>{

  })

</script>
