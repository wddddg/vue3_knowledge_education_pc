import { defHttp } from '/@/utils/http/axios';

enum Api {
  queryById = '/integralRule/queryById',
  edit = '/integralRule/edit',
}
export const queryById = (params) => defHttp.get({ url: Api.queryById, params });
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params) => {
  return defHttp.put({ url: Api.edit, params });
};
