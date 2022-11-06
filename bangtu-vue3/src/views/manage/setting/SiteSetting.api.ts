/*
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-21 23:32:41
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-23 10:47:23
 */

import { defHttp } from '/@/utils/http/axios';
// import { Modal } from 'ant-design-vue';

enum Api {
  queryBaseConfig = '/websiteBaseConfigure/queryWebInfo',
  editBaseConfig = '/websiteBaseConfigure/edit',
  queryWatermark = '/websiteWatermark/queryById',
  editWatermark = '/websiteWatermark/edit',
  queryPayRule = '/websitePayRule/queryById',
  editPayRule = '/websitePayRule/edit',
  queryThreeConfigure = '/websiteThreeConfigure/queryById',
  editThreeConfigure = '/websiteThreeConfigure/edit',
}

/**
 * 基础配置-查询
 * @param params
 */
export const queryBaseConfig = (params) => defHttp.get({ url: Api.queryBaseConfig, params });

/**
 * 基础配置-编辑
 * @param params
 */
export const editBaseConfig = (params) => {
  return defHttp.put({ url: Api.editBaseConfig, params });
};

/**
 * 水印-查询
 * @param params
 */
export const queryWatermark = (params) => defHttp.get({ url: Api.queryWatermark, params });

/**
 * 水印-编辑
 * @param params
 */
export const editWatermark = (params) => {
  return defHttp.put({ url: Api.editWatermark, params });
};

/**
 * 支付配置-查询
 * @param params
 */
export const queryPayRule = (params) => defHttp.get({ url: Api.queryPayRule, params });

/**
 * 支付配置-编辑
 * @param params
 */
export const editPayRule = (params) => {
  return defHttp.put({ url: Api.editPayRule, params });
};

/**
 * 第三方配置- 查询
 * @param params
 */
export const queryThreeConfigure = (params) => defHttp.get({ url: Api.queryThreeConfigure, params });

/**
 * 第三方配置-编辑
 * @param params
 */
export const editThreeConfigure = (params) => {
  return defHttp.put({ url: Api.editThreeConfigure, params });
};
