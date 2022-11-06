<template>
      <a-row :class="['p-4', `${prefixClsTree}--box`]" :gutter="10">

        <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
          <a-card :bordered="false" style="height: 100%">
            <a-tabs defaultActiveKey="all-info">
              <a-tab-pane tab="DIY页面" key="page-info" forceRender>
                  <WebsiteHtmlCustomList ref="htmlCustomList" ></WebsiteHtmlCustomList>
              </a-tab-pane>
              <a-tab-pane tab="店铺主题" key="theme-info">
                  <WebsiteThemeList ref="themeList" ></WebsiteThemeList>
              </a-tab-pane>
              <a-tab-pane tab="底部导航" key="buttom-info">
                  <WebsiteBottomIconList ref="bottomIconList" ></WebsiteBottomIconList>
              </a-tab-pane>
              <a-tab-pane tab="弹窗广告" key="advert-info">
                  <WebsiteAdvertList ref="advertList" ></WebsiteAdvertList>
              </a-tab-pane>

            </a-tabs>
          </a-card>
        </a-col>
      </a-row>

</template>

<script lang="ts" name="DiyList" setup>
  import {ref, computed, unref, provide} from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {useModal} from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  import WebsiteHtmlCustomList from './WebsiteHtmlCustomList.vue'
  import WebsiteThemeList from './WebsiteThemeList.vue'
  import WebsiteBottomIconList from './WebsiteBottomIconList.vue'
  import WebsiteAdvertList from './WebsiteAdvertList.vue'
  // import {columns, searchFormSchema} from './AttachmentInfo.data';
  // import {list, deleteOne, batchDelete, getImportUrl,getExportUrl} from './AttachmentInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

  const { prefixClsTree } = useDesign('attachmentinfo');
  provide('prefixClsTree', prefixClsTree);

  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, {openModal}] = useModal();


</script>


<style lang="less">
</style>
