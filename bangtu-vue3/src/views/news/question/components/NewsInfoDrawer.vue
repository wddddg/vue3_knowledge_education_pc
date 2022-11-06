<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" destroyOnClose :title="title" :showFooter="showFooter" :width="adaptiveWidth" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, watch } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../NewsInfo.data';
  import { saveOrUpdate, queryById } from '../NewsInfo.api';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  import { useUserStore } from '/@/store/modules/user';
  let userInfo = useUserStore().userInfo;
  let threeCateId = ref('');
  let twoCateId = ref('');
  let oneCateId = ref('');
  const props = defineProps({
    rootTreeData: { type: Array, default: () => [] },
  });
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const showFooter = ref(true);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 150,
    schemas: formSchema(userInfo.userRoleType, threeCateId, twoCateId, oneCateId),
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    //重置表单
    await resetFields();
    showFooter.value = data?.showFooter ?? true;
    setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    // updateSchema([
    //   {
    //     field: 'oneCateId',
    //     componentProps: { treeData: props.rootTreeData },
    //   },
    // ]);
    if (unref(isUpdate)) {
      //表单赋值
      await queryById({ id: data.record.id }).then(async (res) => {
        let { threeCateId, twoCateId, oneCateId } = res;
        await setFieldsValue({
          ...res,
          authorName: res.createBy,
          coverImg: res.newsCoverImgVOList.length > 0 ? res.newsCoverImgVOList[0].coverImg : '',
          selectColumn: { threeCateId, twoCateId, oneCateId },
        });
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const { adaptiveWidth } = useDrawerAdaptiveWidth();
  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setDrawerProps({ confirmLoading: true });
      values.userIdentity === 1 && (values.departIds = '');
      values.threeCateId = threeCateId.value;
      values.twoCateId = twoCateId.value;
      values.oneCateId = oneCateId.value;
      let newsCoverImgVOList = [
        {
          coverImg: values.coverImg,
        },
      ];

      //提交表单
      await saveOrUpdate({ ...values, category: 1, newsCoverImgVOList: values.coverImg ? newsCoverImgVOList : [] }, isUpdate.value);
      //关闭弹窗
      closeDrawer();
      //刷新列表
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
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
</style>
