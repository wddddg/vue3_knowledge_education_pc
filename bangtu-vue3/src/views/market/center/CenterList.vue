<template>
  <div class="p-4">
    <a-card :bordered="false">
      <a-tabs v-model:activeKey="activeKey" @change="changeTab">
        <a-tab-pane key="1" tab="规则配置">
          <AddRule :retailRuleInfo="retailRuleInfo" :loading="loading" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="分销统计">
          <!--引用表格-->
          <BasicTable @register="registerTable">
            <!--插槽:table标题-->
            <template #tableTitle>
              <a-button type="primary" @click="onExportXls"> 导出全部</a-button>
            </template>
            <!--操作栏-->
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record)" />
            </template>
          </BasicTable>
        </a-tab-pane>
        <a-tab-pane key="3" tab="课程海报">
          <a-alert message="建议尺寸：640px*960px" />
          <div class="BasicUpload1" v-if="showJMsUpload">
            <JMsUpload :fileMax="1" v-model:value="formState.posterUrl" @change="handleChange" />
            <!-- :listType="'picture'" :text="'上传海报'"  -->
            <!-- <BasicForm @register="register" class="my-5" /> -->
          </div>
          <div class="img-box">
            <div class="img-item" v-for="(item, index) in imgList" :key="index">
              <a-image height="525px" :src="item.posterUrl" />
              <div class="actionBtn">
                <a-button type="primary" style="margin-right: 10px" @click="handleDelete(item)">删除</a-button>
                <a-button type="link" @click="handlePreview(item)">预览</a-button>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="系统海报">
          <a-alert message="建议尺寸：640px*960px" />
          <div class="BasicUpload1" v-if="showJMsUpload">
            <JMsUpload :fileMax="1" v-model:value="formState1.posterUrl" @change="handleChange" />
            <!-- :listType="'picture'" :text="'上传海报'"  -->
          </div>
          <div class="img-box">
            <div class="img-item" v-for="(item, index) in imgList" :key="index">
              <a-image height="525px" :src="item.posterUrl" />
              <div class="actionBtn">
                <a-button type="primary" style="margin-right: 10px" @click="handleDelete(item)">删除</a-button>
                <a-button type="link" @click="handlePreview(item)">预览</a-button>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="5" tab="提现规则">
          <div>
            <BasicForm @register="registerForm" />
            <div class="flexs">
              <a-button type="primary" @click="handleSubmit">保存</a-button>
              <a-button style="margin-left: 40px">取消</a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 表单区域 -->
    <CamePayInfoModal @register="registerModal" @success="handleSuccess" />
    <CenterInfoDrawer @register="registerDrawer" @success="handleSuccess" />
    <PreviewModal @register="registerPreviewModal" />
  </div>
</template>

<script lang="ts" name="came-camePayInfo" setup>
  // import JImageUpload from '/@/components/Form/src/jeecg/components/JImageUpload.vue';
  import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer, BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import CamePayInfoModal from './components/CamePayInfoModal.vue';
  import AddRule from './components/AddRule.vue';
  import CenterInfoDrawer from './components/CenterInfoDrawer.vue';
  import PreviewModal from './components/PreviewModal.vue';
  import { BasicUpload } from '/@/components/Upload';
  import { columns, searchFormSchema, formSchema1, schemas } from './CamePayInfo.data';
  import { list, addOrEdit, queryInfo, findList, deleteOne, getImportUrl, getExportUrl, retailRule, uploadApi } from './CamePayInfo.api';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  const checkedKeys = ref<Array<string | number>>([]);
  const loading = ref(true);
  const { createMessage } = useMessage();
  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const activeKey = ref<string>('1');
  const imgList = ref([]);
  const retailRuleInfo = ref({});
  const posterType = ref(1);
  const searchInfo = { category: 1 };
  const formState = reactive({ posterUrl: '', posterType: 1 });
  const formState1 = reactive({ posterUrl: '', posterType: 2 });
  const showJMsUpload = ref(true);

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '分销统计',
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
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '分销统计',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema1,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  async function handleChange(file) {
    if (file === '') return '';
    showJMsUpload.value = false;
    setTimeout(() => {
      showJMsUpload.value = true;
    }, 100);
    await uploadApi({ posterUrl: file, posterType: posterType.value }).then(async () => {
      initLogInfo();
      formState.posterUrl = '';
      formState1.posterUrl = '';
    });
  }

  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      //提交表单
      await addOrEdit(values);
    } finally {
    }
  }
  /**
   * tab切换
   */
  async function changeTab(key) {
    if (key == '5') {
      const result = await queryInfo({});
      //表单赋值
      await setFieldsValue({
        ...result,
      });
    } else if (key == '4') {
      posterType.value = 2;
      initLogInfo();
    } else if (key == '3') {
      posterType.value = 1;
      initLogInfo();
    } else if (key == '2') {
      handleSuccess();
    } else {
      retailRuleFun();
    }
    activeKey.value = key;
  }
  //分销配置-查询详情
  function retailRuleFun() {
    retailRule({}).then((result) => {
      retailRuleInfo.value = result;
      loading.value = false;
    });
  }
  retailRuleFun();
  // 获取海报
  function initLogInfo() {
    findList({ posterType: posterType.value }).then((result) => {
      imgList.value = result;
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, initLogInfo);
    initLogInfo();
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /*
   * 预览
   */
  function handlePreview(record) {
    openPreviewModal(true, { record });
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '明细',
        onClick: handleEdit.bind(null, record),
      },
    ];
  }
</script>

<style scoped lang="less">
  ::v-deep .ant-input-number {
    width: 40%;
  }
  ::v-deep .ant-image {
    width: 100% !important;
  }
  ::v-deep .ant-image-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .flexs {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .img-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 12px;
  }
  .img-item {
    width: 350px;
    /* height: 525px; */
    margin-bottom: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    .actionBtn {
      margin-top: 20px;
      display: flex;
    }
  }

  .BasicUpload {
    display: flex;
    margin: 20px 0;
    align-items: center;
  }
  .BasicUpload1 {
    margin: 20px 0;
  }
</style>
