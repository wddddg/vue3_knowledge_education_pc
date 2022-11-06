<template>
  <div class="panelBoxWarp">
    <div class="panelBox" :class="{'on':sidebarShow}">
      <!--<div class="componentList">-->
        <!--<ul>-->
          <!--<li v-for="(item, index) of componentList" :key="index" :class="{'on':componentActive == index}" @click="componentActive=index">-->
            <!--<i class="iconfont icon-fangkuai"></i>-->
            <!--<span>{{item}}</span>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <div class="categoryList">
        <div class="itemBox" v-for="(item, index) of setPanelList" :key="index">
          <div style="font-weight:700;font-size:18px"><CaretRightOutlined style="color:#1890ff" />{{item.title}}</div>
          <div class="childList">
            <draggable
              class="dragArea list-group"
              :list="item.sysDictItemVOList"
              :clone="cloneItem"
              :group="{ name: `pageEdit`, pull: 'clone', put: false }"
              :options="{sort:false}"
            >
              <template #item="{ element }">
                <div @mouseover="hoverItem (element)" @mouseout="hoverItemOut" class="childItem list-group-item">
                  <div class="childItemWarp">
                    <div class="contentBox">
                      <a-image :src="element.content" :width="50" :height="50" :preview="false" :fallback="'/resource/img/banner_default.png'"></a-image>
                      <span>{{element.itemText}}</span>
                    </div>
                    <div class="cloneText">
                      组件放置区域
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
    <div class="btnToggle" @click="sidebarShow=!sidebarShow" :class="{'on':sidebarShow}">
      <i class="iconfont icon-arrow-right"></i>
      <i class="iconfont icon-arrow-left"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // 默认配置文件
  import getPanelList from './panelList'
  import draggable from 'vuedraggable'
  import { ref, defineProps, watch, unref,watchEffect,inject } from 'vue';
  import {  CaretRightOutlined } from '@ant-design/icons-vue';
  
  let sidebarShow= ref(true)
  let componentActive= ref(0)
  let componentList= ref(['组件', '组件'])
  let panelList = ref(JSON.parse(JSON.stringify(getPanelList)))
  let isHover= ref('')
  const setPanelList = inject('setPanelList')



  function hoverItem (classItem) {
    isHover.value = classItem.title
  }
  function hoverItemOut () {
    isHover.value = ''
  }
  function cloneItem (item) {
    return JSON.parse(JSON.stringify(item))
  }

</script>

<style lang="less" scoped>
  .panelBoxWarp{
    position: relative;
    height: 100%;
  }
  .panelBox {
    width: 0px;
    min-height: 100%;
    display: flex;
    overflow: hidden;
    transition: 0.2s width ease;
    &.on{
      width: 300px;
    }
    .componentList{
      width: 64px;
      padding: 17px 0;
      text-align: center;
      li{
        position: relative;
        margin-bottom: 18px;
        .iconfont{
          font-size: 24px;
        }
        span{
          font-size: 12px;
          display: block;
        }
        &.on,&:hover{
          // color: $mainColor;
          :after{
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 2px;
            height: 100%;
            // background-color: $mainColor;
          }
        }
      }
    }
    .categoryList {
      border-left: 1px solid #F0F3F4;
      width: 250px;
      padding: 20px 0 20px 10px;
      .itemBox {
        h3 {
          padding-left: 20px;
          height: 35px;
          line-height: 35px;
          font-size: 16px;
          color: #333333;
          position: relative;
          &:before{
            content: '';
            // border-left:5px solid $mainColor;
            border-top:4px solid transparent;
            border-bottom:4px solid transparent;
            position: absolute;
            left: 10px;
            top: 50%;
            margin-top: -4px;
          }
        }
        .childList {
          font-size: 14px;
          color: #333333;
          padding: 20px 10px;
          .list-group{
            display: flex;
            flex-wrap: wrap;
            :hover {
              background: #4589fa;
              color: #ffffff;
              border-radius: 3px;
              //cursor: move;
            }
            .childItemWarp{
              height: 100px;
            }
            .childItem {
              width: 45%;
              border: 1px solid #ccc;
              margin: 5px;
              .contentBox{
                height: 100%;
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
                // border: 1px solid #ccc;
                cursor: move;
                .iconfont{
                  font-size: 30px;
                }
                span {
                  margin-top: 5px;
                }
              }
              .cloneText{
                display: none;
              }
            }
          }
        }
      }
    }
  }
  .btnToggle{
    width: 20px;
    height: 66px;
    background-color: #fff;
    border-radius: 0 20px 20px 0;
    position: absolute;
    right: -20px;
    top: 50%;
    margin-top: -33px;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 9;
    .icon-arrow-left{
      display: none;
    }
    &.on{
      .icon-arrow-left{
        display: block;
      }
      .icon-arrow-right{
        display: none;
      }
    }
  }
</style>
