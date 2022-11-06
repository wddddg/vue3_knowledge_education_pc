<!--角色选择框-->
<template>
  <div>

    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="1000px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
          <BasicForm @register="registerClass" >
          </BasicForm>
        <!-- <a-tabs defaultActiveKey="all-info">
          <a-tab-pane tab="线上课" key="online-info" forceRender>
              <onlineListTab @selectparam="onlineParam"></onlineListTab>
          </a-tab-pane>
          <a-tab-pane tab="直播课" key="live-info" forceRender>
              <liveListTab @selectparam="liveParam"></liveListTab>
          </a-tab-pane>
        </a-tabs> -->
      <!-- <BasicTable
        :columns="columns"
        v-bind="config"
        :useSearchForm="true"
        :formConfig="formConfig"
        :api="getRoleList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
      ></BasicTable> -->
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getRoleList } from '/@/api/common/api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { BasicForm, useForm } from '/@/components/Form';
  import onlineListTab from './onlineListTab.vue';
  import liveListTab from './liveListTab.vue';

  export default defineComponent({
    name: 'RelBizSelectModal',
    components: {
        onlineListTab,
        liveListTab,
        BasicForm,
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
        default: '关联',
      },
    },
    emits: ['register', 'getSelectResult','refineResult'],
    setup(props, { emit, refs }) {
      let isEdit = false
      let score = null
      //注册弹框
      const [register, { closeModal }] = useModalInner((data)=>{
        
        data.record
        isEdit = data.isEdit
        score = data.score
        setClassData(data.record)
      });
      const attrs = useAttrs();
      let fileData = []
        // 注册表单
      const [registerClass,{ validate:ClassData,setFieldsValue:setClassData,resetFields:resetClassData,getFieldsValue } ] = useForm({
          fieldMapToTime: [
            // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
            // 'YYYY-MM-DD'为时间格式，参考moment
            ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']
          ],
          schemas:
          [
            {
              label: '课件名称',
              field: 'fileName',
              component: 'Input',
              required: false,
              colProps: {
                span: 12,
                offset:6
              },
            },
            // {
            //   label: '课件备注',
            //   field: 'remark',
            //   component: 'Input',
            //   required: false,
            //   colProps: {
            //     span: 12,
            //     offset:6
            //   },
            // },
            {
              label: '使用素材库',
              field: 'file',
              component: 'JMsUpload',
              componentProps:{
                'onUpdatefileData':function(e){
                  fileData = e
                },
              },
              required: false,
              colProps: {
                span: 12,
                offset:6
              },
            },
          ],
          baseColProps: {span: 24},
          showActionButtonGroup: false,
      });
      //表格配置
      const config = {
        canResize: false,
        bordered: true,
        size: 'small',
        rowKey: unref(props).rowKey,
      };
      const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
      const [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(getRoleList, getBindValue);
      const searchInfo = ref(props.params);
      //查询form
      const formConfig = {
        labelWidth: 220,
        baseColProps: {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 14,
          xl: 14,
          xxl: 14,
        },
        schemas: [
          {
            label: '角色名称',
            field: 'roleName',
            component: 'JInput',
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '角色名称',
          dataIndex: 'roleName',
          width: 40,
          align: 'left',
        },
        {
          title: '角色编码',
          dataIndex: 'roleCode',
          width: 40,
        },
      ];
      let selectOnlineRow = []
      function onlineParam(data){
        selectOnlineRow = data
      }
      let selectLiveRow = []
      function liveParam(data){
        selectLiveRow = data
      }
      function fileOption(e){
        
      }
      /**
       * 确定选择
       */
      async function handleOk() {
          //回传选项和已选择的值
          let itemData =  await ClassData()
          itemData.file = fileData
          
          if(!isEdit){
            emit('getSelectResult',itemData);
          }else if(isEdit){
            emit('refineResult',itemData,score);
          }
          //关闭弹窗
          closeModal();
      }

      return {
        config,
        handleOk,
        searchInfo,
        register,
        indexColumnProps,
        visibleChange,
        getRoleList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
        onlineParam,
        liveParam,
        registerClass,
        fileOption
      };
    },
  });
</script>
