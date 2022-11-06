import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/websiteAdvert/list',
  save='/websiteAdvert/add',
  edit='/websiteAdvert/edit',
  deleteOne = '/websiteAdvert/delete',
  queryInfoById = '/websiteAdvert/queryById',
  deleteBatch = '/websiteAdvert/deleteBatch',
  importExcel = '/websiteAdvert/importExcel',
  exportXls = '/websiteAdvert/exportXls',
  useCategory = '/websiteAdvert/updateUseCategory'
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
  if (isUpdate) {
    return defHttp.put({ url: url, params });
  } else {
    return defHttp.post({ url: url, params });
  }
}

/**
 * 使用
 * @param params
 */
 export const useCategory = (params) => {
  return defHttp.put({ url: Api.useCategory, params }, { joinParamsToUrl: true });
}

/**
 * 根据id查询底部导航
 * @param params
 */
 export const queryInfoById = (params) => {
  return defHttp.get({url: Api.queryInfoById, params});
}