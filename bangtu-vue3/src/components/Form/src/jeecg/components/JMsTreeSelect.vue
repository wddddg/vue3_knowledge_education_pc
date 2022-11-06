<template>
  <a-tree-select
    :allowClear="false" 
    :labelInValue="false"
    style="width: 100%"
    :getPopupContainer="(node) => node.parentNode"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    :placeholder="placeholder"
    :loadData="asyncLoadTreeData"
    :value="treeValue"
    :treeData="rootTreeData"
    :multiple="multiple"
    v-bind="attrs"
    @change="onChange"
    @search="onSearch"
    :treeDataSimpleMode="true"
  >
  </a-tree-select>
</template>
<script lang="ts" setup>
  /*
   * 异步树加载组件 通过传入表名 显示字段 存储字段 加载一个树控件
   * <j-tree-select dict="aa_tree_test,aad,id" pid-field="pid" ></j-tree-select>
   * */
  import { ref, watch, unref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { propTypes } from '/@/utils/propTypes';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { TreeSelect } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';



  enum Api {
    url = '/sys/dict/loadTreeData',
    view = '/system/systemCategory/queryById/',
    loadTreeRoot = '/system/systemCategory/rootList',
    loadTreeRootChild = '/system/systemCategory/childList',
  }

/**
 * 行业分类-加载一级节点（如果是同步则所有数据）
 * @param params
 */
  const loadTreeRoot = (params) => {
  return defHttp.get({ url: Api.loadTreeRoot, params });
};

/**
 * 行业分类-加载一级以后节点（如果是同步则所有数据）
 * @param params
 */
  const loadTreeRootChild = (params) => {
  return defHttp.get({ url: Api.loadTreeRootChild, params });
};

  const props = defineProps({
    value: propTypes.string.def(''),
    placeholder: propTypes.string.def('请选择'),
    dict: propTypes.string.def('id'),
    parentCode: propTypes.string.def(''),
    pidField: propTypes.string.def('pid'),
    //update-begin---author:wangshuai ---date:20220620  for：JTreeSelect组件pidValue还原成空，否则会影响自定义组件树示例------------
    pidValue: propTypes.string.def(''),
    //update-end---author:wangshuai ---date:20220620  for：JTreeSelect组件pidValue还原成空，否则会影响自定义组件树示例--------------
    hasChildField: propTypes.string.def(''),
    condition: propTypes.string.def(''),
    multiple: propTypes.bool.def(false),
    loadTriggleChange: propTypes.bool.def(false),
    reload: propTypes.number.def(1),
    search: propTypes.bool.def(false),
  });
  const attrs = useAttrs();
  const emit = defineEmits(['change', 'update:value']);
  const { createMessage } = useMessage();
  //树形下拉数据
  const treeData = ref<any[]>([]);
  //选择数据
  const treeValue = ref<any>(null);
  const tableName = ref<any>('');
  const text = ref<any>('');
  const code = ref<any>('');
  /**
   * 监听value数据并初始化
   */
  watch(
    () => props.value,
    () => loadItemByCode(),
    { deep: true, immediate: true }
  );
  /**
   * 监听dict变化
   */
  watch(
    () => props.dict,
    () => {
      initDictInfo();
      loadRoot();
    },
    { deep: true, immediate: true }
  );

  //update-begin-author:taoyan date:2022-5-25 for: VUEN-1056 15、严重——online树表单，添加的时候，父亲节点是空的
  watch(
    () => props.reload,
    async () => {
      treeData.value = [];
      await loadRoot();
    },
    {
      immediate: false,
    }
  );
  //update-end-author:taoyan date:2022-5-25 for: VUEN-1056 15、严重——online树表单，添加的时候，父亲节点是空的

  /**
   * 根据code获取下拉数据并回显
   */
  let selectCateId = ''
  async function loadItemByCode() {
        

    if (!(props.value.threeCateId||props.value.twoCateId||props.value.oneCateId) || props.value == '0') {
      treeValue.value = undefined;
    } else {
      let newSelectCateId = props.value.threeCateId||props.value.twoCateId||props.value.oneCateId
      if(newSelectCateId == selectCateId){
        return
      }
      selectCateId = props.value.threeCateId||props.value.twoCateId||props.value.oneCateId
      let params = { id:selectCateId  };
      await defHttp.get({ url: `${Api.view}`, params }, { isTransformResponse: false }).then(res=>{
        treeValue.value = res.result.name
        let param = {
          threeCateId:props.value.threeCateId,
          twoCateId:props.value.twoCateId,
          oneCateId:props.value.oneCateId,
          selectCateId:selectCateId
        }
        // emitValue(param)

        emit('change', param);
      })
      // let result = await defHttp.get({ url: `${Api.view}`, params }, { isTransformResponse: false });
      // if (result.success) {
      //   let values = props.value.split(',');
      //   treeValue.value = result.result.map((item, index) => ({
      //     key: values[index],
      //     value: values[index],
      //     label: item,
      //   }));
      //   onLoadTriggleChange(result.result[0]);
      // }
    }
  }

  function onLoadTriggleChange(text) {
    //只有单选才会触发
    if (!props.multiple && props.loadTriggleChange) {
      emit('change', props.value, text);
    }
  }

  /**
   * 初始化数据
   */
  function initDictInfo() {
    let arr = props.dict?.split(',');
    tableName.value = arr[0];
    text.value = arr[1];
    code.value = arr[2];
  }

  /**
   * 加载下拉树形数据
   */
  async function loadRoot() {
    let params = {
      pid: props.pidValue,
      pidField: props.pidField,
      hasChildField: props.hasChildField,
      condition: props.condition,
      tableName: unref(tableName),
      text: unref(text),
      code: unref(code),
    };
    let res = await defHttp.get({ url: Api.url, params }, { isTransformResponse: false });
    if (res.success && res.result) {
      for (let i of res.result) {
        i.value = i.key;
        i.isLeaf = !!i.leaf;
      }
      treeData.value = [...res.result];
    } else {
      console.log('数根节点查询结果异常', res);
    }
  }



  let rootTreeData = ref([])
  loadTreeRoot({ }).then((result) => {
    
    rootTreeData.value = result.records;
    rootTreeData.value.forEach((itme,k)=>{
      itme.value = 'a'+ k
      itme.title = itme.name;
    })
  });
  /**
   * 异步加载数据
   */
  async function asyncLoadTreeData(treeNode: any) {
          return new Promise( async (resolve: (value?: unknown) => void) => {
            const { id,hasChild,value:parentValue } = treeNode.dataRef;
            
            let childrenNode = []
            if(hasChild == 1){
              await loadTreeRootChild({pid:id }).then(res=>{
                res.records.forEach(((item,k)=>{
                    item.hasChild == 1?item.isLeaf = false:item.isLeaf = true;
                    item.title = item.name;
                    item.pId = item.pid;
                    if(parentValue.indexOf('b') != -1){
                      item.value = parentValue + 'c'+k
                    }else{
                      item.value = parentValue + 'b'+k
                    }
                }))
                childrenNode = res.records
              })
            }
            setTimeout(() => {
              rootTreeData.value = rootTreeData.value.concat([...childrenNode]);
              resolve();
            }, 300);
          });
  }

  /**
   * 加载子节点
   */
  function addChildren(pid, children, treeArray) {
    if (treeArray && treeArray.length > 0) {
      for (let item of treeArray) {
        if (item.key == pid) {
          if (!children || children.length == 0) {
            item.isLeaf = true;
          } else {
            item.children = children;
          }
          break;
        } else {
          addChildren(pid, children, item.children);
        }
      }
    }
  }

  /**
   * 选中树节点事件
   */
  function onChange(v,l,e) {
    
    if(!e.triggerNode){
      treeValue.value = undefined
      let param = {
        threeCateId:'',
        twoCateId:'',
        oneCateId:'',
        selectCateId:''
      }
      emitValue(param)
      return
    }
    let selectNode = e.triggerNode.dataRef
    let threeCateId =  ''
    let twoCateId =  ''
    let oneCateId =  ''
    treeValue.value = l;
    if(v.indexOf('c')!='-1'){
      threeCateId = selectNode.id
      for(let i = 0;i<rootTreeData.value.length;i++){
        if(rootTreeData.value[i].id==selectNode.pId){
          twoCateId = rootTreeData.value[i].id
          for(let k = 0;k<rootTreeData.value.length;k++){
            if(rootTreeData.value[k].id==rootTreeData.value[i].pId){
              oneCateId = rootTreeData.value[k].id
              break
            }
          }
          break
        }
      }
    }else if(v.indexOf('b')!='-1'){
      twoCateId = selectNode.id
      for(let i = 0;i<rootTreeData.value.length;i++){
        if(rootTreeData.value[i].id==selectNode.pId){
          oneCateId = rootTreeData.value[i].id
          break
        }
      }
    }else if(v.indexOf('a')!='-1'){
      oneCateId = selectNode.id
    }
    let param = {
      threeCateId:threeCateId,
      twoCateId:twoCateId,
      oneCateId:oneCateId,
      selectCateId:selectNode.id
    }
    if(!props.search){
      emitValue(param)
    }else{
      emitValue(selectNode.id)
    }
  }
  function emitValue(value) {
    emit('change', value);
    emit('update:value', value);
  }

  /**
   * 文本框值变化
   */
  function onSearch(value) {
    console.log(value);
  }

  /**
   * 校验条件配置是否有误
   */
  function validateProp() {
    let mycondition = props.condition;
    return new Promise((resolve, reject) => {
      if (!mycondition) {
        resolve();
      } else {
        try {
          let test = JSON.parse(mycondition);
          if (typeof test == 'object' && test) {
            resolve();
          } else {
            createMessage.error('组件JTreeSelect-condition传值有误，需要一个json字符串!');
            reject();
          }
        } catch (e) {
          createMessage.error('组件JTreeSelect-condition传值有误，需要一个json字符串!');
          reject();
        }
      }
    });
  }

  // onCreated
  validateProp().then(() => {
    initDictInfo();
    loadRoot();
    loadItemByCode();
  });
</script>

<style lang="less"></style>
