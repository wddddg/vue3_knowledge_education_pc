<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1000" @ok="handleSubmit" @cancel="close">
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
            <div class="imgBody"> </div>
            <!-- 手机底部导航栏 -->
            <div class="bottomIcon">
              <div v-for="(item, index) in formState.list" :key="index" class="activationBody" :class="currentIndex === index ? 'currentClass' : ''" @click="currentClick(index)">
                <a-image :width="30" :preview="false" :src="item.onclickAfter" />
                <div class="title">{{ item.title }}</div>
              </div>
              <a-button type="primary" class="addButtonIcon" v-if="formState.list.length < 5" @click="addListItem">
                <plus-outlined />
                <div> 增加导航 </div>
              </a-button>
            </div>
          </div>
          <!-- <div class="sBr"></div> -->
          <!-- 编辑 -->
          <div class="appEditBody">
            <div class="title"> 底部导航 </div>
            <a-alert type="info" showIcon message="1.图片尺寸50px*50px，每组需要点击前和点击后两张图片" class="alertMsg">
              <template #description>
                <p> 2.小程序自定义链接仅支持打开站内域名。 </p>
              </template>
            </a-alert>
            <a-form v-bind="layout" :model="formStateIpt" name="IptValue" labelAlign="left" style="margin: 20px 0px">
              <a-form-item name="IptValue" label="标题">
                <a-input v-model:value="formStateIpt.IptValue" />
              </a-form-item>
            </a-form>
            <a-form :model="formState.list[currentIndex]" v-if="formState.list.length" ref="list" name="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 24 }" autocomplete="off">
              <div class="appEdit">
                <a-button shape="circle" type="primary" class="delList" v-if="formState.list.length > 1" @click="delListItem(currentIndex)">
                  <close-outlined />
                </a-button>
                <a-form-item label="点击前" :name="formState.list[currentIndex].onclickAgo" labelAlign="left">
                  <JMsUpload v-model:value="formState.list[currentIndex].onclickAgo" :file-max="1" />
                </a-form-item>
                <a-form-item label="点击后" :name="formState.list[currentIndex].onclickAfter" labelAlign="left">
                  <JMsUpload v-model:value="formState.list[currentIndex].onclickAfter" :file-max="1" />
                </a-form-item>
                <a-form-item label="文字" name="title" labelAlign="left">
                  <a-input v-model:value="formState.list[currentIndex].title"></a-input>
                </a-form-item>
                <a-form-item label="链接" name="onclickUrl" labelAlign="left">
                  <JSelectRelBiz
                    :label="formState.list[currentIndex].businessName"
                    v-model:value="formState.list[currentIndex].businessId"
                    :availableTabs="['page-tab']"
                    :showButton="false"
                    @selectedClassifyRows="getlink"
                  ></JSelectRelBiz>
                </a-form-item>
                <a-form-item label="排序" name="username" labelAlign="left">
                  <a-input-number v-model:value="formState.list[currentIndex].sort"></a-input-number>
                </a-form-item>
              </div>
            </a-form>
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
import { formSchema } from '../WebsiteBottomIcon.data';
import { saveOrUpdate, queryInfoById } from '../WebsiteBottomIcon.api';
import { WifiOutlined, PhoneOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons-vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import JSelectRelBiz from '/@/components/Form/src/jeecg/components/JSelectRelBiz.vue';
import { message } from 'ant-design-vue';
// Emits声明
const emit = defineEmits(['register', 'success']);
const isUpdate = ref(true);
const showJMsUpload = ref(true);
const formStateIpt = reactive({ IptValue: '' });
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
const formState = reactive({
  list: [
    {
      onclickAfter: '',
      onclickAgo: '',
      title: '',
      onclickUrl: '',
      sort: '',
      businessId: '',
      onclickType: '',
      businessName: '',
    },
  ],
});

const currentIndex = ref(0);
const showImg = ref(true);
//表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  //重置表单
  formState.list = [
    {
      onclickAfter: '',
      onclickAgo: '',
      title: '',
      onclickUrl: '',
      sort: '',
      businessId: '',
      onclickType: '',
      businessName: '',
    },
  ];

  await resetFields();
  setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter, defaultFullscreen: true });
  isUpdate.value = !!data?.isUpdate;
  if (unref(isUpdate)) {
    await queryInfoById({ id: data.record.id }).then(async (res) => {
      formState.list = [...res.websiteBottomIconImgVOList];
      formStateIpt.IptValue = res.title;
      await setFieldsValue({
        ...res,
      });
    });

    //表单赋值
    // await setFieldsValue({
    //   ...data.record,
    // });
  }
  // 隐藏底部时禁用整个表单
  setProps({ disabled: !data?.showFooter });
});
//设置标题
const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
//表单提交事件
async function handleSubmit(v) {
  try {
    let values = { ...(await validate()), websiteBottomIconImgVOList: formState.list };
    values.title = formStateIpt.IptValue;
    setModalProps({ confirmLoading: true });
    //提交表单
    await saveOrUpdate(values, isUpdate.value);
    //关闭弹窗
    currentIndex.value = 0;
    closeModal();
    //刷新列表
    emit('success');
  } finally {
    setModalProps({ confirmLoading: false });
  }
}

