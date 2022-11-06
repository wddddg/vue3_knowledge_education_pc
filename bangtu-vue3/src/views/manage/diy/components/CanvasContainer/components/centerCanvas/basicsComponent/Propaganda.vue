<template>
    <div style="margin:10px">
        <div class="content">
            <div class="left_one">
                <!-- <img src="../static/bg_ziwoceshi.png" style="height:100px"> -->
                <div class="left_one_text">
                    <div style="font-size: 15px;">{{props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneOneRows}}</div>
                    <div>{{props.componentContent.websiteHtmlCustomModuleLinkVOList[0].leftOneTwoRows}}</div>
                </div>
            </div>
            <div class="right">
                <div class="right_one">
                    <div class="right_text">{{props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightOneOneRows}}</div>
                </div>
                <div style="height:10%"></div>
                <div class="right_two">
                    <div class="right_text">{{props.componentContent.websiteHtmlCustomModuleLinkVOList[0].rightTwoOneRows}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect } from 'vue';
let props =  defineProps(['componentContent'])

</script>
<style lang="less" scoped>
.title{
    text-align: center;
    margin-bottom: 20px;
}
.content{
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 200px;
    font-size: 20px;
    color: #fff;
}
.left_one{
    width: 45%;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
    background: url(../static/left-one@2x.png) no-repeat ;
    background-size: cover;
    position: relative;
}
.left_one_text{
    // margin-top: 40px;
    // text-align: center;
    font-size: 14px;
    position: absolute;
    top: 20px;
    left: 10px;
}
.right{
    width: 45%;
    height: 100%;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    text-align: center;  
}
.right_one{
    height: 45%;
    border: 1px solid #ccc;
    background: url(../static/right-one@2x.png) no-repeat;
    background-size: cover;
    border-radius: 10px;
    position: relative;
}
.right_two{
    height: 45%;
    border: 1px solid #ccc;
    background: url(../static/right-two@2x.png) no-repeat;
    background-size: cover;
    border-radius: 10px;
    position: relative;
}
.right_text{
    // margin-top: 20px;
    font-size: 14px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
}
</style>