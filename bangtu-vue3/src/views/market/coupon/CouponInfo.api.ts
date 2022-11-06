import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/couponInfo/listForPage',
  save = '/couponInfo/add',
  edit = '/couponInfo/edit',
  deleteOne = '/couponInfo/delete',
  deleteBatch = '/couponInfo/deleteBatch',
  importExcel = '/couponInfo/importExcel',
  exportXls = '/couponInfo/exportXls',
  listForPage = '/couponUserRecord/listForPage', //优惠券使用情况-分页列表查询
  IntegralUserDayInfo = '/couponKeyInfo/listForPage', //优惠券兑换码-兑换码列表
  couponKeyInfoAdd = '/couponKeyInfo/add', //优惠券兑换码-兑换码列表
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
export const listForPage = (params) => defHttp.get({ url: Api.listForPage, params });
export const IntegralUserDayInfo = (params) => defHttp.get({ url: Api.IntegralUserDayInfo, params });
/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  const url = !isUpdate ? Api.save : Api.edit;
  if (!isUpdate) {
    return defHttp.post({ url: url, params });
  } else {
    return defHttp.put({ url: url, params });
  }
};
/**
 * 保存或者更新
 * @param params
 */
export const couponKeyInfoAdd = (params, isUpdate) => {
  const url = !isUpdate ? Api.couponKeyInfoAdd : Api.edit;
  if (!isUpdate) {
    return defHttp.post({ url: url, params });
  } else {
    return defHttp.put({ url: url, params });
  }
};
