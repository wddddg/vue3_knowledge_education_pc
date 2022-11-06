<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" destroyOnClose :title="title" :showFooter="showFooter" :width="adaptiveWidth" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <!--字段回显插槽-->
      <template #cateSlot="{ model, field }">
        <a-tree-select
          v-model:value="model.field"
          tree-data-simple-mode
          style="width: 100%"
          :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="cateTreeData"
          placeholder="请选择"
          :load-data="asyncLoadCateTreeData"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, watch, onMounted } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../NewsInfo.data';
  import { saveOrUpdate, queryById } from '../NewsInfo.api';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  import { loadCateTreeRoot, loadCateTreeChild } from '/@/api/common/api';
  import { useUserStore } from '/@/store/modules/user';
  let userInfo = useUserStore().userInfo;
  let threeCateId = ref('');
  let twoCateId = ref('');
  let oneCateId = ref('');
  const props = defineProps({
    rootTreeData: {
      type: Array,
      default: () => [],
    },
  });
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const showFooter = ref(true);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 150,
    schemas: formSchema(userInfo, threeCateId, twoCateId, oneCateId),
    showActionButtonGroup: false,
    baseColProps: {
      span: 24,
    },
  });
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    //重置表单
    await resetFields();
    showFooter.value = data?.showFooter ?? true;
    setDrawerProps({
      confirmLoading: false,
      showCancelBtn: !!data?.showFooter,
      showOkBtn: !!data?.showFooter,
    });
    isUpdate.value = !!data?.isUpdate;
    if (userInfo.userRoleType === 2 && !unref(isUpdate)) {
      await setFieldsValue({
        authorId: userInfo.id,
      });
    }
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
          authorId: res.authorId,
          coverImg: res.newsCoverImgVOList.length > 0 ? res.newsCoverImgVOList[0].coverImg : '',
          selectColumn: { threeCateId, twoCateId, oneCateId },
        });
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({
      disabled: !data?.showFooter,
    });
  });

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const { adaptiveWidth } = useDrawerAdaptiveWidth();
  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setDrawerProps({
        confirmLoading: true,
      });
      values.threeCateId = threeCateId.value;
      values.twoCateId = twoCateId.value;
      values.oneCateId = oneCateId.value;
      values.userIdentity === 1 && (values.departIds = '');
      let newsCoverImgVOList = [
        {
          coverImg: values.coverImg,
        },
      ];
      console.log(values.coverImg, 'values.coverImg');

      //提交表单
      await saveOrUpdate(
        {
          ...values,
          category: 3,
          newsCoverImgVOList: values.coverImg ? newsCoverImgVOList : [],
        },
        isUpdate.value
      );
      //关闭弹窗
      closeDrawer();
      //刷新列表
      emit('success');
    } finally {
      setDrawerProps({
        confirmLoading: false,
      });
    }
  }

  onMounted(async () => {
    loadCateRootData();
  });

  let cateTreeData = ref([]);

  /**
   * 加载行业分类树根节点
   */
  async function loadCateRootData() {
    let params = {};
    let res = await loadCateTreeRoot();
    if (res.records) {
      for (let i of res.records) {
        i.key = i.id;
        i.value = i.id;
        i.isLeaf = i.hasChild != 1;
      }
      cateTreeData.value = [...res.records];
    } else {
      console.log('数根节点查询结果异常', res);
    }
  }

  function asyncLoadCateTreeData(treeNode) {
    let dataRef = treeNode.dataRef;
    return new Promise((resolve) => {
      if (treeNode.children.length > 0) {
        resolve();
        return;
      }
      let pid = dataRef.key;
      let param = {
        pid: pid,
      };
      loadCateTreeChild(param).then((res) => {
        if (res.records) {
          for (let i of res.records) {
            i.key = i.id;
            i.value = i.id;
            if (i.hasChild == '0') {
              i.isLeaf = true;
            } else if (i.hasChild == '1') {
              i.isLeaf = false;
            }
          }
          addChildren(pid, res.records, cateTreeData.value);
          resolve();
        }
      });
    });
  }

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
