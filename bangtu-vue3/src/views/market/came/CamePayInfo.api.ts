
import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/camePayInfo/listForPage',
  save = '/camePayInfo/add',
  edit = '/camePayInfo/edit',
  deleteOne = '/camePayInfo/delete',
  deleteBatch = '/camePayInfo/deleteBatch',
  importExcel = '/camePayInfo/importExcel',
  exportXls = '/camePayRecordInfo/exportXls',
  camePayRecordInfo = '/camePayRecordInfo/listForPage',
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
export const camePayRecordInfo = (params) => defHttp.get({ url: Api.camePayRecordInfo, params });

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
