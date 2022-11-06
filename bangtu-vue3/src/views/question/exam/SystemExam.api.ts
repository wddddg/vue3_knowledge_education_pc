import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/system/systemExam/list',
  save='/system/systemExam/add',
  edit='/system/systemExam/edit',
  deleteOne = '/system/systemExam/delete',
  deleteBatch = '/system/systemExam/deleteBatch',
  importExcel = '/system/systemExam/importExcel',
  exportXls = '/system/systemExam/exportXls',
  querySystemExamListByMainId = '/system/systemExam/querySystemExamListByMainId',
  systemExamListDeleteBatch = '/system/systemExamList/deleteBatch',
  getQuestionCount = '/system/systemQuestionsChapter/getQuestionCount',
  getByChapter = '/system/systemQuestions/getByChapter',
  addByType = '/system/systemExamList/addByType',
  addList = '/system/systemExamList/addList',
  queryById = '/system/systemExam/queryById',
  LogList = '/system/systemExamLog/list',
  LogItemList = '/system/systemExamLogItem/list',
  
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

export const querySystemExamListByMainId = (params) =>
  defHttp.get({url: Api.querySystemExamListByMainId, params});

export const getQuestionCount = (params) =>
  defHttp.get({url: Api.getQuestionCount, params});

export const getByChapter = (params) =>
  defHttp.get({url: Api.getByChapter, params});

export const queryById = (params) =>
  defHttp.get({url: Api.queryById, params});

export const LogList = (params) =>
  defHttp.get({url: Api.LogList, params});

export const LogItemList = (params) =>
  defHttp.get({url: Api.LogItemList, params});

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
export const systemExamListDeleteBatch = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.systemExamListDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
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

export const addByType = (params) =>
  defHttp.post({url: Api.addByType, params});

export const addList = (params) =>
  defHttp.post({url: Api.addList, params});
