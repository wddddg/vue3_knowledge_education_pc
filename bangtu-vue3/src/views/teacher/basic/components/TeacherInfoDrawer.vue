<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="title" :width="1180" destroyOnClose>
    <div class="step-box">
      <a-steps :current="current">
        <a-step title="基本信息" />
        <a-step title="收益配置" />
      </a-steps>
    </div>
    <PageWrapper class="high-form">
      <div v-show="current === 0">
        <a-card title="基本信息" :bordered="false">
          <BasicForm @register="register1">
            <template #selectProvince="{ model }">
              <!-- 地区联动选择 -->
              <div class="area-box">
                <a-select placeholder='请选择省份' :options="provinceOptions" v-model:value="model['province']" @change="selectProvince" allowClear />
                <a-select placeholder='请选择城市' :options="cityOptions" v-model:value="model['city']" @change="selectCity" allowClear />
                <a-select placeholder='请选择地区' :options="countyOptions" v-model:value="model['county']" allowClear />
              </div>
            </template>
          </BasicForm>
        </a-card>

        <a-card title="联系信息" class="!mt-5" :bordered="false">
          <BasicForm @register="register2" />
        </a-card>

        <a-card title="收款信息" class="!mt-5" :bordered="false">
          <BasicForm @register="register3">
            <template #selectBankProvince="{ model, field }">
              <!-- 所属省份选择 -->
              <div class="area-box">
                <a-select placeholder='请选择省份' :options="provinceOptions" v-model:value="model[field]" allowClear />
              </div>
            </template>
          </BasicForm>
        </a-card>

        <a-card title="自我介绍" class="!mt-5" :bordered="false">
          <BasicForm @register="register4">
            <template #editContent="{ model, field }">
              <!-- 富文本编辑 -->
              <Tinymce v-model="model[field]" @change="handleChange" width="100%" />
            </template>
          </BasicForm>
        </a-card>
        <div class="footer"></div>
      </div>

      <div v-show="current === 1">
        <a-card title="收益分配" :bordered="false">
          <BasicTable @register="registerTable" v-show="!dataSource.length" />
          <BasicTable @register="unRegisterTable" v-show="dataSource.length" />
        </a-card>
      </div>
    </PageWrapper>

    <PageFooter>
      <template #right>
        <a-button class="mr10" type="primary" @click="handleNext" v-show="current === 0"> 下一步 </a-button>

        <a-button class="mr10" type="primary" @click="handlePrev" v-show="current === 1"> 上一步 </a-button>
        <a-button class="mr10" type="primary" @click="handleSubmit" v-show="current === 1 && showType != '详情'"> 确认提交 </a-button>
      </template>
    </PageFooter>
  </BasicDrawer>
</template>

<script lang="ts" setup>
import { ref, computed, unref, onMounted, Ref, h } from 'vue';
import { Switch, InputNumber, message } from 'ant-design-vue';
import { Tinymce } from '/@/components/Tinymce/index';
import { PageFooter } from '/@/components/Page';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { BasicForm, useForm } from '/@/components/Form/index';
import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
import { formSchema1, formSchema2, formSchema3, formSchema4 } from '../TeacherInfo.data';
import { saveOrUpdate, queryAddInit, queryById , saveDivide } from '../TeacherInfo.api';
import { listArea } from './../../../member/member/SystemMember.api';
import { PageWrapper } from '/@/components/Page';

// Emits声明
const emit = defineEmits(['register', 'success']);

type ShowType = '新增' | '编辑' | '详情';

const current = ref(0);
const provinceOptions = ref<any[]>([]);
const cityOptions = ref<any[]>([]);
const countyOptions = ref<any[]>([]);
const id: Ref<number> = ref(0);
const showType: Ref<ShowType> = ref('新增');
const addId = ref('')
const dataSource = ref([])

const columns: BasicColumn[] = [
  {
    title: '分配名称',
    dataIndex: 'categoryName',
    width: 250,
  },
  {
    title: '是否分成',
    dataIndex: 'isDivide',
    width: 100,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isEnable')) {
        record.isEnable = false;
      }
      return h(Switch, {
        checked: record.isDivide == 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
        onChange(checked: boolean) {
          record.isDivide = checked ? 1 : 0;
        },
      });
    },
  },
  {
    title: '讲师分成占比',
    dataIndex: 'divideRate',
    customRender: ({ record, text }) => {
      if (unref(showType) == '详情') {
        return text;
      } else {
        return h(InputNumber, {
          defaultValue: record.divideRate || 0,
          style: 'width:100px',
          onChange(value) {
            record.divideRate = value;
          },
        });
      }
    },
  },
];
const [registerTable, { getDataSource }] = useTable({
  api: queryAddInit,
  beforeFetch(params) {
    console.log('params =>', params);

    params.id = id.value;
  },
  columns: columns,
  showIndexColumn: false,
  showTableSetting: false,
  pagination: false,
  canResize: false,
  isTreeTable: false,
});
const [unRegisterTable, { getDataSource:unGetDataSource }] = useTable({
  dataSource: dataSource,
  columns: columns,
  showIndexColumn: false,
  showTableSetting: false,
  pagination: false,
  canResize: false,
  isTreeTable: false,
});

//表单配置（基本信息）
const [register1, { setProps: setProps1, resetFields: resetFields1, setFieldsValue: setFieldsValue1, validate: validate1 }] = useForm({
  labelWidth: 120,
  schemas: formSchema1,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});

