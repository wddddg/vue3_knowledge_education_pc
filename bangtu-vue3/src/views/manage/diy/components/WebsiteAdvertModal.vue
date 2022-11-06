<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #appAlert="{ record }">
        <div class="advertUp">
          <div class="appAdvert">
            <!-- 手机标题 -->
            <div class="hearder">
              <!-- 模拟手机布局 -->
              <div style="margin-left: 10px">00:00 &nbsp;<wifi-outlined /> <phone-outlined style="position: absolute; right: 10px; line-height: 23px" /> </div>
              <div class="title"> &nbsp; </div>
            </div>
            <!-- 手机图片预览 -->
            <div class="imgBody" v-show="showImg">
              <div class="previewImg">
                <a-image :width="250" height="375px" :src="previewImg" :preview="false" />
              </div>
              <div class="closeImg">
                <a-button shape="circle" type="primary" @click="hideImg">
                  <close-outlined />
                </a-button>
              </div>
            </div>
            <div class="bottomIcon"> &nbsp; </div>
          </div>
          <!-- <div class="sBr"></div> -->
          <!-- 编辑 -->
          <div class="appEditBody">
            <div class="title"> 弹窗广告 </div>
            <a-alert type="info" showIcon message="1.小程序自定义链接仅支持打开站内域名。" />
            <a-form v-bind="layout" :model="formState" name="IptValue" labelAlign="left" style="margin: 20px 0px">
              <a-form-item name="IptValue" label="标题">
                <a-input v-model:value="formState.IptValue" />
              </a-form-item>
            </a-form>
            <div class="appEdit">
              <BasicForm @register="registerForm1">
                <template #imgUrl>
                  <JMsUpload :fileMax="1" @update:value="imgChange" v-model:value="depictBack" />
                </template>
              </BasicForm>
            </div>
          </div>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, computed, unref, watch, reactive } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import { formSchema, formSchemaAdvert } from '../WebsiteAdvert.data';
import { saveOrUpdate, queryInfoById } from '../WebsiteAdvert.api';
import { WifiOutlined, PhoneOutlined, CloseOutlined } from '@ant-design/icons-vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
// Emits声明
const emit = defineEmits(['register', 'success']);
const isUpdate = ref(true);
// 是否显示图片
const showImg = ref(false);
// 预览图数据
const previewImg = ref('');
// 上传组件数据
const depictBack = ref('');
const formState = reactive({ IptValue: '' });
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

//表单配置
const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
  labelWidth: 150,
  schemas: formSchema,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
const [registerForm1, { setProps: setProps1, resetFields: resetFields1, setFieldsValue: setFieldsValue1, validate: validate1 }] = useForm({
  labelWidth: 150,
  schemas: formSchemaAdvert,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
//表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  //重置表单
  await resetFields();
  await resetFields1();
  depictBack.value = '';
  previewImg.value = '';
  setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter, defaultFullscreen: true });
  isUpdate.value = !!data?.isUpdate;
  if (unref(isUpdate)) {
    //表单赋值
    queryInfoById({ id:data.record.id }).then(async res =>{
      formState.IptValue = res.title
      await setFieldsValue({
        ...res,
      });
      await setFieldsValue1({
        ...res,
        business: res.businessId,
      });
    })
  }

  // 隐藏底部时禁用整个表单
  setProps({ disabled: !data?.showFooter });
  setProps1({ disabled: !data?.showFooter });
  if (data.record) {
    previewImg.value = data.record.imgUrl;
    depictBack.value = data.record.imgUrl;
    showImg.value = true;
  } else {
    showImg.value = false;
  }
});
//设置标题
const title = computed(() => (!unref(isUpdate) ? '使用' : '编辑'));
//表单提交事件
async function handleSubmit(v) {
  try {
    let values = { ...(await validate()), ...(await validate1()) };
    values.imgUrl = previewImg.value;
    values.title = formState.IptValue
    if (values.business) {
      delete values.business;
    }
    setModalProps({ confirmLoading: true });
    //提交表单
    await saveOrUpdate(values, isUpdate.value);
    //关闭弹窗
    closeModal();
    //刷新列表
    emit('success');
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
// 上传组件发生改变的回调
const imgChange = (value) => {
  if (value === '') {
    showImg.value = false;
  } else {
    previewImg.value = value;
    showImg.value = true;
  }
};
// 预览图片隐藏
const hideImg = () => {
  showImg.value = false;
  depictBack.value = '';
};
</script>

<style lang="less" scoped>
/** 时间和数字输入框样式 */
:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-calendar-picker) {
  width: 100%;
}

:deep(.ant-col-sm-18) {
  max-width: 100% !important;
}
.advertUp {
  // display: flex;
  // justify-content: space-between;
  // margin: auto;
  // width: 781px;
  position: relative;
  .appAdvert {
    margin: auto;
    height: calc(100vh - 180px);
    width: 375px;
    position: relative;
    box-shadow: #ccc 1px 1px 15px;
    border-radius: 5px;
    overflow: hidden;
    .hearder {
      text-align: left;
      line-height: 25px;
      background-color: #fff;
      .title {
        text-align: center;
      }
    }
    background-color: #ccc;
    .imgBody {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .previewImg {
        border: 20px solid rgba(242, 242, 242, 1);
      }
      .closeImg {
        margin: auto;
        width: 32px;
      }
    }
    .bottomIcon {
      position: absolute;
      bottom: 0px;
      background-color: #fff;
      height: 50px;
      width: 100%;
    }
  }
  // .sBr {
  //   background-color: #ccc;
  //   width: 0.5px;
  //   margin: 0px 15px;
  //   height: auto;
  // }
  .appEditBody {
    border-left: 2px solid #ccc;
    padding-left: 20px;
    position: absolute;
    right: 50px;
    top: 0;
    height: calc(100vh - 180px);
    width: 375px;
    .title {
      text-align: center;
      font-size: 18px;
      margin: 5px 0px;
    }
    .appEdit {
      border: 1px solid #ccc;
      border-radius: 10px;
      margin: 10px 0px;
      padding: 20px;
    }
  }
}
</style>