import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();
const baseUploadUrl = globSetting.uploadUrl;
enum Api {
  positionList = '/sys/position/list',
  teacherList = '/teacherInfo/list',
  userList = '/sys/user/list',
  roleList = '/sys/role/list',
  queryDepartTreeSync = '/sys/sysDepart/queryDepartTreeSync',
  queryTreeList = '/sys/sysDepart/queryTreeList',
  loadTreeData = '/sys/category/loadTreeData',
  loadCateTreeRoot = '/system/systemCategory/rootList',
  loadCateTreeChild = '/system/systemCategory/childList',
  loadDictItem = '/sys/category/loadDictItem/',
  getDictItems = '/sys/dict/getDictItems/',
  getTableList = '/sys/user/queryUserComponentData',
  getCategoryData = '/sys/category/loadAllData',
  globalPageList = '/jumpCommon/findJumpCommonPageList',
  listArea = '/common/findAreaList',
  couponList = '/couponInfo/listForPage',
  sysDictList = '/jumpCommon/findSysDictList',
  memberList = '/system/systemMember/list',
}



/**
 * 行业分类-加载一级节点（如果是同步则所有数据）
 * @param params
 */
export const loadCateTreeRoot = (params) => {
  return defHttp.get({ url: Api.loadCateTreeRoot, params });
};

/**
 * 行业分类-加载子节点
 * @param params
 */
export const loadCateTreeChild = (params) => {
  return defHttp.get({ url: Api.loadCateTreeChild, params });
};

/**
 * 上传父路径
 */
export const uploadUrl = `${baseUploadUrl}/websiteThreeConfigure/uploadFile`;

/**
 * 职务列表
 * @param params
 */
export const getPositionList = (params) => {
  return defHttp.get({ url: Api.positionList, params });
};

/**
 * 教师列表
 * @param params
 */
export const getTeacherList = (params) => {
  return defHttp.get({ url: Api.teacherList, params });
};

/**
 *  学员列表
 * @param params
 */
 export const getMemberList = (params) => {
  return defHttp.get({ url: Api.memberList, params });
};

/**
 * 用户列表
 * @param params
 */
export const getUserList = (params) => {
  return defHttp.get({ url: Api.userList, params });
};

/**
 * 角色列表
 * @param params
 */
export const getRoleList = (params) => {
  return defHttp.get({ url: Api.roleList, params });
};

/**
 * 全局页面列表 - 其他列表
 * @param params
 */
export const getGlobalList = (params) => {
  return defHttp.get({ url: Api.globalPageList, params });
};

/**
 * 全局页面列表 - 页面
 * @param params
 */
export const getGlobalPageList = (params) => {
  return defHttp.get({ url: Api.sysDictList, params });
};

/**
 * 异步获取部门树列表
 */
export const queryDepartTreeSync = (params?) => {
  return defHttp.get({ url: Api.queryDepartTreeSync, params });
};
/**
 * 获取部门树列表
 */
export const queryTreeList = (params?) => {
  return defHttp.get({ url: Api.queryTreeList, params });
};

/**
 * 分类字典树控件 加载节点
 */
export const loadTreeData = (params?) => {
  return defHttp.get({ url: Api.loadTreeData, params });
};

/**
 * 根据字典code加载字典text
 */
export const loadDictItem = (params?) => {
  return defHttp.get({ url: Api.loadDictItem, params });
};

/**
 * 根据字典code加载字典text
 */
export const getDictItems = (dictCode) => {
  return defHttp.get({ url: Api.getDictItems + dictCode }, { joinTime: false });
};
/**
 * 部门用户modal选择列表加载list
 */
export const getTableList = (params) => {
  return defHttp.get({ url: Api.getTableList, params });
};
/**
 * 加载全部分类字典数据
 */
export const loadCategoryData = (params) => {
  return defHttp.get({ url: Api.getCategoryData, params });
};
/**
 * 文件上传
 */
export const uploadFile = (params, success) => {
  return defHttp.uploadFile({ url: uploadUrl }, params, { success });
};
/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export const downloadFile = (url, fileName?, parameter?) => {
  return getFileblob(url, parameter).then((data) => {
    if (!data || data.size === 0) {
      message.warning('文件下载失败');
      return;
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data]), fileName);
    } else {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  });
};

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export const getFileblob = (url, parameter) => {
  return defHttp.get(
    {
      url: url,
      params: parameter,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  );
};

  /**
   *  区域列表接口
   * @param params
   */
   export const listArea = (params) =>
   defHttp.get({url: Api.listArea, params});

/**
 * 加载优惠券数据
 */
 export const couponList = (params) => {
  return defHttp.get({ url: Api.couponList, params });
};
