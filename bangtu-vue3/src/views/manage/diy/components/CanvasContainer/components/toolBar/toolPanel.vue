<template>
  <div class="toolWarp">
    <div class="toolPanel">
      <component :is="componentMap['Header']" v-show="listIndex == 999"></component>
      <component :is="componentMap[componentsData[listIndex]?.type]" :componentContent="componentsData[listIndex]?.componentContent" v-show="listIndex != 999"></component>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import componentMap from './componentMap'
  import { ref, defineProps, watch, unref,watchEffect,inject } from 'vue';


  const componentsData = inject('componentsData');
  const listIndex = inject('listIndex');
  let switchContent = ref(true)


</script>

<style lang="scss" scoped>
  .toolWarp{
    width: 430px;
    margin-right: 10px;
  }
  .toolPanel {
    width: 400px;
    margin: 0 auto;
  }
  .toolPanel::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }

  .toolPanel::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 5px rgba(156, 148, 148, 0.2);
    background: #cdcdcd;
  }
  .toolPanel::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(158, 150, 150, 0.2);
    border-radius: 4px;
    background: #EDEDED;
  }
</style>
