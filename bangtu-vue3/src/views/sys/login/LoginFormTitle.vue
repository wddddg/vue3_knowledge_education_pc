<template>
  <div class="login-tit">
    <img :src="imgUrl" v-if="imgUrl" />
    <!-- <img v-else src="../../../assets/images/logo.png" /> -->
    <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
      {{ title || '恩图在线' }}
    </h2>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, unref, ref, nextTick, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { LoginStateEnum, useLoginState } from './useLogin';

  const { t } = useI18n();
  const title = ref('');
  const imgUrl = ref('');
  const { getLoginState } = useLoginState();
  const props = defineProps(['recordInformation']);

  const getFormTitle = computed(() => {
    const titleObj = {
      [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
      [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
      [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
      [LoginStateEnum.MOBILE]: t('sys.login.mobileSignInFormTitle'),
      [LoginStateEnum.QR_CODE]: t('sys.login.qrSignInFormTitle'),
    };
    return titleObj[unref(getLoginState)];
  });

  watch(
    props,
    () => {
      title.value = props.recordInformation.recordInformation.manageTitle;
      imgUrl.value = props.recordInformation.recordInformation.manageLogoUrl;
    },
    {
      deep: true,
      immediate: true,
    }
  );
</script>
<style lang="less">
  .login-tit {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 70px;
    img {
      height: 48px;
      margin-right: 20px;
    }
    h2 {
      margin-bottom: 0 !important;
    }
  }
</style>
