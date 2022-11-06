import { defHttp } from '/@/utils/http/axios';

enum Api {
  loginfo = '/sys/loginfo',
  visitInfo = '/sys/visitInfo',
  getEchart = '/indexCommon/getEchart', //首页-统计趋势图（注册量、销售额、提现金额）
  indexCommon = '/indexCommon/index/count', //首页-统计趋势图（注册量、销售额、提现金额）
  pushCourseEchart = '/indexCommon/pushCourseEchart', //首页-课程发布量统计
  pushSalesEchart = '/indexCommon/pushSalesEchart', //首页-讲师销量排行榜
}
/**
 * 日志统计信息
 * @param params
 */
export const getLoginfo = (params) => defHttp.get({ url: Api.loginfo, params }, { isTransformResponse: false });
/**
 * 访问量信息
 * @param params
 */
export const getVisitInfo = (params) => defHttp.get({ url: Api.visitInfo, params }, { isTransformResponse: false });

export const getEchart = (params) => defHttp.get({ url: Api.getEchart, params }, { isTransformResponse: false });
export const indexCommon = (params) => defHttp.get({ url: Api.indexCommon, params }, { isTransformResponse: false });
export const pushCourseEchart = (params) => defHttp.get({ url: Api.pushCourseEchart, params }, { isTransformResponse: false });
export const pushSalesEchart = (params) => defHttp.get({ url: Api.pushSalesEchart, params }, { isTransformResponse: false });
