<template>
  <div>
    <template v-if="userInfo.userRoleType == 1">
      <div class="md:flex top-tit top-tit222">
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box mb20" :class="['!md:mr-4']" :style="{ height: heightCard }">
          <div style="padding: 8px 10px 0">
            <div class="itle">
              <div class="itleq">
                <img src="/src/assets/images/user-cont.png" />
                <span>总用户量</span>
              </div>
            </div>
            <div class="py-4 flex justify-between" style="padding: 12px 0 16px">
              <CountTo prefix="" :startVal="1" :endVal="countfo.allCount || 0" class="text-2xl text-price" />
            </div>
            <div class="p-2 flex justify-between bottm" style="padding-bottom: 12px">
              <div class="b-item">
                <span>{{ countfo.memberCount || 0 }}</span>
                <span>昨日注册</span>
              </div>
              <div class="b-item">
                <span>{{ countfo.monthCount || 0 }}</span>
                <span>本月注册</span>
              </div>
              <div class="b-item">
                <span>{{ countfo.todayCount || 0 }}</span>
                <span>今日注册</span>
              </div>
            </div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box mb20" :class="['!md:mr-4']" :style="{ height: heightCard }">
          <div style="padding: 8px 10px 0">
            <div class="itle">
              <div class="itleq">
                <img src="/src/assets/images/total-oder.png" />
                <span>订单总量</span>
              </div>
            </div>
            <div class="flex justify-between" style="padding: 12px 0 0">
              <CountTo prefix="" :startVal="1" :endVal="countfo.allOrderCount || 0" class="text-2xl text-price" />
            </div>
            <div ref="chartRef" style="height: 70px; margin: 18px auto 0"></div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box mb20" :class="['!md:mr-4']" :style="{ height: heightCard }">
          <div style="padding: 8px 10px 0">
            <div class="itle">
              <div class="itleq">
                <img src="/src/assets/images/user-cont.png" />
                <span>支付笔数</span>
              </div>
              <div class="cxmx item-pointer" @click="goLink('/cost/orderList')">去处理</div>
            </div>
            <div class="flex justify-between" style="padding: 12px 0 0">
              <CountTo prefix="" :startVal="1" :endVal="countfo.yearPayOrderCount || 0" class="text-2xl text-price" />
            </div>
            <div ref="barRef" style="height: 65px; margin: 6px auto 0"></div>
            <div class="flex bottm1" style="margin-top: -2px">
              <div class="b-item">
                <span>今日支付成功：</span>
                <span>{{ countfo.todayOrderCount || 0 }}</span>
              </div>
            </div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box mb20" :class="['!md:mr-4']" :style="{ height: heightCard }">
          <div style="padding: 8px 10px 0">
            <div class="itle">
              <div class="itleq">
                <img src="/src/assets/images/vip.png" />
                <span>付费会员</span>
              </div>
              <div class="cxmx item-pointer" @click="goLink('/member/associator')">查询明细</div>
            </div>
            <div class="py-4 flex justify-between" style="padding: 12px 0 16px">
              <CountTo prefix="" :startVal="1" :endVal="countfo.memberCount || 0" class="text-2xl text-price" />
            </div>
            <div class="bottm1">
              <div class="progress-bar">
                <div class="progress-bg" :style="{ width: countfo.memberPercent + '%' }"></div>
              </div>
              <div class="flex">
                <div class="b-item">
                  <span>超级会员：</span>
                  <span>{{ countfo.supMemberCount || 0 }}</span>
                </div>
                <div class="b-item" style="margin-left: 20px">
                  <span>普通会员：</span>
                  <span>{{ countfo.ordinaryMemberCount || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div class="md:flex top-tit222">
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box1" :class="['!md:mr-4']" :canExpan="false">
          <div class="box-item">
            <img src="/src/assets/images/icon1.png" />
            <div>
              <div class="tit">今日流水</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.todayMoney || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/member/associator')">查看明细</div>
            </div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box1" :class="['!md:mr-4']" :canExpan="false">
          <div class="box-item">
            <img src="/src/assets/images/icon4.png" />
            <div>
              <div class="tit">本月流水</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.monthMoney || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/cost/orderList')">查看明细</div>
            </div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box1" :class="['!md:mr-4']" :canExpan="false">
          <div class="box-item">
            <img src="/src/assets/images/icon2.png" />
            <div>
              <div class="tit">已入驻讲师</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.joinTotalTeacher || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/teacher/teacherList')">去处理</div>
            </div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box1" :class="['!md:mr-4']" :canExpan="false" style="margin-right: 0 !important">
          <div class="box-item">
            <img src="/src/assets/images/icon3.png" />
            <div>
              <div class="tit">习题数量</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.totalQuestion || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/question/info')">去查看</div>
            </div>
          </div>
        </Card>
      </div>
      <div class="box-full1" style="padding: 20px 20px 0">
        <div class="title-tip">快捷入口</div>
        <div class="index-box3">
          <template v-for="(item, index) in fastList" :key="index">
            <div class="box-item" @click="goLink(item.path)">
              {{ item.title }}
            </div>
          </template>
        </div>
      </div>
    </template>

    <template v-if="userInfo.userRoleType == 2">
      <div class="md:flex box-full box-full1" :loading="loading" style="margin-top: 0 !important">
        <div class="index-box2">
          <div class="box-item">
            <img src="/src/assets/images/icon11.png" />
            <div>
              <div class="tit">待上课</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.waitCourseCout || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/courseDate')">查看明细</div>
            </div>
          </div>
        </div>
        <div class="index-box2">
          <div class="box-item">
            <img src="/src/assets/images/icon12.png" />
            <div>
              <div class="tit">教材</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.totalCourseCout || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/onlineInfo')">查看明细</div>
            </div>
          </div>
        </div>
        <div class="index-box2">
          <div class="box-item">
            <img src="/src/assets/images/icon13.png" />
            <div>
              <div class="tit">考点集</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.knowledgeCout || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/knowledgeInfo')">查看明细</div>
            </div>
          </div>
        </div>
        <div class="index-box2">
          <div class="box-item">
            <img src="/src/assets/images/icon14.png" />
            <div>
              <div class="tit">书籍</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.bookCout || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/bookInfo')">查看明细</div>
            </div>
          </div>
        </div>
        <div class="index-box2">
          <div class="box-item">
            <img src="/src/assets/images/icon15.png" />
            <div>
              <div class="tit">参与的班级</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.joinClassCourseCout || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/courseInfo')">查看明细</div>
            </div>
          </div>
        </div>
        <div class="index-box2">
          <div class="box-item">
            <img src="/src/assets/images/icon16.png" />
            <div>
              <div class="tit">文章</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.pushNewsCount || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/news/newsList')">查看明细</div>
            </div>
          </div>
        </div>
      </div>
      <div class="md:flex top-tit222">
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box1 mb20 foes" :class="['!md:mr-4']" :canExpan="false">
          <div class="box-item box-itemno wh1002">
            <img src="/src/assets/images/icon1.png" />
            <div>
              <div class="tit">今日流水</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.todayMoney || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/cost/orderList')">查看明细</div>
            </div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box1 mb20 foes" :class="['!md:mr-4']" :canExpan="false">
          <div class="box-item box-itemno wh1002">
            <img src="/src/assets/images/icon4.png" />
            <div>
              <div class="tit">本月流水</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.monthMoney || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/cost/orderList')">查看明细</div>
            </div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box1 mb20 foes" :class="['!md:mr-4']" :canExpan="false">
          <div class="box-item box-itemno wh1002">
            <img src="/src/assets/images/icon2.png" />
            <div style="width: 80%">
              <div class="tit tipo"><span>订单总量</span> <div class="tit mignx" @click="goLink('/cost/orderList')">查询明细</div></div>
              <div class="flex justify-between" style="padding: 12px 0 0">
                <CountTo prefix="" :startVal="1" :endVal="countfo.allOrderCount || 0" class="text-2xl text-price" />
              </div>
              <div ref="chartRef" style="height: 70px; margin: 0 auto"></div>
            </div>
          </div>
        </Card>
        <Card size="small" :loading="loading" class="md:w-1/4 w-full !md:mt-0 !mt-4 index-box1 mb20 foes" :class="['!md:mr-4']" :canExpan="false" style="margin-right: 0 !important">
          <div class="box-item box-itemno wh1002">
            <img src="/src/assets/images/icon3.png" />
            <div>
              <div class="tit">待我回复文章</div>
              <div class="text-price">
                <CountTo prefix="" :startVal="1" :endVal="countfo.pushNewsCount || 0" class="text-2xl text-price" />
              </div>
              <div class="tit xingix" @click="goLink('/news/newsList')">去查看</div>
            </div>
          </div>
        </Card>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { CountTo } from '/@/components/CountTo/index';
  import { Card } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useGo, useRedo } from '/@/hooks/web/usePage';
  import * as echarts from 'echarts';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { indexCommon } from '../api';
  import { fastList } from '../data';

  const props = defineProps({
    loading: Boolean,
    countfo: Object,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '400px',
    },
  });
  let userInfo = useUserStore().userInfo;
  const go = useGo();
  const goLink = (url) => {
    go(url);
  };
  const loading = ref(true);
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const lineYData = ref([]);

  const barRef = ref<HTMLDivElement | null>(null);
  const { setOptions: setBarOptions } = useECharts(barRef as Ref<HTMLDivElement>);
  const barYData = ref([]);
  const heightCard = ref('190px');

  if (navigator.userAgent.indexOf('Safari') > 0) {
    heightCard.value = '216px';
  }

  const isMobile = () => {
    const sUserAgent = navigator.userAgent.toLowerCase();
    const bIsIpad = sUserAgent.match(/ipad/i) == 'ipad';
    const bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os';
    const bIsMidp = sUserAgent.match(/midp/i) == 'midp';
    const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
    const bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb';
    const bIsAndroid = sUserAgent.match(/android/i) == 'android';
    const bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce';
    const bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';

    if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
      return false;
    } else {
      return true;
    }
  };

  function initLogInfo() {
    indexCommon({}).then((res) => {
      if (res.success) {
        const data = res.result.allOrderList || [];
        let y = [];
        data.length > 0 &&
          data.map((it) => {
            y.push(it.y);
          });
        lineYData.value = y;
        const data1 = res.result.successOrderList || [];
        let y1 = [];
        data1.length > 0 &&
          data1.map((it, index) => {
            const data2 = {
              value: it.y,
              itemStyle: {
                color: index == 0 ? '#fed96c' : Math.floor(index / 2) == 0 ? '#97d87c' : '#fe7a7c',
              },
            };
            y1.push(data2);
          });
        barYData.value = y1;
        loading.value = false;
      }
    });
  }
  initLogInfo();

  watch(
    loading,
    () => {
      if (loading.value) {
        return;
      }
      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false, // 不显示坐标轴刻度线
          },
          axisLine: {
            show: true, // 不显示坐标轴线
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            show: false, // 不显示坐标轴上的文字
          },
          splitLine: {
            show: false, // 不显示网格线
          },
        },
        yAxis: {
          type: 'value',
          show: false, // 不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
          axisTick: {
            show: false, // 不显示坐标轴刻度线
          },
          axisLine: {
            show: false, // 不显示坐标轴线
          },
          axisLabel: {
            show: false, // 不显示坐标轴上的文字
          },
          splitLine: {
            show: false, // 不显示网格线
          },
        },
        series: [
          {
            data: lineYData.value,
            type: 'line',
            smooth: true,
            symbolSize: 0,
            lineStyle: {
              width: 0,
            },
            areaStyle: {
              opacity: 0.35,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: userInfo.userRoleType == 1 ? '#fff' : '#7895FF',
                },
                {
                  offset: 0,
                  color: userInfo.userRoleType == 1 ? '#fff' : '#3359E0',
                },
              ]),
            },
            itemStyle: {
              color: userInfo.userRoleType == 1 ? '#fff' : '#5664FF',
            },
          },
        ],
      });

      setBarOptions({
        xAxis: {
          type: 'category',
          axisTick: {
            show: false, // 不显示坐标轴刻度线
          },
          axisLine: {
            show: true, // 不显示坐标轴线
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            show: false, // 不显示坐标轴上的文字
          },
          splitLine: {
            show: false, // 不显示网格线
          },
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            data: barYData.value,
            // data: [
            //   {
            //     value: 200,
            //     itemStyle: {
            //       color: '#fed96c',
            //     },
            //   },
            //   {
            //     value: 150,
            //     itemStyle: {
            //       color: '#97d87c',
            //     },
            //   },
            //   {
            //     value: 80,
            //     itemStyle: {
            //       color: '#fe7a7c',
            //     },
            //   },
            //   {
            //     value: 110,
            //     itemStyle: {
            //       color: '#fed96c',
            //     },
            //   },
            //   {
            //     value: 200,
            //     itemStyle: {
            //       color: '#97d87c',
            //     },
            //   },
            //   {
            //     value: 130,
            //     itemStyle: {
            //       color: '#fe7a7c',
            //     },
            //   },
            // ],
            type: 'bar',
          },
        ],
      });
    },
    { immediate: true }
  );
  // console.log(2222, userInfo);
