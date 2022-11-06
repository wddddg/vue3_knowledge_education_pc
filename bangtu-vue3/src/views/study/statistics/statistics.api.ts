import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/knowledgeInfo/listForPage',
  save='/knowledgeInfo/add',
  edit='/knowledgeInfo/edit',
  deleteOne = '/knowledgeInfo/delete',
  deleteBatch = '/knowledgeInfo/deleteBatch',
  importExcel = '/knowledgeInfo/importExcel',
  exportXls = '/knowledgeInfo/exportXls',
  id = '/knowledgeInfo/queryById',
  listForReport = '/courseInfo/getStudyReport',
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
  return isUpdate ? defHttp.put({url: url, params}) : defHttp.post({url: url, params}); 
}

/**
 * 通过id查询资料
 * @param params
 */
 export const byId = (params) =>
 defHttp.get({url: Api.id, params});

 /**
 * 获取教学统计
 * @param params
 */
  export const listForReport = (params) =>
  defHttp.get({url: Api.listForReport, params});

 /**
 * 获取统计
 * @param params
 */
  export const getReportList = (url,params) =>
  defHttp.get({url: url, params});
  