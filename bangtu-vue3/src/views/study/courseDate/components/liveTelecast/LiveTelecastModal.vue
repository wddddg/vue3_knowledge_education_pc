<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="1000" @ok="handleSubmit">
    <a-tabs v-model:activeKey="activeKey">
<!--      <a-tab-pane key="0" tab="OBS软件">OBS软件 </a-tab-pane>-->
      <a-tab-pane key="1" tab="PC网页" force-render>
        <div class="cardBody">
          <div class="PCTitle"> 点击下方按钮可进入PC直播间直播端 </div>
          <a-badge color="#87d068" dot text="横屏直播支持：摄像头、麦克风、桌面共享、白板、音乐等" class="successText" />
          <br />
          <a-badge color="#87d068" dot text="竖屏直播支持：摄像头、麦克风、音乐等" class="successText" />
        </div>
      </a-tab-pane>
    </a-tabs>
    <!-- <BasicForm @register="registerForm" /> -->
    <div id="id_local_video" style="margin: 0 auto; width: 80%; display: flex; align-items: center; justify-content: center"></div>
    <template #footer>
      <div class="footerBtn">
        <a-button type="primary" @click="handleSubmit">进入PC端开始直播</a-button>
        <a-button @click="close">关闭</a-button>
      </div>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import { queryLiveBySectionId,editLiveStatus } from '../../courseDate.api';
import { message } from 'ant-design-vue';
// Emits声明
const emit = defineEmits(['register', 'success']);
// const isUpdate = ref(true);
const userId = ref('');
const activeKey = ref('1');
const data = ref({})
const livePusher = new TXLivePusher();

//表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  userId.value = data.record.id;
  data.record.liveStatus = 1
  data.value = data.record
});
//设置标题
const title = computed(() => '直播步骤');
//表单提交事件
async function handleSubmit(v) {
  livePusher.setRenderView('id_local_video');
  // 设置音视频流
  livePusher.setVideoQuality('1080p');
  // 设置音频质量
  livePusher.setAudioQuality('standard');
  // 自定义设置帧率
  livePusher.setProperty('setVideoFPS', 30);
  // 设置视频的分辨率
  livePusher.setProperty('setVideoResolution', { width: 1920, height: 1080 })
  // 设置连接重试次数
  livePusher.setProperty('setConnectRetryCount', 5)
  // 开启直播
  // 打开摄像头
  livePusher.startCamera();
  // 打开麦克风
  livePusher.startMicrophone();
  //推流地址需要从后端接收。
  await queryLiveBySectionId({ id: userId.value }).then(async (res) => {
    livePusher.startPush(res.pushStream);
    await editLiveStatus(data.value,closeModal)
  });
}

const close = () => {
  closeModal();
};
</script>

<style lang="less" scoped>
.cardBody {
  padding: 0px 15px;
  .PCTitle {
    margin: 10px 0px;
    color: rgb(106, 106, 108);
  }
  .successText {
    margin: 5px 0px;
    ::v-deep(.ant-badge-status-text) {
      color: rgb(106, 106, 108) !important;
    }
  }
}
.footerBtn {
  text-align: center;
}
</style>
