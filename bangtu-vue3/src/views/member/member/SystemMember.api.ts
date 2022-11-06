import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/system/systemMember/list',
  save='/system/systemMember/add',
  edit='/system/systemMember/edit',
  deleteOne = '/system/systemMember/delete',
  deleteBatch = '/system/systemMember/deleteBatch',
  importExcel = '/system/systemMember/importExcel',
  exportXls = '/system/systemMember/exportXls',
  listArea = '/common/findAreaList',
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
   *  区域列表接口
   * @param params
   */
  export const listArea = (params) =>
    defHttp.get({url: Api.listArea, params});


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
  return defHttp.post({url: url, params});
}


/**
 * 更新
 * @param params
 */
export const updateData = (params) => {
  let url = Api.edit ;
  return defHttp.put({url: url, params});
}
