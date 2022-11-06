<template>
    <div class="content">
        <!-- <div class="title">{{props.componentContent.webTitle}}</div> -->
        <div class="logo_item">
            <a-image :src="props.componentContent.webLogo" width="100px" height="50px" v-if="props.componentContent.isLogo" :preview="false" :fallback="'/resource/img/banner_default.png'"/>
            <a-input class="logo_input" placeholder="请输入搜索内容">
                <template #prefix>
                    <SearchOutlined /><div>|</div>
                </template>
            </a-input>
            <img src="../static/date.jpg" v-show="props.componentContent.isDate">
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
import { SearchOutlined  } from '@ant-design/icons-vue';
let props =  defineProps(['componentContent'])

</script>
<style lang="less" scoped>
.content{
}
.title{
    text-align: center;
    margin-bottom: 20px;
}
.logo_item{
    display: flex;
    align-items: center;
     margin: 0 10px;
}
.logo_input{
     border-radius: 15px;
     height: 40px;
     margin: 10px 10px;
}
</style>