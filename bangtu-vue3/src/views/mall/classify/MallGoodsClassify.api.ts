import { defHttp } from "/@/utils/http/axios";
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/MallUserAddress/mallGoodsClassify/list',
  save = '/MallUserAddress/mallGoodsClassify/add',
  edit = '/MallUserAddress/mallGoodsClassify/edit',
  deleteMallGoodsClassify = '/MallUserAddress/mallGoodsClassify/delete',
  importExcel = '/classify/mallGoodsClassify/importExcel',
  exportXls = '/classify/mallGoodsClassify/exportXls',
  loadTreeData = '/classify/mallGoodsClassify/loadTreeRoot',
  getChildList = '/MallUserAddress/mallGoodsClassify/listByParentId',
  getChildListBatch = '/MallUserAddress/mallGoodsClassify/listByParentId',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 * @param params
 */
export const getImportUrl = Api.importExcel;
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({ url: Api.list, params });
/**
 * 删除
 */
export const deleteMallGoodsClassify = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteMallGoodsClassify, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const batchDeleteMallGoodsClassify = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteMallGoodsClassify, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdateDict = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  if (isUpdate) {
    return defHttp.put({ url: url, params });
  } else {
    return defHttp.post({ url: url, params });
  }
}
/**
 * 查询全部树形节点数据
 * @param params
 */
export const loadTreeData = (params) =>
  defHttp.get({ url: Api.loadTreeData, params });
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
