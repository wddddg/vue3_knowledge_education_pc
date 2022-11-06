import {defHttp} from '/@/utils/http/axios';
import {Modal} from 'ant-design-vue';

enum Api {
  list = '/attachmentInfo/list',
  save='/attachmentInfo/add',
  edit='/attachmentInfo/edit',
  deleteOne = '/attachmentInfo/delete',
  deleteBatch = '/attachmentInfo/deleteBatch',
  importExcel = '/attachmentInfo/importExcel',
  exportXls = '/attachmentInfo/exportXls',
  upload = '/attachmentInfo/add',
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
    if(isUpdate){
        let url = isUpdate ? Api.edit : Api.save;
        return defHttp.put({url: url, params});
    }else{
        let url = isUpdate ? Api.edit : Api.save;
        return defHttp.post({url: url, params});
    }

}

/**
 * 上传
 * @param params
 */
export const upload = (formData) => {
    let headers = {
      'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime(),
    };
    return defHttp.post({ url: Api.upload, params: formData, headers }, { isTransformResponse: false });
}
