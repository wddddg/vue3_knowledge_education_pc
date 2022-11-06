import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/bookInfo/listForPage',
  save='/bookInfo/add',
  edit='/bookInfo/edit',
  deleteOne = '/bookInfo/delete',
  deleteBatch = '/bookInfo/deleteBatch',
  onlineBatch = '/bookInfo/onlineBatch',
  importExcel = '/bookInfo/importExcel',
  exportXls = '/bookUserStudy/exportXls',
  id = '/bookInfo/queryById',
  bookSection = '/bookSection/findList',
  bookSectionById = '/bookSection/queryById',
  bookEditSection = '/bookSection/editSection',
  bookEditChapter = '/bookSection/editChapter',
  bookAddSection = '/bookSection/addSection',
  bookAddChapter = '/bookSection/addChapter',
  bookByIdDelete = '/bookSection/delete',
  bookUserStudy = '/bookUserStudy/listForPage',
  bookUserStudyReport = '/bookUserStudy/listForReport',
  loadTreeRoot = '/system/systemCategory/rootList',
  loadTreeRootChild = '/system/systemCategory/childList',
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
 * 批量上下线
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
 * 通过id查询书籍
 * @param params
 */
 export const byId = (params) =>
 defHttp.get({url: Api.id, params});

/**
 * 章节列表查询
 * @param params
 */
 export const getSectionList = (params) =>
 defHttp.get({url: Api.bookSection, params});

 /**
 * 通id查询章节列表
 * @param params
 */
  export const getSectionByIdList = (params) =>
  defHttp.get({url: Api.bookSectionById, params});
 
   /**
 * 章编辑
 * @param params
 */
    export const setBookEditSection = (params) =>
    defHttp.put({url: Api.bookEditSection, params});
 
     /**
 * 节编辑
 * @param params
 */
  export const setBookEditChapter = (params) =>
  defHttp.put({url: Api.bookEditChapter, params});
 
   /**
 * 章添加
 * @param params
 */
    export const setBookAddSection = (params) =>
    defHttp.post({url: Api.bookAddSection, params});
 
     /**
 * 节添加
 * @param params
 */
  export const setBookAddChapterr = (params) =>
  defHttp.post({url: Api.bookAddChapter, params});

     /**
 *  章节管理通过id删除
 * @param params
 */
      export const bookByIdDelete = (params) =>
      defHttp.delete({url: Api.bookByIdDelete+'?id='+ params});

 /**
 * 阅读统计列表查询
 * @param params
 */
  export const getbookUserStudy = (params) =>
  defHttp.get({url: Api.bookUserStudy, params});

   /**
 * 阅读统计折线图
 * @param params
 */
    export const getbookUserStudyReport = (params) =>
    defHttp.get({url: Api.bookUserStudyReport, params});

/**
 * 行业分类-加载一级节点（如果是同步则所有数据）
 * @param params
 */
 export const loadTreeRoot = (params) => {
  return defHttp.get({ url: Api.loadTreeRoot, params });
};

/**
 * 行业分类-加载一级以后节点（如果是同步则所有数据）
 * @param params
 */
 export const loadTreeRootChild = (params) => {
  return defHttp.get({ url: Api.loadTreeRootChild, params });
};