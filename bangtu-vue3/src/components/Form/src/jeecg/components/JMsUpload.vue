<template>
  <div class="clearfix">
    <div>
      <div v-if="uploadFileList.length > 0 && !isVideoFile">
        <a-upload
          :listType="listType"
          :multiple="multiple"
          :action="uploadUrl"
          :headers="headers"
          :data="{ biz: bizPath }"
          v-model:fileList="uploadFileList"
          :beforeUpload="beforeUpload"
          :disabled="disabled"
          @change="handleChange"
          @preview="handlePreview"
        >
          <div v-if="uploadVisible">
            <div v-if="listType == 'picture-card'">
              <LoadingOutlined v-if="loading" />
              <UploadOutlined v-else />
              <div class="ant-upload-text">{{ text }}</div>
            </div>
            <a-button v-if="listType == 'picture'" :disabled="disabled">
              <UploadOutlined />
              {{ text }}
            </a-button>
          </div>
        </a-upload>
      </div>
      <div class="ant-upload ant-upload-select ant-upload-select-picture-card" v-if="(multiple || uploadFileList.length == 0) && listType == 'picture-card'">
        <span role="button" tabindex="0" class="ant-upload" @click="!disabled?selectModal():''">
          <div>
            <span role="img" aria-label="plus" class="anticon anticon-plus">
              <svg focusable="false" class="" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
                <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
              </svg> </span
            ><div class="ant-upload-text">选择</div>
          </div>
        </span>
      </div>
      <div v-if="listType == 'text' && (multiple || uploadFileList.length == 0)">
        <a-button @click="selectModal">
          <upload-outlined />
          上传
        </a-button>
      </div>
    </div>
    <div class="video" v-if="isVideoFile">
      <div class="video_black">
        <EyeFilled style="cursor: pointer; color: #fff; margin-right:10px;" @click.stop="handlePreview" />
        <DeleteOutlined style="cursor: pointer; color: #fff;" @click.stop="handleDelete" />
      </div>
      <div class="video_img">
        <!-- <div v-if="!ispreviewVideoImage">
          <video  width="100" height="100" id="videoPreviwe"></video>
        </div>
        <div v-else>
          <img  :src="DefaultPicture" id="videoPreviwe" style="width:100px;height:80px" alt="">
        </div> -->
        <div  style="width:100px;height:80px" id="videoPreviwe" v-if="previewVideo?.fileUrl" ></div>
      </div>
      <!-- <div class="video_right">
          <div class="file_name">{{previewVideo?.fileName}}</div>
          <div class="file_size">
            <div>{{previewVideo?.fileSizeTxt}}</div>
            <div>{{previewVideo?.fileSuffix}}</div>
          </div>
      </div> -->
    </div>
    <a-modal :width="1000" :height="600" :visible="previewVisible" :centered="true" :footer="null" @cancel="handleCancel()">
    <div style="padding:50px">
      <div v-if="props?.fileType == 'mp4'&&isVideoFile" style="height:100%;line-height:600px">
        <!-- <video width="800"  controls ref="videoRef" class="videoOrAudioStyle" id="videoPlayrer" v-if="previewVideo?.fileUrl">
          <source :src="date.fileUrl" type="video/mp4" />
          <source :src="date.fileUrl" type="video/ogg" />
          <source :src="date.fileUrl" type="video/webm" />
          <object data="movie.mp4" width="800" height="600">
            <embed :src="date.fileUrl" width="800" height="600" />
          </object>
        </video> -->
        <div class="videoOrAudioStyle" id="videoPlayrer" v-if="previewVideo?.fileUrl" ></div>
      </div>
      <div v-else-if="props?.fileType == 'mp3'&&isAudioFile">
        <audio controls class="videoOrAudioStyle">
          <source :src="previewAudio?.fileUrl" type="audio/ogg" />
          <!-- <source :src="previewAudio?.fileUrl" type="audio/mpeg" /> -->
        </audio>
      </div>
      <div v-else>
        <img alt="example" style="width: 100%" :src="previewImage" />
      </div>
    </div>
    </a-modal>
  </div>
  <AttachmentSelectModal @register="registerModal" :multiple="multiple" @getSelectResult="handleSuccess" />
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, reactive, watchEffect, computed, unref, watch, onMounted,nextTick } from 'vue';
  import { LoadingOutlined, UploadOutlined, DeleteOutlined ,EyeFilled} from '@ant-design/icons-vue';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { propTypes } from '/@/utils/propTypes';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFileAccessHttpUrl, getRandom } from '/@/utils/common/compUtils';
  import { uploadUrl } from '/@/api/common/api';
  import { getToken } from '/@/utils/auth';
  import AttachmentSelectModal from './modal/AttachmentSelectModal.vue';
  import { useModal } from '/@/components/Modal';
  import videoJs from 'video.js';
