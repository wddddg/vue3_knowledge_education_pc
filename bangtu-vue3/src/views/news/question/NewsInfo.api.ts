import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
  list = '/newsInfo/list', // 文章管理-分页列表查询
  save = '/newsInfo/add', //文章管理-添加
  edit = '/newsInfo/edit',
  deleteOne = '/newsInfo/delete', // 文章管理-删除
  deleteBatch = '/newsInfo/deleteBatch', // 文章管理-批量删除
  importExcel = '/newsInfo/importExcel',
  exportXls = '/newsInfo/exportXls',
  batchOnline = '/newsInfo/batchOnline', // 文章管理-批量上线或下线
  batchApply = '/newsInfo/batchApply',
  commentList = '/newsComment/list',
  commentDeleteBatch = '/newsComment/deleteBatch',
  loadTreeRoot = '/system/systemCategory/rootList',
  loadTreeChild = '/system/systemCategory/childList',
  newsCommentAdd = '/newsComment/add', //文章管理-添加
  newsCommentEdit = '/newsComment/edit',
  newsCommentDelete = '/newsComment/delete',
  findListByParentId = '/newsComment/findListByParentId',
  queryById = '/newsInfo/queryById',
  editStatus = '/newsInfo/editStatus',
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
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据?',
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
    content: '是否删除选中数据?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteBatch, params }, { joinParamsToUrl: true }).then(() => {
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
  const url = isUpdate ? Api.edit : Api.save;
  if (isUpdate) {
    return defHttp.put({ url: url, params });
  } else {
    return defHttp.post({ url: url, params });
  }
};
/**
 * 文章管理-批量上线或下线
 * @param params
 */
export const batchOnline = (params, handleSuccess) => {
  return defHttp.put({ url: `${Api.batchOnline}?ids=${params.ids}&status=${params.status}`, params }).then(() => {
    handleSuccess();
  });
};
/**
 * 文章管理-批量通过或拒绝
 * @param params
 */
export const batchApply = (params, handleSuccess) => {
  return defHttp.put({ url: `${Api.batchApply}?ids=${params.ids}&status=${params.status}`, params }).then(() => {
    handleSuccess();
  });
};

/**
 * 评论管理-分页列表查询
 * @param params
 */
export const getCommentList = (params) => defHttp.get({ url: Api.commentList, params });

/**
 * 评论管理-根据父级分类查询子分类
 * @param params
 */
export const getChildList = (params) => {
  return defHttp.get({ url: Api.findListByParentId, params });
};
/**
 * 批量删除
 * @param params
 */
export const commentDeleteBatch = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: `${Api.commentDeleteBatch}`, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};

/**
 * 行业分类-加载一级节点（如果是同步则所有数据）
 * @param params
 */
export const loadTreeRoot = (params) => {
  return defHttp.get({ url: Api.loadTreeRoot, params });
};

/**
 * 行业分类-加载子节点
 * @param params
 */
export const loadTreeChild = (params) => {
  return defHttp.get({ url: Api.loadTreeChild, params });
};
/**
 * 删除单个
 */
export const commentDeleteOne = (params, handleSuccess) => {
  Modal.confirm({
    title: '确认删除',
    content: '是否删除选中数据?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: `${Api.newsCommentDelete}`, params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};

/**
 * 评论管理-添加或者更新
 * @param params
 */
export const newsCommentsaveOrUpdate = (params, isUpdate) => {
  const url = !isUpdate ? Api.newsCommentAdd : Api.newsCommentEdit;
  if (!isUpdate) {
    return defHttp.post({ url: url, params });
  } else {
    return defHttp.put({ url: url, params });
  }
};

/**
 * 文章管理-根据id查询
 * @param params
 */
export const queryById = (params) => {
  return defHttp.get({ url: Api.queryById, params });
};

/**
 * 文章管理-编辑(置顶、排序)
 * @param params
 */
export const editStatus = (params) => {
  return defHttp.put({ url: Api.editStatus, params });
};