// 增加底部导航列表
async function addListItem() {
  if (
    !formState.list[formState.list.length - 1].title &&
    !formState.list[formState.list.length - 1].onclickAfter &&
    !formState.list[formState.list.length - 1].onclickAgo &&
    !formState.list[formState.list.length - 1].onclickUrl &&
    !formState.list[formState.list.length - 1].sort
  )
    return message.warning('请先填写最新页面属性');
  formState.list.push({
    onclickAfter: '',
    onclickAgo: '',
    title: '',
    onclickUrl: '',
    sort: '',
    businessId: '',
    onclickType: '',
    businessName: '',
  });
  currentIndex.value = formState.list.length - 1;
}

function getlink(item) {
  formState.list[currentIndex.value].businessId = item[0].businessId || '';
  formState.list[currentIndex.value].onclickType = item[0].onclickType || '';
  formState.list[currentIndex.value].businessName = item[0].businessName || '';
  formState.list[currentIndex.value].onclickUrl = item[0].onclickUrl || '';
}

const delListItem = (index) => {
  formState.list.splice(index, 1);
  currentIndex.value = formState.list.length - 1;
};

const currentClick = (index) => {
  currentIndex.value = index;
};

const close = () => {
  currentIndex.value = 0;
  formState.list = [
    {
      onclickAfter: '',
      onclickAgo: '',
      title: '',
      onclickUrl: '',
      sort: '',
      businessId: '',
      onclickType: '',
      businessName: '',
    },
  ];
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

:deep(.ant-alert-message) {
  font-size: 14px !important;
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
    .bottomIcon {
      position: absolute;
      bottom: 0px;
      background-color: #fff;
      height: 60px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .title {
        font-size: 10px;
        line-height: 10px;
      }
      .activationBody {
        background-color: #fff;
        height: 100%;
        flex: 1;
        padding: 3px 10px;
        cursor: pointer;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .addButtonIcon {
        width: 18%;
        height: 100%;
        display: block;
        padding: 0;
        font-size: 12px;
      }
    }
  }
  // .sBr {
  //   background-color: #ccc;
  //   width: 0.5px;
  //   margin: 0px 15px;
  // }
  .appEditBody {
    border-left: 2px solid #ccc;
    padding-left: 20px;
    position: absolute;
    right: 50px;
    top: 0;
    height: calc(100vh - 180px);
    width: 375px;
    overflow: auto;
    padding: 10px;
    .title {
      text-align: center;
      font-size: 18px;
      margin: 5px 0px;
    }
    .alertMsg {
      font-size: 14px !important;
    }
    .appEdit {
      border: 1px solid #ccc;
      border-radius: 10px;
      margin: 20px 0px;
      padding: 20px;
      position: relative;
      .delList {
        position: absolute;
        top: -15px;
        right: -3px;
        transform: scale(0.8);
      }
    }
  }
}
.currentClass {
  border: #1890ff 1px solid;
  border-radius: 5px;
}
</style>