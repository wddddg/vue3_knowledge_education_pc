import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/system/systemQuestions/list',
  save='/system/systemQuestions/add',
  edit='/system/systemQuestions/edit',
  deleteOne = '/system/systemQuestions/delete',
  deleteBatch = '/system/systemQuestions/deleteBatch',
  importExcel = '/system/systemQuestions/importExcel',
  exportXls = '/system/systemQuestions/exportXls',
  queryByCateId = '/system/systemHistoryExam/queryByCateId',
  findSysDictList = '/common/findSysDictList',
  exportXlsTemp = '/system/systemQuestions/exportXlsTemp',
  queryCateId = '/system/systemQuestionsChapter/queryCateId',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const importExcel = (params) =>
    defHttp.post({url: Api.importExcel, params});
  
/**
 * 下载导入模板
 */
 export const exportXlsTemp = Api.exportXlsTemp;
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

export const queryByCateId = (params) =>
    defHttp.get({url: Api.queryByCateId, params});
  

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
  return isUpdate ?defHttp.put({url: url, params}):defHttp.post({url: url, params});
}

// 字典表-列表查询
export const findSysDictList = (params) =>
    defHttp.get({url: Api.findSysDictList, params});
    
// id查询行业
export const queryCateId = (params) =>
    defHttp.get({url: Api.queryCateId, params});