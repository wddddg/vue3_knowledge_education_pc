import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  getCourseClassReport = '/courseInfo/getCourseClassReport',
  CourseClasslist = '/course/courseClassStudent/list',
  save='/course/courseClassStudent/add',
  edit='/course/courseClassStudent/edit',
  deleteOne = '/course/courseClassStudent/delete',
  deleteBatch = '/course/courseClassStudent/deleteBatch',
  importExcel = '/course/courseClassStudent/importExcel',
  exportXls = '/course/courseClassStudent/exportXls',
  id = '/course/courseClassStudent/queryById',
  updateEnable = '/course/courseClassStudent/updateEnable',
  CoursePagelist = '/course/courseSection/listForStartCoursePage',
  queryLiveBySectionId = '/course/courseSection/queryLiveBySectionId',
  editLiveStatus = '/course/courseSection/editLiveStatus'
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
 * 学员管理列表接口
 * @param params
 */
export const CourseClasslist = (params) =>
  defHttp.get({url: Api.CourseClasslist, params});

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
 * 学员列表启用或关闭
 * @param params
 */
  export const updateEnable = (params) =>
  defHttp.put({url: Api.updateEnable, params});
 
 /**
 * 查询统计数据
 * @param params
 */
  export const getCourseClassReport = (params) =>
  defHttp.get({url: Api.getCourseClassReport, params});

  /**
 * 排课列表接口
 * @param params
 */
export const CoursePagelist = (params) =>
defHttp.get({url: Api.CoursePagelist, params});

  /**
 * 获取推流地址
 * @param params
 */
   export const queryLiveBySectionId = (params) =>
   defHttp.get({url: Api.queryLiveBySectionId, params});

  /**
 * 编辑直播状态
 * @param params
 */
    export const editLiveStatus = (params,handleSuccess) =>
    defHttp.put({url: Api.editLiveStatus, params}).then(() => {
      handleSuccess();
    });
   