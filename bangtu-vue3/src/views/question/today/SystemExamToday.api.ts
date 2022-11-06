import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/system/systemExamToday/list',
  save='/system/systemExamToday/add',
  edit='/system/systemExamToday/edit',
  deleteOne = '/system/systemExamToday/delete',
  deleteBatch = '/system/systemExamToday/deleteBatch',
  importExcel = '/system/systemExamToday/importExcel',
  exportXls = '/system/systemExamToday/exportXls',
  todayList = '/system/systemExamTodayList/list',
  addList = '/system/systemExamTodayList/addList',
  todayDeleteBatch = '/system/systemExamTodayList/deleteBatch',
  questionsList = '/system/systemQuestions/list',
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

export const todayList = (params) =>
  defHttp.get({url: Api.todayList, params});

export const questionsList = (params) =>
  defHttp.get({url: Api.questionsList, params});

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
 * 批量删除
 * @param params
 */
 export const todayDeleteBatch = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.todayDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
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
  return isUpdate ?defHttp.put({url: url, params}):defHttp.post({url: url, params});
}


export const addList = (params) =>
  defHttp.post({url: Api.addList, params});
