<template>
  <div>
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

    <a-card title="联系信息" :bordered="false">
      <BasicForm @register="register2" />
    </a-card>

    <a-card title="收款信息" :bordered="false">
      <BasicForm @register="register3">
        <template #selectBankProvince="{ model, field }">
          <!-- 所属省份选择 -->
          <div class="area-box">
            <a-select placeholder='请选择省份' :options="provinceOptions" v-model:value="model[field]" allowClear />
          </div>
        </template>
      </BasicForm>
    </a-card>

    <a-card title="自我介绍" :bordered="false" style="margin-bottom: 40px;">
      <BasicForm @register="register4">
        <template #editContent="{ model, field }">
          <!-- 富文本编辑 -->
          <Tinymce v-model="model[field]" @change="handleChange" width="100%" />
        </template>
      </BasicForm>
    </a-card>
    
    <PageFooter>
      <template #right>
        <a-button class="mr10" > 取消 </a-button>
        <a-button class="mr10" type="primary" @click="handleSubmit"> 保存 </a-button>
      </template>
    </PageFooter>
  </div>
</template>

<script lang="ts" name="basic-teacherInfo" setup>
import { ref, computed, unref, onMounted, Ref, h } from 'vue';
import { Switch, InputNumber } from 'ant-design-vue';
import { Tinymce } from '/@/components/Tinymce/index';
import { BasicForm, useForm } from '/@/components/Form/index';
import { BasicColumn } from '/@/components/Table';
import { formSchema1, formSchema2, formSchema3, formSchema4 } from './TeacherInfo.data';
import { saveOrUpdate, queryById } from '../basic/TeacherInfo.api';
import { listArea } from './../../member/member/SystemMember.api';
import { useUserStore } from '/@/store/modules/user';
import { PageFooter } from '/@/components/Page';
// 获取当前用户信息
let userInfo = useUserStore().userInfo;
// Emits声明
const emit = defineEmits(['register', 'success']);

type ShowType = '新增' | '编辑' | '详情';

const current = ref(0);
const provinceOptions = ref<any[]>([]);
const cityOptions = ref<any[]>([]);
const countyOptions = ref<any[]>([]);
const id: Ref<number> = ref(0);
const showType: Ref<ShowType> = ref('新增');
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
  schemas: formSchema2,
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

//表单提交事件
async function handleSubmit() {
  try {
    // 认证表单
    const [values1, values2, values3, values4] = await Promise.all([validate1(), validate2(), validate3(), validate4()]);

    // 提交表单
    let form = { ...values1, ...values2, ...values3, ...values4 };
    // form.teacherDivideVOList = [];
    await saveOrUpdate(form, true);

    //刷新列表
    emit('success');
  } finally {
  }
}

onMounted(async () => {
  let res = await listArea({});
  provinceOptions.value = [];
  res.forEach((element) => {
    provinceOptions.value.push({ value: element.areaNo, label: element.areaName });
  });
  await queryById({ id: userInfo.id }).then(async (data) => {
    await Promise.all([setFieldsValue1({ ...data }), setFieldsValue2({ ...data }), setFieldsValue3({ ...data }), setFieldsValue4({ ...data })]);
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
</script>

<style scoped lang="less">
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

// 修改card样式
:deep(.ant-card-body) {
  padding: 12px;
}
:deep(.ant-card-head) {
  font-weight: bold;
}
:deep(.ant-card-body) {
  background-color: rgb(247, 247, 247);
}

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
