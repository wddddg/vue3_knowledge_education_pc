<template>
  <BasicModal v-bind="$attrs" :minHeight="400" @register="registerModal" destroyOnClose :title="title" :width="1000" :show-ok-btn="false" @cancel="cancel" cancel-text="关闭">
    <div v-if="date.fileType == 1">
      <!-- <video width="800" height="600" controls class="videoOrAudioStyle" id="videoPlayrer" v-if="date.fileUrl">
        <source :src="date.fileUrl" type="video/mp4" />
        <source :src="date.fileUrl" type="video/ogg" />
        <source :src="date.fileUrl" type="video/webm" />
        <object data="movie.mp4" width="800" height="600">
          <embed :src="date.fileUrl" width="800" height="600" />
        </object>
      </video> -->
      <div controls style="height: 400px" class="videoOrAudioStyle" id="videoPlayrer" v-if="date.fileUrl"></div>
    </div>
    <div v-else-if="date.fileType == 2">
      <audio controls class="videoOrAudioStyle">
        <source :src="date.fileUrl" type="audio/ogg" />
        <source :src="date.fileUrl" type="audio/mpeg" />
      </audio>
    </div>
    <div v-else-if="date.fileType == 3">
      <div class="imgStyle">
        <a-image height="400px" :src="date.fileUrl" />
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
import videoJs from 'video.js';
import 'video.js/dist/video-js.css';
import { ref, computed, reactive } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';

const emit = defineEmits(['register']);
const date = ref({});
//表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  date.value = { ...data.record };
  setTimeout(() => {
    getVideo();
  }, 300);
});
//设置标题
const title = computed(() => '查看');
const currentVideo = ref(null);

const getVideo = () => {
  // currentVideo.value = videoJs('videoPlayrer', {
  //   bigPlayButton: true,
  //   textTrackDisplay: true,
  //   posterImage: true,
  //   errorDisplay: true,
  //   autoplay: true,
  //   controls: true,
  //   hls: {
  //     withCredentials: true,
  //   },
  //   sources: [
  //     {
  //       src: date.value.fileUrl,
  //       // src: 'https://outin-24cb95c7a4cf11ec9fae00163e00b174.oss-cn-shanghai.aliyuncs.com/4397805439d74791b675125145a92453/ba9113771850414c98d5f8f38e15ecb3-4747012546d4c0e2f7095d6bc51a0ea5-ld.m3u8',
  //       type: 'application/x-mpegURL',
  //       // type: 'm3u8',
  //     },
  //   ],
  // });
  // currentVideo.value.resetControlBarUI_();
  // currentVideo.value.resetPlaybackRate_();
  currentVideo.value = new Aliplayer({
  id: 'videoPlayrer',
  source: date.value.fileUrl,//播放地址，可以是第三方点播地址，或阿里云点播服务中的播放地址。
    },function(player){
      console.log('The player is created.')
  });
};

const cancel = () => {
  currentVideo.value.dispose();
};
</script>

<style lang="less" scoped>
.imgStyle {
  text-align: center;
}
.videoOrAudioStyle {
  margin: auto;
  height: 100%
}
::v-deep .vjs-control-bar {
  display: none !important;
}
</style>