</script>
<style lang="less" scoped>
  .item-pointer {
    cursor: pointer;
  }
  .box-full1 {
    flex-wrap: wrap;
  }
  .top-tit /deep/ .ant-card-small > .ant-card-body {
    padding: 0 10px !important;
  }
  .index-box {
    background: linear-gradient(311deg, #534df3 0%, #976af3 100%);
    box-shadow: 10px 10px 20px 0px rgba(23, 20, 93, 0.08);
    border-radius: 8px;
    color: #fff;

    &:nth-child(1) {
      background: linear-gradient(311deg, #534df3 0%, #976af3 100%);
    }

    &:nth-child(2) {
      background: linear-gradient(144deg, #ffa554 0%, #ff716e 100%);
    }

    &:nth-child(3) {
      background: linear-gradient(135deg, #ff8f9e 0%, #8c57fb 100%);
    }

    &:nth-child(4) {
      background: linear-gradient(134deg, #2dcab1 0%, #219fe7 100%);
      margin-right: 0 !important;
    }

    .itle {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .itleq {
        display: flex;
        align-items: center;
        font-size: 18px;
      }

      img {
        height: 37px;
        margin-right: 12px;
      }
    }

    .text-price {
      font-size: 36px;
    }

    .cxmx {
      border-bottom: 1px solid #fff;
    }

    .bottm {
      // margin: 8px 0 8px;

      .b-item {
        display: flex;
        flex-direction: column;

        span {
          position: relative;
          display: block;

          &:nth-child(1) {
            font-size: 24px;
          }

          &:nth-child(2) {
            font-size: 14px;
            display: flex;
            align-items: center;

            &::after {
              content: '';
              width: 6px;
              height: 6px;
              border-radius: 100%;
              background: #5ab020;
              border: 1px solid #fff;
              display: block;
              position: absolute;
              left: -12px;
            }
          }
        }

        &:nth-child(1) {
          span {
            &:nth-child(2) {
              &::after {
                background: #5ab020;
              }
            }
          }
        }

        &:nth-child(2) {
          span {
            &:nth-child(2) {
              &::after {
                background: #ff9902;
              }
            }
          }
        }

        &:nth-child(3) {
          span {
            &:nth-child(2) {
              &::after {
                background: #ff6666;
              }
            }
          }
        }
      }
    }

    .bottm1 {
      margin-top: 10px;

      .progress-bar {
        width: 100%;
        height: 16px;
        background: #ffffff;
        border-radius: 8px;
        position: relative;
        margin-bottom: 16px;

        .progress-bg {
          position: absolute;
          left: 0;
          height: 16px;
          top: 0;
          background: #ffd86e;
          border-radius: 8px;
        }
      }

      .b-item {
        span {
          &:last-child {
            margin-left: 16px;
            font-size: 16px;
            color: #fdff39;
          }
        }
      }
    }
  }

  .index-box1 {
    border-radius: 8px;

    .box-item {
      padding: 10px;
      display: flex;
      align-items: center;

      img {
        width: 80px;
        height: 80px;
        background: #ecf6ff;
        margin-right: 27px;
        border-radius: 100%;
      }

      .tit {
        font-size: 16px;
        color: #7c8db5;
      }

      .text-price {
        color: #070f29;
        margin: 4px 0 8px;
      }
    }
  }

  .box-full {
    width: 100%;
    background: #fff;
    margin-top: 20px !important;
    justify-content: space-around;
    padding: 20px;
    border-radius: 8px;
  }

  .xingix {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;

    &::after {
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 7px 6px 0 6px;
      border-color: #4a78a3 transparent transparent transparent;
      margin-left: 8px;
    }
  }

  .index-box2 {
    background: #fff;
    width: 16%;

    .box-item {
      padding: 10px;
      display: flex;
      align-items: center;

      img {
        width: 60px;
        height: 60px;
        background: #ecf6ff;
        margin-right: 14px;
        border-radius: 100%;
      }

      .tit {
        font-size: 16px;
        color: #7c8db5;
      }

      .text-price {
        color: #070f29;
        margin: 4px 0 8px;
      }
    }
  }

  .box-full1 {
    width: 100%;
    background: #fff;
    margin: 20px auto !important;
    padding: 20px;
    border-radius: 8px;

    .title-tip {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      position: relative;

      &::before {
        content: '';
        display: block;
        width: 6px;
        height: 28px;
        background: #2c6afd;
        margin-right: 14px;
      }
    }
  }

  .index-box3 {
    background: #fff;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .box-item {
      display: flex;
      align-items: center;
      padding: 8px 40px;
      background: #2dc6d1;
      box-shadow: inset 0px 0px 4px 0px #2dc6d1;
      border-radius: 8px;
      border: 2px solid #2dc6d1;
      margin-right: 20px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      margin-bottom: 20px;
    }
  }
  .mb20 {
    margin-bottom: 20px !important;
  }
  .indexMoli {
    width: 100% !important;
  }
  @media (max-width: 1200px) {
    :deep(.ant-card) {
      width: 48% !important;
      margin-bottom: 20px;
    }
    .index-box2 {
      width: 33%;
    }
    :deep(.ant-card:nth-child(2n)) {
      margin-right: 0 !important;
    }
    .top-tit222 {
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
  @media (max-width: 798px) {
    .index-box2 {
      width: 50%;
      .box-item {
        width: 100%;
      }
    }
  }
  @media (max-width: 598px) {
    :deep(.ant-card) {
      width: 100% !important;
      margin-bottom: 20px;
    }
    :deep(.ant-card) {
      margin-right: 0 !important;
    }
    .top-tit222 {
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .index-box2 {
      width: 50%;
      .box-item {
        width: 100%;
      }
    }
  }
  .tipo {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .index-box1 .box-item .mignx {
    font-size: 14px;
  }
  .box-itemno {
    padding: 0 !important;
  }
  .foes {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    :deep(.ant-card-body) {
      width: 100%;
    }
  }
  .wh1002 {
    width: 100%;
  }
</style>
