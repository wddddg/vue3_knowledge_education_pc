<!--角色选择框-->
<template>
  <div>
    <BasicDrawer v-bind="$attrs" @register="registerDrawer" :isDetail="true" :title="modalTitle" @ok="handleOk" destroyOnClose @close="handleClose">
      <a-tabs defaultActiveKey="all-info">
        <a-tab-pane tab="课程" key="course-info" forceRender>
          <CourseListTab @getSelectResult="handleOk" />
        </a-tab-pane>
        <a-tab-pane tab="电子书籍" key="book-info" forceRender>
          <BookListTab @getSelectResult="handleOk" />
        </a-tab-pane>
        <a-tab-pane tab="资料库" key="data-info" forceRender>
          <DataBase @getSelectResult="handleOk" />
        </a-tab-pane>
        <a-tab-pane tab="文章" key="article-info" forceRender>
          <ArticleListTab @getSelectResult="handleOk" />
        </a-tab-pane>
      </a-tabs>
    </BasicDrawer>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/src/components/Drawer';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import CourseListTab from './CourseListTab.vue';
  import BookListTab from './BookListTab.vue';
  import ArticleListTab from './ArticleListTab.vue';
  import DataBase from './DataBase.vue';
  export default defineComponent({
    name: 'RelBizSelectModal',
    components: {
      CourseListTab,
      BookListTab,
      ArticleListTab,
      DataBase,
      //此处需要异步加载BasicTable
      BasicDrawer,
    },
    props: {
      ...selectProps,
      //选择框标题
      modalTitle: {
        type: String,
        default: '教学详细',
      },
    },
    emits: ['registerDrawer', 'getSelectResult'],
    setup(props, { emit }) {
      const attrs = useAttrs();
      const teacherInfo = ref('');
      //注册抽屉
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false, showFooter: true, showOkBtn: false });
        teacherInfo.value = data.record;

        localStorage.setItem('tes', data.record.id);
        // console.log(data.record, 3333333333, '教学详细');
      });

      /**
       * 确定选择
       */
      function handleOk(value) {
        // closeDrawer();
        // console.log(value);
      }
      function handleClose() {
        localStorage.removeItem('tes');
      }
      return {
        handleClose,
        teacherInfo,
        registerDrawer,
        handleOk,
      };
    },
  });
</script>

<style lang="less" scoped></style>
