import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/mallGoodsInfo/list',
  save = '/mallGoodsInfo/add',
  edit = '/mallGoodsInfo/edit',
  deleteOne = '/mallGoodsInfo/delete',
  deleteBatch = '/mallGoodsInfo/deleteBatch',
  importExcel = '/goods/mallGoodsInfo/importExcel',
  exportXls = '/goods/mallGoodsInfo/exportXls',
  batchOnline = '/mallGoodsInfo/batchOnline',
  editOther = '/mallGoodsInfo/editOther',
  classify = '/MallUserAddress/mallGoodsClassify/list',
  getInfoById = '/mallGoodsInfo/queryById'
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
  defHttp.get({ url: Api.list, params });

/**
 * 分类接口
 * @param params
 */
export const classify = (params) =>
  defHttp.get({ url: Api.classify, params });

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
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
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    }
  });
};
/**
 * 批量上线、下线
 * @param params
 */
export const batchOnline = (params,handleSuccess) => {
  let headers = {
    'Content-Type': 'application/x-www-form-urlencode'
  };
  return defHttp.put({ url: Api.batchOnline + "?ids=" + params.ids + "&status=" + params.status, params, headers }).then(() => {
    handleSuccess();
  });
}
/**
 * 上架状态,是否推荐
 * @param params
 */
export const switchBtn = (params) => {
  let url = Api.editOther;
  return defHttp.put({ url: url, params });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  if (isUpdate) {
    return defHttp.put({ url: url, params });
  } else {
    return defHttp.post({ url: url, params });
  }
}

/**
 * 根据id查询商品信息
 * @param params
 */
 export const getInfoById = (params) => {
  return defHttp.get({ url: Api.getInfoById, params });
}