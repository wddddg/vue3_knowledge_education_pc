import { defHttp } from '/@/utils/http/axios';
import { Modal } from 'ant-design-vue';

enum Api {
    newsList = '/newsInfo/list', 
    knowledgeInfoList = '/knowledgeInfo/listForPage', 
    bookInfoList = '/bookInfo/listForPage', 
    courseInfoList = '/courseInfo/listForPage', 
}

/**
 * 文章列表接口
 * @param params
 */
export const newsList = (params) => defHttp.get({ url: Api.newsList, params });

/**
 * 资料库列表接口
 * @param params
 */
export const knowledgeInfoList = (params) => defHttp.get({ url: Api.knowledgeInfoList, params });

/**
* 电子书籍列表接口
* @param params
*/
export const bookInfoList = (params) => defHttp.get({ url: Api.bookInfoList, params });

/**
 * 课程列表接口
 * @param params
 */
export const courseInfoList = (params) => defHttp.get({ url: Api.courseInfoList, params });