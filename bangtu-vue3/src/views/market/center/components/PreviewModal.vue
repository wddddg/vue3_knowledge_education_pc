<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" :showOkBtn="false" cancelText="关闭">
    <div class="appAdvert">
      <!-- 手机标题 -->
      <div class="hearder">
        <!-- 模拟手机布局 -->
        <div style="margin-left: 10px">00:00 &nbsp;<wifi-outlined /> <phone-outlined style="position: absolute; right: 10px; line-height: 23px" /> </div>
        <div class="title"> &nbsp; </div>
      </div>
      <!-- 手机图片预览 -->
      <div class="img-item">
        <div class="img-content">
          <a-image :preview="false" height="375px" width="250px" :src="posterUrl" />
          <div class="img-QRCode">
            <a-image :preview="false" height="80px" width="80px" src="https://img2.baidu.com/it/u=1989038259,1842360401&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500" />
          </div>
        </div>
      </div>
      <div class="bottomIcon"></div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { WifiOutlined, PhoneOutlined } from '@ant-design/icons-vue';
// Emits声明
const emit = defineEmits(['register', 'success']);
const posterUrl = ref('');
//表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  posterUrl.value = data.record.posterUrl;
});
//设置标题
const title = computed(() => '预览');
</script>

<style lang="less" scoped>
.img-item {
  margin: 10px auto;
  text-align: center;
  padding: 0px 10px;
  .img-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .img-QRCode {
      position: absolute;
      top: 80%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.appAdvert {
  height: calc(100vh - 240px);
  width: 375px;
  position: relative;
  margin: auto;
  border: 5px solid #ccc;
  border-radius: 10px;
  .hearder {
    margin: auto;
    text-align: left;
    background-color: #ccc;
    width: 366px;
    line-height: 25px;
    .title {
      text-align: center;
    }
  }
  .imgBody {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .previewImg {
      border: 20px solid rgba(242, 242, 242, 1);
    }
    .closeImg {
      margin: auto;
      width: 32px;
    }
  }
  .bottomIcon {
    position: absolute;
    bottom: 0px;
    background-color: #ccc;
    height: 50px;
    width: 366px;
  }
}
</style>
