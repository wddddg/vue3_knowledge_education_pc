<template>
    <div class="content">
        <div class="title">
            <h3 style="font-size: 18px;font-weight: 700;">书籍</h3><div style="color:#606266;">更多<RightOutlined /></div>
        </div>
        <div class="navigation">
            <div class="navigation_itme" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index" :style="{ width: 470/4 + 'px' }" 
            v-show="index <= 2" >
                <a-image :src="item.imgUrl" width="100%" height="140px" style="" :preview="false" :fallback="'/resource/img/banner_default.png'"/>
                <div class="navigation_text">
                    <div class="line" style="font-weight:700;overflow: hidden;height:25px">{{item.title}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
import {  RightOutlined } from '@ant-design/icons-vue';
let props =  defineProps(['componentContent'])

</script>
<style lang="less" scoped>

.content{
    margin: 10px;
    border: 1px solid #fff;
    border-radius: 10px;
    font-size: 15px;
    overflow: hidden;
    .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 10px;
    }
    .navigation{
        display: flex;
        align-items: center;
        flex-wrap:wrap;
        justify-content: flex-start;
        width: 200%;
        margin: 10px 10px;
        border-radius: 10px;
    }
    .navigation_itme{
        // text-align: center;
        margin-right: 20px;
        box-shadow: 4px 4px 9px 7px rgba(230, 230, 230, .9);
        border-radius: 10px;
        overflow: hidden;
    }
    .navigation_text{
        padding: 10px;
        height: 50px;
        // border: 1px solid #ccc;
        border-radius: 10px;
    }
    .box{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .box_itme{
        height: 10px;
        width: 40px;
        background: #ccc;
        margin: 10px;
    }
    .line{
        overflow:hidden;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-line;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:1;//显示的行数
    }
}


</style>