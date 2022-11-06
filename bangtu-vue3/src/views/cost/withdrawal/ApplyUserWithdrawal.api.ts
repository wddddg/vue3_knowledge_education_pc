import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/applyUserWithdrawal/listForPage',
  save='/withdrawal/applyUserWithdrawal/add',
  edit='/applyUserWithdrawal/applyMoney',
  deleteOne = '/withdrawal/applyUserWithdrawal/delete',
  deleteBatch = '/withdrawal/applyUserWithdrawal/deleteBatch',
  importExcel = '/withdrawal/applyUserWithdrawal/importExcel',
  exportXls = '/applyUserWithdrawal/exportXls',
  getReport = '/applyUserWithdrawal/listForReport',
  applyMoneyBatch = '/applyUserWithdrawal/applyMoneyBatch',
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
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 删除单个
 */
export const deleteOne = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量操作
 * @param params
 */
export const applyMoneyBatch = (params, handleSuccess) => {
  return defHttp.put({url: Api.applyMoneyBatch, params},{joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}

/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.put({url: url, params});
}

   /**
 * 阅读统计折线图
 * @param params
 */
    export const getReport = (params) =>
    defHttp.get({url: Api.getReport, params});