import DefaultPicture from "/@/assets/images/default-picture.jpg";
  // import 'videojs-contrib-hls';
  import 'video.js/dist/video-js.css';

  // const [registerModal, { openModal }] = useModal();

  const { createMessage, createErrorModal } = useMessage();
  export default defineComponent({
    name: 'JMsUpload',
    components: { LoadingOutlined, UploadOutlined, AttachmentSelectModal, DeleteOutlined,EyeFilled },
    inheritAttrs: false,
    props: {
      //绑定值
      value: propTypes.oneOfType([propTypes.string, propTypes.array]),
      //按钮文本
      listType: {
        type: String,
        required: false,
        default: 'picture-card',
      },
      //按钮文本
      text: {
        type: String,
        required: false,
        default: '上传',
      },
      //这个属性用于控制文件上传的业务路径
      bizPath: {
        type: String,
        required: false,
        default: 'temp',
      },
      //是否禁用
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      multiple: {
        type: Boolean,
        required: false,
        default: false,
      },
      //上传数量
      fileMax: {
        type: Number,
        required: false,
        default: 1,
      },
      //文件类型
      fileType: {
        type: String,
        required: false,
        default: '',
      },
    },
    emits: ['options-change', 'change', 'update:value', 'updatefileData'],
    setup(props, { emit, refs }) {
      //注册model
      const [registerModal, { openModal }] = useModal();
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);
      //获取文件名
      const getFileName = (path) => {
        if (path.lastIndexOf('\\') >= 0) {
          let reg = new RegExp('\\\\', 'g');
          path = path.replace(reg, '/');
        }
        return path.substring(path.lastIndexOf('/') + 1);
      };
      //token
      const headers = ref<object>({
        'X-Access-Token': getToken(),
      });
      //上传状态
      const loading = ref<boolean>(false);
      //是否是初始化加载
      const initTag = ref<boolean>(true);
      //文件列表
      let uploadFileList = ref<any[]>([]);
      //预览图
      const previewImage = ref<string | undefined>('');
      //预览框状态
      const previewVisible = ref<boolean>(false);

      //计算是否开启多图上传
      const multiple = computed(() => {
        return props['fileMax'] > 1 || props.multiple;
      });

      //计算是否可以继续上传
      const uploadVisible = computed(() => {
        return uploadFileList.value.length < props['fileMax'];
      });
      onMounted(()=>{
        
      })
      watchEffect(
        () => {
          console.log('-------watchEffect-------', props.value);
          let val = props.value;
          if (val instanceof Array) {
            val = val.join(',');
          }
          if (val) {
            initFileList(val);
          } else {
            initFileList(undefined);
          }
        },
        {
          flush: 'post',
        }
      );
      /**
       * 监听value变化
       */
      let videoVal = ref()
      watch(
        () => props.value,
        (val, prevCount) => {
          debugger;
          // if (val instanceof Array) {
          //   val = val.join(',');
          // }
          // if (initTag.value == true) {
          //   initFileList(val);
          // }
          console.log(val,'valVideo');
          if (val && props.fileType == 'mp4') {
            isVideoFile.value = true;
            ispreviewVideoImage.value = false
            previewVideo.value.fileUrl = val;
            if(videoVal.value){
              videoVal.value.dispose()
            }
            setTimeout(() => {
              setVideoPreviwe()
            }, 100);          

            // setTimeout(() => {
            //   videoVal.value.play()
            // }, 2000);
          } else {
            isVideoFile.value = false;
          }
          if (val && props.fileType == 'mp3') {
          console.log(val,'valAudio');
            isAudioFile.value = true;
            previewAudio.value.fileUrl = val;
          }else{
            isAudioFile.value = false;
          }
        }
      );

      watch(
        () => props.fileType,
        (val, prevCount) => {
          if (val == 'mp4' && props.value) {
            isVideoFile.value = true;
          } else {
            isVideoFile.value = false;
          }
          if (val == 'mp3' && props.value) {
            isAudioFile.value = true;
          } else {
            isAudioFile.value = false;
          }
        }
      );

      let ispreviewVideoImage = ref(false)
      // 初始化视频缩略图
      function setVideoPreviwe(){
        // videoVal.value =  videoJs('videoPreviwe',{
        //   bigPlayButton: true,
        //   textTrackDisplay: true,
        //   posterImage: true,
        //   errorDisplay: true,
        //   autoplay: false,
        //   controls: true,
        //   notSupportedMessage:'无法播放，请检查源文件',
        //   hls: {
        //     withCredentials: true,
        //   },
        //   sources: [
        //     {
        //       src: previewVideo.value.fileUrl,
        //       // src: 'https://outin-24cb95c7a4cf11ec9fae00163e00b174.oss-cn-shanghai.aliyuncs.com/8acd4f77222d435dbbad050f58fe2b54/c0364f142bef4926987cc253794415a5-743bd4358581c60e44a08e8dd9cc0ae4-ld.m3u8',
        //       type: 'application/x-mpegURL',
        //       // type: 'm3u8',
        //     },
        //   ],
        //   playbackRates: [0.5, 1, 1.5, 2]
        // })
        // videoVal.value.on('error', event => {
        //   // 可以通过 event 获取 player 实例
        //   const currentPlayer = event.target.player
        //   // console.log(currentPlayer === player) // true
        //   ispreviewVideoImage.value = false
        //   nextTick(()=>{
        //     ispreviewVideoImage.value = true
        //   })
        //   // if(videoVal.value){
        //   //     videoVal.value.dispose()
        //   // }

        //   // 可以通过 error() 方法获取当前抛出的错误信息(可通过beforeerror钩子自定义返回的错误对象)
        //   console.log(videoVal.value.error(),'videoVal.value.error()')
        // })
        currentVideo.value = new Aliplayer({
        id: 'videoPreviwe',
        autoplay:false,
        controlBarVisibility:'never',
        skinLayout:false,
        source: previewVideo.value.fileUrl,//播放地址，可以是第三方点播地址，或阿里云点播服务中的播放地址。
          },function(player){
            console.log('The player is created.')
        });
        
      }
      /**
       * 初始化文件列表
       */
      function initFileList(paths) {
        if (!paths || paths.length == 0) {
          uploadFileList.value = [];
          return;
        }
        let files = [];
        let arr = paths.split(',');
        arr.forEach((value) => {
          let url = getFileAccessHttpUrl(value);
          files.push({
            uid: getRandom(10),
            name: getFileName(value),
            status: 'done',
            url: url,
            response: {
              status: 'history',
              message: value,
            },
          });
        });
        uploadFileList.value = files;
      }

      /**
       * 上传前校验
       */
      function beforeUpload(file) {
        let fileType = file.type;
        if (fileType.indexOf('image') < 0) {
          createMessage.info('请上传图片');
          return false;
        }
      }
      /**
       * 文件上传结果回调
       */
      function handleChange({ file, fileList, event }) {
        initTag.value = false;
        uploadFileList.value = fileList;
        if (file.status === 'error') {
          createMessage.error(`${file.name} 上传失败.`);
        }
        let fileUrls = [];
        //上传完成
        if (file.status != 'uploading') {
          fileList.forEach((file) => {
            if (file.status === 'done') {
              fileUrls.push(file.response.message);
            }
          });
          if (file.status === 'removed') {
            handleDelete(file);
          }
        }
        emitData.value = fileUrls.join(',');
        state.value = fileUrls.join(',');
        emit('update:value', fileUrls.join(','));
      }

      /**
       * 删除图片
       */
      function handleDelete(file) {
        //如有需要新增 删除逻辑
        // console.log(file);
        debugger;
        isVideoFile.value = false;
        uploadFileList.value = [];
        emitData.value = uploadFileList.value.join(',');
        state.value = uploadFileList.value.join(',');
        emit('update:value', uploadFileList.value.join(','));
      }

      /**
       * 预览图片
       */
      function handlePreview(file) {
        // previewVideo.value.fileUrl = file;
        previewImage.value = file.url || file.thumbUrl;
        previewVisible.value = true;
        setTimeout(()=>{
          getVideo()
        },1000)
      }

      function getAvatarView() {
        if (uploadFileList.value.length > 0) {
          let url = uploadFileList.value[0].url;
          return getFileAccessHttpUrl(url, null);
        }
      }

      function handleCancel() {
        previewVisible.value = false;
        currentVideo.value.dispose();
        if(isAudioFile.value){
          isAudioFile.value = false 
          nextTick(()=>{
            isAudioFile.value = true 
          })
        }
        if(isVideoFile.value){
          isVideoFile.value = false 
          nextTick(()=>{
            isVideoFile.value = true 
            if(videoVal.value){
              videoVal.value.dispose()
            }
            setTimeout(() => {
              setVideoPreviwe()
            }, 100);
          })
        }
      }

      function selectModal() {
        openModal(true, {
          isUpdate: false,
          showFooter: true,
          record: {},
        });
      }

      let previewVideo = ref({
        fileUrl: '',
        fileName: '',
        fileSizeTxt: '',
        fileSuffix: '',
      });
      let previewAudio= ref({
        fileUrl: '',
        fileName: '',
        fileSizeTxt: '',
        fileSuffix: '',
      });
      let isVideoFile = ref(false);
      let isAudioFile = ref(false);
      let currentVideo = ref(null);
      var videoRef = ref();
      const getVideo = () => {
        console.log(previewVideo.value.fileUrl,'previewVideo.value.fileUrl');
        
        // currentVideo.value = videoJs('videoPlayrer', {
        //   bigPlayButton: true,
        //   textTrackDisplay: true,
        //   posterImage: true,
        //   errorDisplay: true,
        //   autoplay: true,
        //   controls: true,
        //   notSupportedMessage:'无法播放，请检查源文件',
        //   hls: {
        //     withCredentials: true,
        //   },
        //   sources: [
        //     {
        //       src: previewVideo.value.fileUrl,
        //       // src: 'https://outin-24cb95c7a4cf11ec9fae00163e00b174.oss-cn-shanghai.aliyuncs.com/8acd4f77222d435dbbad050f58fe2b54/c0364f142bef4926987cc253794415a5-743bd4358581c60e44a08e8dd9cc0ae4-ld.m3u8',
        //       type: 'application/x-mpegURL',
        //       // type: 'm3u8',
        //     },
        //   ],
        //   playbackRates: [0.5, 1, 1.5, 2]
        // });
        // currentVideo.value.resetControlBarUI_();
        // currentVideo.value.resetPlaybackRate_();
        currentVideo.value = new Aliplayer({
        id: 'videoPlayrer',
        source: previewVideo.value.fileUrl,//播放地址，可以是第三方点播地址，或阿里云点播服务中的播放地址。
          },function(player){
            console.log('The player is created.')
        });
      };

      const cancel = () => {
        currentVideo.value.dispose();
      };

      function handleSuccess(items) {
        let fileUrls = [];
        let files = [];
        items.forEach((item) => {
          //let url = getFileAccessHttpUrl(value);
          files.push({
            uid: getRandom(10),
            name: item.fileName,
            status: 'done',
            url: item.fileUrl,
            response: {
              status: 'history',
              message: '成功',
            },
          });
          fileUrls.push(item.fileUrl);
        });
        // if (items[0].fileSuffix == 'mp3' || items[0].fileSuffix == 'mp4') {
        //   previewVideo.value = items[0];
        //   isVideoFile.value = true;
        // } else {
        //   isVideoFile.value = false;
        // }
        if(props.fileType == 'mp4'){
          ispreviewVideoImage.value  = false
        }
        uploadFileList.value = files;
        initTag.value = false;
        emitData.value = fileUrls.join(',');
        state.value = fileUrls.join(',');
        emit('update:value', fileUrls.join(','));
        emit('updatefileData', items);
      }

      return {
        handleSuccess,
        registerModal,
        selectModal,
        previewVideo,
        previewAudio,
        isVideoFile,
        isAudioFile,
        handleDelete,
        state,
        attrs,
        previewImage,
        previewVisible,
        uploadFileList,
        multiple,
        headers,
        loading,
        uploadUrl,
        beforeUpload,
        uploadVisible,
        handlePreview,
        handleCancel,
        handleChange,
        props,
        ispreviewVideoImage,
        DefaultPicture
      };
    },
  });
</script>
<style scoped>
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .video {
    width: 100px;
    display: flex;
    /* align-items: center; */
  }
  .video_black {
    width: 100px;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    z-index: 11111;
    display: none;
  }
  .video:hover .video_black {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .video_img {
    width: 100px;
    display: flex;
    align-items: center;
  }
  .video_right {
    width: 120px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-left: 10px;
  }
  .file_name {
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-line;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 显示的行数 */
  }
  .file_size {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
  .videoOrAudioStyle{
    margin: auto;
  }
  ::v-deep .vjs-control-bar {
  display: none !important;
}
/* ::v-deep .prism-big-play-btn {
  display: none !important;
} */
</style>
