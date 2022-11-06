import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/knowledgeInfo/listForPage',
  save='/knowledgeInfo/add',
  edit='/knowledgeInfo/edit',
  deleteOne = '/knowledgeInfo/delete',
  deleteBatch = '/knowledgeInfo/deleteBatch',
  onlineBatch = '/knowledgeInfo/onlineBatch',
  importExcel = '/knowledgeInfo/importExcel',
  exportXls = '/knowledgeInfo/exportXls',
  id = '/knowledgeInfo/queryById',
  updateRecommend = '/knowledgeInfo/updateRecommend',
  updateTop = '/knowledgeInfo/updateTop',
  loadTreeRoot = '/system/systemCategory/loadTreeRoot',
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
 * 批量启停
 * @param params
 */
 export const onlineBatch = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认操作',
    content: '是否操作选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.put({url: Api.onlineBatch, data: params}, {joinParamsToUrl: true}).then(() => {
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
 * 修改推荐
 * @param params
 */
  export const updateRecommend = (params) =>
  defHttp.put({url: Api.updateRecommend, params});

 /**
 * 修改置顶
 * @param params
 */
  export const updateTop = (params) =>
  defHttp.put({url: Api.updateTop, params});

/**
 * 行业分类-加载一级节点（如果是同步则所有数据）
 * @param params
 */
 export const loadTreeRoot = (params) => {
  return defHttp.get({ url: Api.loadTreeRoot, params });
};