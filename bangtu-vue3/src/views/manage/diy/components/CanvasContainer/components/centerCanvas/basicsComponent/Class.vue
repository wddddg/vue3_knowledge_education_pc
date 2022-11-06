<template>
    <div class="content">
        <div class="title">
            <h3 style="font-size: 18px;font-weight: 700;">精品好课</h3>
        </div>
        <a-tabs :tabBarStyle="{width:'100%'}" size="" :tabBarGutter="18" v-model:activeKey="props.componentContent.tabPage">
            <a-tab-pane key="1" tab="精品课">
                <div class="navigation">
                    <div class="navigation_itme" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index"  
                    v-show="item.courseType == 1" >
                        <div class="img">
                            <div class="aImage">
                                <a-image :src="item.imgUrl" width="120px" height="100px" :preview="false" :fallback="'/resource/img/banner_default.png'"/>
                            </div>
                        </div>
                        <div class="navigation_text">
                            <div class="line" style="font-weight: 700;overflow: hidden;height:45px">{{item.title}}</div>
                            <div style="margin-top:10px;display:flex;align-items:center">
                                <div style="height:18px;width:18px;border-radius:18px;background:#ccc;margin-right:5px"></div>
                                <div style="color:#ccc">李老师</div>
                            </div>
                            <div class="navigation_but">
                                <div >{{`￥${item.presentPrice?item.presentPrice:'199'}`}}</div>
                                <a-button type="primary" style="background:#395AE1" @click="setTab">立即学习</a-button>
                            </div>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="直播课">
                <div class="navigation">
                    <div class="navigation_itme" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index"  
                    v-show="item.courseType == 2" >
                        <div class="img">
                            <div class="aImage">
                                <a-image :src="item.imgUrl" width="120px" height="100px" :preview="false" :fallback="'/resource/img/banner_default.png'"/>
                            </div>
                        </div>
                        <div class="navigation_text">
                            <div class="line" style="font-weight: 700;overflow: hidden;height:45px">{{item.title}}</div>
                            <div style="margin-top:10px;display:flex;align-items:center">
                                <div style="height:18px;width:18px;border-radius:18px;background:#ccc;margin-right:5px"></div>
                                <div style="color:#ccc">李老师</div>
                            </div>
                            <div class="navigation_but">
                                <div >{{`￥${item.presentPrice?item.presentPrice:'199'}`}}</div>
                                <a-button type="primary" style="background:#395AE1" @click="setTab">立即学习</a-button>
                            </div>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="线上课">
                <div class="navigation">
                    <div class="navigation_itme" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index"  
                    v-show="item.courseType == 3" >
                        <div class="img">
                            <div class="aImage">
                                <a-image :src="item.imgUrl" width="120px" height="100px" :preview="false" :fallback="'/resource/img/banner_default.png'"/>
                            </div>
                        </div>
                        <div class="navigation_text">
                            <div class="line" style="font-weight: 700;overflow: hidden;height:45px">{{item.title}}</div>
                            <div style="margin-top:10px;display:flex;align-items:center">
                                <div style="height:18px;width:18px;border-radius:18px;background:#ccc;margin-right:5px"></div>
                                <div style="color:#ccc">李老师</div>
                            </div>
                            <div class="navigation_but">
                                <div >{{`￥${item.presentPrice?item.presentPrice:'199'}`}}</div>
                                <a-button type="primary" style="background:#395AE1" @click="setTab">立即学习</a-button>
                            </div>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="4" tab="面授课">
                <div class="navigation">
                    <div class="navigation_itme" v-for="(item, index) in props.componentContent.websiteHtmlCustomModuleLinkVOList" :key="index"  
                    v-show="item.courseType == 4" >
                        <div class="img">
                            <div class="aImage">
                                <a-image :src="item.imgUrl" width="120px" height="100px" :preview="false" :fallback="'/resource/img/banner_default.png'"/>
                            </div>
                        </div>
                        <div class="navigation_text">
                            <div class="line" style="font-weight: 700;overflow: hidden;height:45px">{{item.title}}</div>
                            <div style="margin-top:10px;display:flex;align-items:center">
                                <div style="height:18px;width:18px;border-radius:18px;background:#ccc;margin-right:5px"></div>
                                <div style="color:#ccc">李老师</div>
                            </div>
                            <div class="navigation_but">
                                <div >{{`￥${item.presentPrice?item.presentPrice:'199'}`}}</div>
                                <a-button type="primary" style="background:#395AE1" @click="setTab">立即学习</a-button>
                            </div>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <div class="more">查看更多></div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
let props =  defineProps(['componentContent'])

function setTab(k){
    
    
}

</script>
<style lang="less" scoped>

.content{
    margin: 10px;
    border: 1px solid #fff;
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
    }
    .navigation_itme{
        display: flex;
        align-items: center;
        height: 150px;
        margin-bottom: 30px;
        box-shadow: 4px 4px 9px 9px rgba(230, 230, 230, .9);
        border-radius: 10px;
        overflow: hidden;
        .img{
            width:45%;
            height:100%;
            position: relative;
            .aImage{
                height: 100px;
                position: absolute;
                left: 10px;
                top: 20px;
                overflow: hidden;
                border-radius: 12px;
            }
        }
    }
    .navigation_text{
        height: 100%;
        width: 70%;
        // border: 1px solid #ccc;
        border-radius: 10px;
        padding: 20px;
        
    }
    .navigation_but {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        color:red;
        margin-top:10px
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
        font-size: 15px;
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