import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/system/systemQuestionsChapter/rootList',
  save='/system/systemQuestionsChapter/add',
  edit='/system/systemQuestionsChapter/edit',
  deleteOne = '/system/systemQuestionsChapter/delete',
  deleteBatch = '/system/systemQuestionsChapter/deleteBatch',
  importExcel = '/system/systemQuestionsChapter/importExcel',
  exportXls = '/system/systemQuestionsChapter/exportXls',
  getChildList= "/system/systemQuestionsChapter/childList",
  getChildListBatch= "/system/systemQuestionsChapter/getChildListBatch",
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
export const deleteOne = (params,deleteSuccess) => {
  return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
    deleteSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params, deleteSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.deleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        deleteSuccess();
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
/**
 * 查询子节点数据
 * @param params
 */
 export const getChildList = (params) =>
 defHttp.get({ url: Api.getChildList, params });
/**
* 批量查询子节点数据
* @param params
*/
export const getChildListBatch = (params) =>
 defHttp.get({ url: Api.getChildListBatch, params }, { isTransformResponse: false });