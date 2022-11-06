import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/courseInfo/listForPage',
  save='/courseInfo/add',
  edit='/courseInfo/edit',
  deleteOne = '/courseInfo/delete',
  deleteBatch = '/courseInfo/deleteBatch',
  importExcel = '/courseInfo/importExcel',
  exportXls = '/courseInfo/exportXls',
  id = '/courseInfo/queryById',
  bookUserStudy = '/bookUserStudy/listForPage',
  Dict = '/common/findSysDictList',
  addOrUpdatePriceConfig = '/courseInfo/addOrUpdatePriceConfig',
  addOrUpdateClassCourse = '/courseInfo/addOrUpdateClassCourse',
  teacherQueryById = '/teacherInfo/queryById',
  onlineBatch = '/courseInfo/onlineBatch',
  listByCourseId = '/course/courseClassRelation/listByCourseId',
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
 * 阅读统计列表查询
 * @param params
 */
   export const getbookUserStudy = (params) =>
   defHttp.get({url: Api.bookUserStudy, params});

     /**
 * 查询字典
 * @param params
 */
      export const getDict = (params) =>
      defHttp.get({url: Api.Dict, params});

     /**
 * 修改课程价格配置
 * @param params
 */
      export const addOrUpdatePriceConfig = (params) =>
      defHttp.post({url: Api.addOrUpdatePriceConfig, params});

     /**
 * 修改课程关联配置
 * @param params
 */
      export const addOrUpdateClassCourse = (params) =>
      defHttp.post({url: Api.addOrUpdateClassCourse, params});

     /**
 * 查询讲师信息
 * @param params
 */
      export const teacherQueryById = (params) =>
      defHttp.get({url: Api.teacherQueryById, params});

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
 * 查询课程关联信息
 * @param params
 */
      export const listByCourseId = (params) =>
      defHttp.get({url: Api.listByCourseId, params});
