import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/courseInfo/listForPage',
  save='/courseInfo/add',
  edit='/courseInfo/edit',
  deleteOne = '/courseInfo/delete',
  deleteBatch = '/courseInfo/deleteBatch',
  importExcel = '/courseInfo/importExcel',
  exportXls = '/course/courseUserStudy/exportXls',
  id = '/courseInfo/queryById',
  bookUserStudy = '/bookUserStudy/listForPage',
  Dict = '/common/findSysDictList',
  addOrUpdatePriceConfig = '/courseInfo/addOrUpdatePriceConfig',
  addOrUpdateClassCourse = '/courseInfo/addOrUpdateClassCourse',
  teacherQueryById = '/teacherInfo/queryById',
  courseSectionList = '/course/courseSection/courseSectionList',
  courseSectionDeleteList ='/course/courseSection/delete',
  courseLiveGoodsList ='/course/courseLiveGoods/list',
  courseLiveGoodsAdd ='/course/courseLiveGoods/add',
  courseLiveGoodsDelete ='/course/courseLiveGoods/delete',
  findJumpQuestionPageList ='/jumpCommon/findJumpQuestionPageList',
  courseSectionPracticeList ='/course/courseSectionPractice/list',
  courseSectionPracticeAdd ='/course/courseSectionPractice/add',
  courseSectionPracticeDelete ='/course/courseSectionPractice/delete',
  courseSectionAdd ='/course/courseSection/add', 
  courseSectionEdit ='/course/courseSection/edit', 
  courseUserStudy ='/course/courseUserStudy/list', 
  listForReport ='/course/courseUserStudy/listForReport', 
  getCourseStatistics ='/course/courseUserStudy/getCourseStatistics', 
  systemExamList ='/system/systemExam/list', 
  addOrUpdateCourseExam ='/courseInfo/addOrUpdateCourseExam', 
  onlineBatch = '/courseInfo/onlineBatch',
  queryCourseById = '/courseInfo/queryCourseById',
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
 * 获取章节列表
 * @param params
 */
      export const getSectionList = (params) =>
      defHttp.get({url: Api.courseSectionList, params});
      
      

     /**
 * 通过id章节删除
 * @param params
 */
      export const courseSectionDeleteList = (params) =>
      defHttp.delete({url: Api.courseSectionDeleteList, params},{joinParamsToUrl: true});

     /**
 * 查询直播带货列表
 * @param params
 */
      export const courseLiveGoodsList = (params) =>
      defHttp.get({url: Api.courseLiveGoodsList, params});

     /**
 * 添加直播带货id
 * @param params
 */
      export const courseLiveGoodsAdd = (params) =>
      defHttp.post({url: Api.courseLiveGoodsAdd, params});

     /**
 * 通过id删除直播带货
 * @param params
 */
      export const courseLiveGoodsDelete = (params) =>
      defHttp.delete({url: Api.courseLiveGoodsDelete, params},{joinParamsToUrl: true});

     /**
 * 全局跳转查询习题列表
 * @param params
 */
      export const findJumpQuestionPageList = (params) =>
      defHttp.get({url: Api.findJumpQuestionPageList, params});

     /**
 * 查询习题列表
 * @param params
 */
      export const courseSectionPracticeList = (params) =>
      defHttp.get({url: Api.courseSectionPracticeList, params});

     /**
 * 查询习题列表
 * @param params
 */
      export const courseSectionPracticeAdd = (params) =>
      defHttp.post({url: Api.courseSectionPracticeAdd, params});

     /**
 * 通过id删除题目
 * @param params
 */
      export const courseSectionPracticeDelete = (params) =>
      defHttp.delete({url: Api.courseSectionPracticeDelete, params},{joinParamsToUrl: true});

     /**
 * 章节管理添加
 * @param params
 */
      export const courseSectionAdd = (params) =>
      defHttp.post({url: Api.courseSectionAdd, params});

     /**
 * 章节管理编辑
 * @param params
 */
      export const courseSectionEdit = (params) =>
      defHttp.put({url: Api.courseSectionEdit, params});

     /**
 * 查询学习统计列表
 * @param params
 */
      export const courseUserStudy = (params) =>
      defHttp.get({url: Api.courseUserStudy, params});

     /**
 * 查询学习统计列报表
 * @param params
 */
      export const listForReport = (params) =>
      defHttp.get({url: Api.listForReport, params});

     /**
 * 查询学习统计列报表
 * @param params
 */
      export const getCourseStatistics = (params) =>
      defHttp.get({url: Api.getCourseStatistics, params});

  /**
 * 模拟考试列表查询
 * @param params
 */
   export const systemExamList = (params) =>
   defHttp.get({url: Api.systemExamList, params});

  /**
 * 关联课件和考试
 * @param params
 */
   export const addOrUpdateCourseExam = (params) =>
   defHttp.post({url: Api.addOrUpdateCourseExam, params});



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
* 课时数量或课程时长-通过id查询
* @param params
*/
 export const queryCourseById = (params) =>
 defHttp.get({url: Api.queryCourseById, params});
