import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/websiteHtmlCustom/list',
  save='/websiteHtmlCustom/add',
  edit='/websiteHtmlCustom/edit',
  deleteOne = '/websiteHtmlCustom/delete',
  deleteBatch = '/websiteHtmlCustom/deleteBatch',
  importExcel = '/websiteHtmlCustom/importExcel',
  exportXls = '/websiteHtmlCustom/exportXls',
  updateUseCategory = '/websiteHtmlCustom/updateUseCategory',
  queryById = '/websiteHtmlCustom/queryById',
  queryAddInit = '/websiteHtmlCustom/queryAddInit',
  editTitle = '/websiteHtmlCustom/editTitle',
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
      return defHttp.delete({url: Api.deleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return isUpdate ? defHttp.put({url: url, params}) : defHttp.post({url: url, params}) 
}

/**
 * 使用终端接口
 * @param params
 */
 export const updateUseCategory = (params) =>
 defHttp.put({url: Api.updateUseCategory, params}, {joinParamsToUrl: true});

 /**
 * 通id查询
 * @param params
 */
export const queryById = (params) =>
defHttp.get({url: Api.queryById, params});
 
/**
 * 添加初始化
 * @param params
 */
  export const queryAddInit = (params) =>
  defHttp.get({url: Api.queryAddInit, params});
  /**
   * 修改标题
   * @param params
   */
    export const editTitle = (params) =>
    defHttp.put({url: Api.editTitle, params});
    
  