//表单配置（联系信息）
const [register2, { setProps: setProps2, resetFields: resetFields2, setFieldsValue: setFieldsValue2, validate: validate2 }] = useForm({
  labelWidth: 120,
  schemas: formSchema2(showType),
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});

//表单配置（收款信息）
const [register3, { setProps: setProps3, resetFields: resetFields3, setFieldsValue: setFieldsValue3, validate: validate3 }] = useForm({
  labelWidth: 120,
  schemas: formSchema3,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});

//表单配置（自我介绍）
const [register4, { setProps: setProps4, resetFields: resetFields4, setFieldsValue: setFieldsValue4, validate: validate4 }] = useForm({
  labelWidth: 120,
  schemas: formSchema4,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});

//表单赋值
const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
  //重置表单
  await Promise.all([resetFields1(), resetFields2(), resetFields3(), resetFields4()]);

  setDrawerProps({ confirmLoading: false, showFooter: false });
  current.value = 0;
  addId.value = ''
  id.value = data.record?.id || 0;
  showType.value = data.showType;
  
  if (unref(showType) == '新增' || unref(showType) == '编辑') {
    //表单赋值
    
    
    if (data.record.id) {
      const detail = await queryById({ id: data.record.id });
      await Promise.all([setFieldsValue1({ ...detail }), setFieldsValue2({ ...detail }), setFieldsValue3({ ...detail }), setFieldsValue4({ ...detail })]);
      
      getAreaOption(detail?.province, 0);
      getAreaOption(detail?.city, 1);
      dataSource.value = [...detail.teacherDivideVOList]
      
    }
  }else{
    if (data.record.id) {
      const detail = await queryById({ id: data.record.id });
      await Promise.all([setFieldsValue1({ ...detail }), setFieldsValue2({ ...detail }), setFieldsValue3({ ...detail }), setFieldsValue4({ ...detail })]);
      
      getAreaOption(detail?.province, 0);
      getAreaOption(detail?.city, 1);
      dataSource.value = [...detail.teacherDivideVOList]
    }
  }

  // 隐藏底部时禁用整个表单
  setProps1({ disabled: unref(showType) == '详情' });
  setProps2({ disabled: unref(showType) == '详情' });
  setProps3({ disabled: unref(showType) == '详情' });
  setProps4({ disabled: unref(showType) == '详情' });
});

//设置标题
const title = computed(() => {
  if (unref(showType) == '详情') {
    return '讲师详情';
  } else {
    return showType.value + '讲师';
  }
}); //获取标题

// 上一步
async function handlePrev() {
  current.value = 0;
}

// 下一步
async function handleNext() {
  try {
    if (unref(showType) !== '详情') {
      const [values1, values2, values3, values4] = await Promise.all([validate1(), validate2(), validate3(), validate4()]);
      setDrawerProps({ confirmLoading: true });

      // 提交表单
      let form = { ...values1, ...values2, ...values3, ...values4 };

      await saveOrUpdate(form, unref(showType) == '编辑').then(res =>{
        if(res?.id){
          addId.value = res.id
          message.success('编辑成功')
        }else{
          addId.value = ''
        }
      });
    }
    current.value = 1;
  } finally {
    setDrawerProps({ confirmLoading: false });
  }
}

//表单提交事件
async function handleSubmit() {
  try {
    // 认证表单
    const [values1, values2, values3, values4] = await Promise.all([validate1(), validate2(), validate3(), validate4()]);
    setDrawerProps({ confirmLoading: true });

    // 提交表单
    let form = { ...values1, ...values2, ...values3, ...values4 };
    if(!dataSource.value.length){
      form.teacherDivideVOList = [...getDataSource()];
    }else{
      form.teacherDivideVOList = [...unGetDataSource()];
    }

    if(addId.value != ''){
      form.id = addId.value
    }
    await saveDivide(form)

    //关闭弹窗
    closeDrawer();

    //刷新列表
    emit('success');
  } finally {
    setDrawerProps({ confirmLoading: false });
  }
}

onMounted(async () => {
  let res = await listArea({});
  provinceOptions.value = [];
  res.forEach((element) => {
    provinceOptions.value.push({ value: element.areaNo, label: element.areaName });
  });
});

function getAreaOption(areaParentno, type) {
  listArea({ areaParentno: areaParentno }).then(function (resp) {
    let items = [] as any[];
    resp.forEach((element) => {
      items.push({ value: element.areaNo, label: element.areaName });
    });
    if (!type) {
      cityOptions.value = items;
    } else {
      countyOptions.value = items;
    }
  });
}

function selectProvince(e) {
  getAreaOption(e, 0);
  setFieldsValue1({ city: '', county: '' });
}

function selectCity(e) {
  getAreaOption(e, 1);
  setFieldsValue1({ county: '' });
}

function handleChange(value: string) {
  console.log(value);
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

:deep(.ant-row.ant-form-item .ant-col-sm-4) {
  flex: none;
  max-width: 120px;
}

// // 修改card样式
// :deep(.ant-card-body) {
//   padding: 12px;
// }
// :deep(.ant-card-head) {
//   font-weight: bold;
// }
// :deep(.ant-card-body) {
//   background-color: rgb(247, 247, 247);
// }

.step-box {
  width: 360px;
  margin: 20px auto;
}

.area-box {
  display: flex;
  flex-direction: row;
  align-items: center;

  & > div {
    width: 120px;
    margin-right: 10px;
  }
}

.mr10 {
  margin-right: 10px;
}

.footer {
  height: 30px;
}
</style>
