<template>
  <div class="p-4">
    <GrowCard :loading="loading" class="enter-y" :countfo="countfo" />
    <div class="md:flex enter-y enter-y222">
      <VisitRadar class="md:w-5/3 w-full !md:mr-4" :loading="loading" />
      <VisitSource class="md:w-3/3 !md:my-0 !my-4 w-full" :loading="loading" :countfo="countfo" />
    </div>
    <SiteAnalysis class="!my-4 enter-y" :loading="loading" :countfo="countfo" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import GrowCard from '../components/GrowCard.vue';
  import SiteAnalysis from '../components/SiteAnalysis.vue';
  import VisitSource from '../components/VisitSource.vue';
  import VisitRadar from '../components/VisitRadar.vue';
  import { indexCommon } from '../api';

  const countfo = ref({});
  const loading = ref(true);

  function initLogInfo() {
    indexCommon({}).then((res) => {
      if (res.success) {
        countfo.value = res.result;
        loading.value = false;
      }
    });
  }
  initLogInfo();
</script>
<style lang="less" scoped>
  @media (max-width: 1200px) {
    .enter-y222 {
      flex-wrap: wrap;
      justify-content: space-between;
      :deep(.ant-card) {
        margin-right: 0 !important;
        margin-bottom: 20px;
      }
    }
  }
</style>
