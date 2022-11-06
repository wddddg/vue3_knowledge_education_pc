import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/applyUserRelation/listForPage',
  save = '/applyUserRelation/add',
  edit = '/applyUserRelation/edit',
  deleteOne = '/retailPosterImg/delete', //课程或系统海报-通过id删除
  deleteBatch = '/applyUserRelation/deleteBatch',
  importExcel = '/applyUserRelation/importExcel',
  exportXls = '/applyUserRelation/exportXls',
  addOrEdit = '/retailWithdrawRule/addOrEdit', //提现规则-添加或修改
  queryInfo = '/retailWithdrawRule/queryInfo', // 提现规则-查询详情
  findList = '/retailPosterImg/findList',
  listForPage = '/applyUserRelationDetails/list',
  retailRule = '/retailRule/queryInfo', // 分销配置-查询详情
  retailRuleAddOrEdit = '/retailRule/addOrEdit', // 分销配置-添加或修改
  retailPosterImg = '/retailPosterImg/add',
  findSelectList = '/couponInfo/findSelectList'
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
export const listForPage = (params) => defHttp.get({ url: Api.listForPage, params });
/**
 * 删除单个 课程或系统海报-通过id删除
 */
export const deleteOne = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
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

/**
 * 提现规则-添加或修改
 * @param params
 */
export const addOrEdit = (params) => {
  return defHttp.post({ url: Api.addOrEdit, params });
};

/**
 * 提现规则-查询详情
 * @param params
 */
export const queryInfo = (params) => {
  return defHttp.get({ url: Api.queryInfo, params });
};

/**
 * 课程或系统海报-列表查询
 * @param params
 */
export const findList = (params) => {
  return defHttp.get({ url: Api.findList, params });
};

/**
 * 分销配置-添加或修改
 * @param params
 */
export const retailRuleAddOrEdit = (params) => {
  return defHttp.post({ url: Api.retailRuleAddOrEdit, params });
};

/**
 * 分销配置-查询详情
 * @param params
 */
export const retailRule = (params) => {
  return defHttp.get({ url: Api.retailRule, params });
};

/**
 * @description: Upload interface
 */
export const uploadApi = (params) => {
  return defHttp.post({ url: Api.retailPosterImg, params });
};

/**
 * 查询优惠券
 */
 export const findSelectList = () => {
  return defHttp.get({ url: Api.findSelectList });
};
