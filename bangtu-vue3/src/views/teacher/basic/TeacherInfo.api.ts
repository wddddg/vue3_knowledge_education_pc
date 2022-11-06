import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';
// import { ajaxGetDictItems } from '/@/utils/dict';

enum Api {
  list = '/teacherInfo/list',
  save = '/teacherInfo/add',
  saveAccount = '/teacherInfo/createAccount',

  edit = '/teacherInfo/edit',
  updateStatus = '/teacherInfo/updateStatus',
  deleteOne = '/teacherInfo/delete',
  deleteBatch = '/teacherInfo/deleteBatch',
  importExcel = '/teacherInfo/importExcel',
  exportXls = '/teacherInfo/exportXls',
  queryAddInit = '/teacherInfo/queryAddInit',
  loadTreeRoot = '/system/systemCategory/loadTreeRoot',
  queryById = '/teacherInfo/queryById',
  saveDivide = '/teacherInfo/addOrEditDivide',
  updatePsw = '/teacherInfo/updatePassword',
  batchApply = '/teacherInfo/batchApply',
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

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
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
  if (isUpdate) {
    return defHttp.put({ url: Api.edit, params });
  } else {
    return defHttp.post({ url: Api.save, params });
  }
};

/**
 * 更新状态
 * @param params
 */
export const updateStatus = (params) => {
  return defHttp.put({ url: Api.updateStatus, params });
};

/**
 * 讲师管理-收益分配初始化查询
 */
// export const queryAddInit = async (id: number) => {
// const params = {
//   id: id,
// };

// return defHttp.get({ url: Api.queryAddInit, params });
// }
export const queryAddInit = async () => {
  // return [
  //   {
  //     id: 1,
  //     categoryName: '线上课',
  //     isDivide: 1,
  //     divideRate: 2,
  //   },
  //   {
  //     id: 2,
  //     categoryName: '面授课',
  //     isDivide: 0,
  //     divideRate: 2,
  //   },
  // ];

  // const initResult = defHttp.get({ url: Api.queryAddInit });
  // console.log('initResult =>', initResult);

  // const { result } = await ajaxGetDictItems('teacherDivide', null);
  // console.log('result =>', result);

  // return result;

  const result = defHttp.get({ url: Api.queryAddInit });

  return result;
};

/**
 * 行业分类-加载一级节点（如果是同步则所有数据）
 */
export const loadTreeRoot = async () => {
  const params = {
    async: true,
    pcode: '',
  };

  return defHttp.get({ url: Api.loadTreeRoot, params });
};

/**
 * 账号管理
 */
export const saveAccount = (params) => {
  return defHttp.post({ url: Api.saveAccount, params });
};

/**
 * 根据id查询老师信息
 * @param params
 */
export const queryById = (params) => {
  return defHttp.get({ url: Api.queryById, params });
};

/**
 * 保存或者修改收益配置
 * @param params
 */
export const saveDivide = (params) => {
  return defHttp.post({ url: Api.saveDivide, params });
};

/**
 * 修改密码
 * @param params
 */
export const updatePsw = (params) => {
  return defHttp.post({ url: Api.updatePsw, params });
};

/**
 * 批量通过或拒绝
 * @param params
 */
export const batchApply = (params, handleSuccess) => {
  return defHttp.post({ url: `${Api.batchApply}?ids=${params.ids}&status=${params.status}`, params }).then(() => {
    handleSuccess();
  });
};
