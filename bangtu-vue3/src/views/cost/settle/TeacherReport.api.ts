import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/teacherReport/listForPage',
  save='/settle/teacherReport/add',
  edit='/teacherReport/edit',
  deleteOne = '/settle/teacherReport/delete',
  deleteBatch = '/settle/teacherReport/deleteBatch',
  importExcel = '/settle/teacherReport/importExcel',
  exportXls = '/teacherReport/exportXls',
  getReport = '/teacherReport/listForReport',
  exportXlsTeacherDetails = '/system/systemMemberOrder/exportXlsTeacherDetails',
  listForTeacherReportDetailsPage = '/system/systemMemberOrder/listForTeacherReportDetailsPage',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
export const exportXlsTeacherDetails = Api.exportXlsTeacherDetails;
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
export const listForPage = (params) => defHttp.get({ url: Api.listForTeacherReportDetailsPage, params });

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
  return defHttp.put({url: url, params});
}

   /**
 * 阅读统计折线图
 * @param params
 */
    export const getReport = (params) =>
    defHttp.get({url: Api.getReport, params});