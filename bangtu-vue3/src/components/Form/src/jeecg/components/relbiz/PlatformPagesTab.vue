<!--角色选择框-->
<template>
  <div>
      <a-radio-group v-model:value="size">
          <a-checkable-tag v-model:checked="checkedArr[index]"  @change="handleChange(index, $event)" v-for="(item, index) in pageOptions">{{item.itemText}}</a-checkable-tag>
     <!-- <a-radio-button :value="item.value" v-for="item in pageOptions">{{item.label}}</a-radio-button> -->
     <!-- <a-radio-button value="default">Default</a-radio-button>
     <a-radio-button value="small">Small</a-radio-button> -->
   </a-radio-group>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref,onMounted,reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
   import { initDictOptions } from '/@/utils/dict';
   import { getGlobalPageList } from '/@/api/common/api';

  export default defineComponent({
    name: 'PlatformPagesTab',
    components: {
      //此处需要异步加载BasicTable
      BasicModal,
      BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
        loading: true,
      }),
    },
    props: {
      ...selectProps,
      //选择框标题
      modalTitle: {
        type: String,
        default: '业务选择',
      },
    },
    emits: ['register', 'getSelectResult'],
    setup(props, { emit, refs }) {
        let checkedArr = reactive<boolean[]>([])
        function handleChange(index,$event){
            if($event){
                for(let i =0;i<checkedArr.length;i++){
                    checkedArr[i] = false;
                }
                checkedArr[index]= true;

                checkedArr = checkedArr;
            }
        }
        let pageOptions =  ref([]);
        onMounted(async()=>{
             // let res = await initDictOptions("webTypeUrl")
             let res = await getGlobalPageList();
             debugger;
             pageOptions.value = res;

         })
      //注册弹框
      const [register, { closeModal }] = useModalInner();
      const attrs = useAttrs();
      //表格配置
      const config = {
        canResize: false,
        bordered: true,
        size: 'small',
        rowKey: unref(props).rowKey,
      };

      /**
       * 确定选择
       */
      function handleOk() {
          debugger;
          let checkedIndex = -1;
          for(let index=0;index<checkedArr.length;index++){
              if(checkedArr[index]){
                  checkedIndex = index;
                  break;
              }
          }
          if(checkedIndex>=0){
              let item = unref(pageOptions)[checkedIndex];
              const options = [{value:item.itemValue, label:item.itemText, onclickType:1}];
              const values = [item.value];
              const rows = [{businessId:item.itemValue, businessName:item.itemText, onclickType:1, onclickUrl: item.description}];
              emit('getSelectResult', options, values, rows);
          }else{

          }


      }

      return {
          checkedArr,
          handleChange,
          pageOptions,
        config,
        handleOk,
        register,
      };
    },
  });
</script>

<style lang="less" scoped>
:deep(.ant-tag-checkable){
    // background-color: transparent;
    border-color: transparent;
    line-height: 40px;
    height: 40px;
    font-weight: 400;
    font-size: 14px;
    border-radius: 2px;
    min-width: 100px;
    cursor: pointer;
    text-align: center;
    border: 1px solid transparent;
    margin:10px 15px;
    padding: 1px 15px;
    border-color: #d9d9d9;
    cursor: pointer;
}

</style>
