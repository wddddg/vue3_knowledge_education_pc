<template>
    <div class="content">
        <div class="title">
            <h3 style="font-size: 18px;font-weight: 700;">直播课</h3><div style="color:#606266;">更多<RightOutlined /></div>
        </div>
        <div class="navigation">
            <div class="navigation_itme" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index" :style="{ width: 470/4 + 'px' }" 
            v-show="index <= 2" >
                <div class="img">
                    <div class="count">12人观看</div>
                    <a-image :src="item.imgUrl" width="100%" height="100px" style="" :preview="false" :fallback="'/resource/img/banner_default.png'"/>
                    <div class="status" >预约</div>
                </div>
                <div class="navigation_text">
                    <div class="line" style="font-weight: 700;overflow: hidden;height:50px">{{item.title}}</div>
                    <div style="font-size: 14px;color:#ccc;margin-top:10px">{{item.createTime.substr(5,11)}}</div>
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
        flex-wrap:nowrap;
        justify-content: flex-start;
        width: 200%;
        margin: 10px 10px;
        border-radius: 10px;
    }
    .navigation_itme{
        // text-align: center;
        margin-right: 20px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 4px 4px 9px 7px rgba(230, 230, 230, .9);
        .img{
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            .count{
                width: 72px;
                height: 20px;
                background: #395AE1;
                border-radius: 6px 0px 100px 0px;
                opacity: 0.8;
                font-size: 10px;
                position: absolute;
                top: 0;
                z-index: 9;
                text-align: center;
                line-height: 20px;
                color: #fff;
            }
            .status{
                position: absolute;
                bottom: 5px;
                width: 118px;
                height: 20px;
                background: #000000;
                opacity: 0.6;
                // border-radius: 0px 0px 12px 12px;
                color:#fff;
                font-size:11px;
                text-align: center;
            }
        }
        
    }
    .navigation_text{
        height: 100px;
        // border: 1px solid #ccc;
        // border-top: 1px solid #fff;
        border-radius: 10px;
        padding: 10px;
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
        -webkit-line-clamp:2;//显示的行数
    }
}


</style>