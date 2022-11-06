<!--角色选择框-->
<template>
  <div>
    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle"  width="1350px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
        <div style="background:#f0f2f5" >
            <a-row :class="['p-4', `${prefixClsTree}--box`]" :gutter="10">
              <a-col :xl="4" :lg="8" :md="10" :sm="24" style="flex: 1">
                 <a-card :bordered="false" style="height: 100%">
                    <ClassifyTree @select="onTreeSelect" />
                </a-card>
              </a-col>
              <a-col :xl="20" :lg="16" :md="14" :sm="24" style="flex: 1">
                <a-card :bordered="false" style="height: 100%">
                  <a-tabs defaultActiveKey="all-info">
                    <a-tab-pane tab="全部" key="all-info" forceRender>
                        <AttachmentInfoListTab ref="tab1" :multiple="multiple" @selectRecord="selectRecord" :data="selectedGroupData" :fileType="'0'"></AttachmentInfoListTab>
                    </a-tab-pane>
                    <a-tab-pane tab="视频" key="vedio-info">
                        <AttachmentInfoListTab ref="tab2" :multiple="multiple" :data="selectedGroupData" :fileType="'1'"></AttachmentInfoListTab>
                    </a-tab-pane>
                    <a-tab-pane tab="音频" key="audio-info">
                         <AttachmentInfoListTab ref="tab3" :multiple="multiple" :data="selectedGroupData" :fileType="'2'"></AttachmentInfoListTab>
                    </a-tab-pane>
                    <a-tab-pane tab="图像" key="image-info">
                         <AttachmentInfoListTab ref="tab4" :multiple="multiple"  :data="selectedGroupData" :fileType="'3'"></AttachmentInfoListTab>
                    </a-tab-pane>
                    <a-tab-pane tab="文档" key="document-info">
                         <AttachmentInfoListTab ref="tab5" :multiple="multiple" :data="selectedGroupData" :fileType="'4'"></AttachmentInfoListTab>
                    </a-tab-pane>
                  </a-tabs>
                </a-card>
              </a-col>
            </a-row>
        </div>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, provide } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getRoleList } from '/@/api/common/api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import AttachmentInfoListTab from '/@/views/manage/attachment/components/AttachmentInfoListTabSelect.vue';
  import ClassifyTree from '/@/views/manage/attachment/components/ClassifyTreeSelect.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'AttachmentSelectModal',
    components: {
        AttachmentInfoListTab,
        ClassifyTree,
      //此处需要异步加载BasicTable
      BasicModal,
      BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
        loading: true,
      }),
    },
    props: {
      ...selectProps,
      //是否多选
      multiple: {
        type: Boolean,
        required: false,
        default: false,
      },
      //选择框标题
      modalTitle: {
        type: String,
        default: '素材选择',
      },
    },
    emits: ['register', 'getSelectResult'],
    setup(props, { emit, refs }) {
      //注册弹框
      const [register, { closeModal }] = useModalInner();
      const attrs = useAttrs();
      const { prefixClsTree } = useDesign('AttachmentSelectModal');
      provide('prefixClsTree', prefixClsTree);
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

      // 当前选中的分类信息
      let selectedGroupData = ref({});
      const tab1 = ref<InstanceType<typeof AttachmentInfoListTab>>();
      const tab2 = ref<InstanceType<typeof AttachmentInfoListTab>>();
      const tab3 = ref<InstanceType<typeof AttachmentInfoListTab>>();
      const tab4 = ref<InstanceType<typeof AttachmentInfoListTab>>();
      const tab5 = ref<InstanceType<typeof AttachmentInfoListTab>>();

      // 左侧树选择后触发
      function onTreeSelect(data) {
          if(data.parentId!="0"){
              selectedGroupData.value = {
                  oneCateId:data.parentId,
                  twoCateId: data.id,
                  name: data.name,
              };

          }else{
              selectedGroupData.value = {
                  oneCateId:data.id,
                  twoCateId: null,
                  name: data.name,
              };
          }

      }

      function selectRecord(event){
          
          console.log(event);
      }
      /**
       * 确定选择
       */
      function handleOk() {
          let imgItems = [];
          tab1.value.selectRows.forEach(element => {
              imgItems.push({fileUrl:element.fileUrl,fileName: element.attachName, fileSizeTxt: element.fileLengthStr, fileSuffix: element.fileSuffix,videoDuration:element.videoDuration,coverImg:element.coverImg});
          });
          if(tab2.value&&tab2.value.selectRows){
              tab2.value.selectRows.forEach(element => {
                  imgItems.push({fileUrl:element.fileUrl,fileName: element.attachName, fileSizeTxt: element.fileLengthStr, fileSuffix: element.fileSuffix,videoDuration:element.videoDuration,coverImg:element.coverImg});
              });
          }
          if(tab3.value&&tab3.value.selectRows){
              tab3.value.selectRows.forEach(element => {
                  imgItems.push({fileUrl:element.fileUrl,fileName: element.attachName, fileSizeTxt: element.fileLengthStr, fileSuffix: element.fileSuffix,videoDuration:element.videoDuration,coverImg:element.coverImg});
              });
          }
          if(tab4.value&&tab4.value.selectRows){
              tab4.value.selectRows.forEach(element => {
                  imgItems.push({fileUrl:element.fileUrl,fileName: element.attachName, fileSizeTxt: element.fileLengthStr, fileSuffix: element.fileSuffix,videoDuration:element.videoDuration,coverImg:element.coverImg});
              });
          }
           if(tab5.value&&tab5.value.selectRows){
               tab5.value.selectRows.forEach(element => {
                   imgItems.push({fileUrl:element.fileUrl,fileName: element.attachName, fileSizeTxt: element.fileLengthStr, fileSuffix: element.fileSuffix,videoDuration:element.videoDuration,coverImg:element.coverImg});
               });
           }

        // getSelectResult((options, values) => {
        //   //回传选项和已选择的值
          emit('getSelectResult', imgItems);
        //   //关闭弹窗
           closeModal();
        // });
      }

      return {
          prefixClsTree,
          tab1,tab2,tab3,tab4,tab5,
          onTreeSelect,
          selectedGroupData,
        config,
        handleOk,
        searchInfo,
        register,
        indexColumnProps,
        visibleChange,
        getRoleList,
        formConfig,
        getBindValue,
        rowSelection,
      };
    },
  });
</script>
