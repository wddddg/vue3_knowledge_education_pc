<template>
    <div class="content">
        <div class="title">
            <h3 style="font-size: 18px;font-weight: 700;">资讯专区</h3><div style="color:#606266;">更多<RightOutlined /></div>
        </div>
        <div class="navigation">
            <div class="navigation_itme" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index"  
             >
                <!-- <a-image :src="item.imgUrl" width="30%" height="100%" style=""/> -->
                <div class="navigation_text">
                    <!-- <div style="font-weight: 700;">产品设计类专升本混合加强版（冲刺班）</div> -->
                    <div class="line">{{item.title}}</div>
                    <div class="navigation_but">
                        <div style="color:#ccc;margin-bottom:10px">{{item.createTime}}</div>
                        <div style="color:#ccc;margin-bottom:10px">
                            <span style="color:#ccc;margin-right:10px"><LikeOutlined />{{'5'}}</span>
                            <span><MessageOutlined />{{'7'}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="more">查看更多</div> -->
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
import {  RightOutlined,LikeOutlined,MessageOutlined } from '@ant-design/icons-vue';
let props =  defineProps(['componentContent'])

</script>
<style lang="less" scoped>

.content{
    margin: 10px;
    // border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 15px;
    .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 10px;
    }
    .navigation{
        // display: flex;
        // align-items: center;
        // flex-wrap:wrap;
        // justify-content: flex-start;
        margin: 10px 10px;
        border-radius: 10px;
        // background: #f2f2f2;
        border-radius: 10px;
        padding: 10px;
    }
    .navigation_itme{
        display: flex;
        align-items: center;
        // height: 120px;
        margin-bottom: 30px;
        border-radius: 10px;
        box-shadow: 4px 4px 9px 9px rgba(230, 230, 230, .9);
    }
    .navigation_text{
        height: 100%;
        width: 100%;
        // border: 1px solid #ccc;
        // border-bottom: 1px solid #ccc;
        // border-radius:0 10px 10px 0;
        padding: 20px;
    }
    .navigation_but {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        position: relative;
        // top: 50%;
        // transform: translateY(-50%);
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
    .more{
        font-size: 20px;
        color:#ccc;
        margin:10px 0;
        text-align: center;
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