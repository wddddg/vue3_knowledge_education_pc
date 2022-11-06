import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue'

//模态窗口列表数据
export const modalTableColumns: BasicColumn[] = [
  {
    title: '封面',
    align: "left",
    width: 120,
    dataIndex: 'coverImg',
    // customRender:({record}) => {
    //   //
    //    return h('img',{ src:record.coverImg,style:{ margin:'auto 5px','max-width':'110px',width:'110px' } })
    //  },
    slots: { customRender: 'coverImg' },
  },
  {
    title: '素材信息',
    align: "left",
    width: 100,
    dataIndex: 'attachName'
  },
  {
    title: '大小',
    align: "center",
    width: 80,
    dataIndex: 'fileLengthStr',
    // customRender: ({ text }) => {
    //     let mSize = Math.ceil(text/1024);
    //     return mSize + "M";
    // },
  },
  {
    title: '类型', // 1、视频 2、音频 3、图片 4、文档
    align: "center",
    width: 60,
    dataIndex: 'fileSuffix'
  },
  {
    title: '上传方式',//1、本地 2、阿里云 3、七牛云
    align: "center",
    dataIndex: 'uploadType',
    width: 70,
    customRender: ({ text }) => {
      let result = "";
      switch (text) {
        case 1:
          result = "本地";
          break;
        case 2:
          result = "阿里云";
          break;
        case 3:
          result = "七牛云";
          break;
        default:
          break;
      }
      return result;
    },
  },
  {
    title: '创建人',
    align: "center",
    width: 70,
    dataIndex: 'createBy'
  },
  {
    title: '上传时间',
    align: "center",
    width: 120,
    dataIndex: 'createTime'
  },

];

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '封面',
    align: "center",
    dataIndex: 'coverImg',
    customRender: ({ record }) => {
      //
      return h('img', { src: record.coverImg, style: { width: '120px', margin: 'auto', height: '80px' }})
    },
  },
  {
    title: '素材信息',
    align: "left",
    width: 180,
    dataIndex: 'attachName'
  },
  {
    title: '大小',
    align: "center",
    width: 80,
    dataIndex: 'fileLengthStr',
    // customRender: ({ text }) => {
    //     let mSize = Math.ceil(text/1024);
    //     return mSize + "M";
    // },
  },
  {
    title: '类型', // 1、视频 2、音频 3、图片 4、文档
    align: "center",
    width: 60,
    dataIndex: 'fileSuffix'
  },
  {
    title: '上传方式',//1、本地 2、阿里云 3、七牛云
    align: "center",
    dataIndex: 'uploadType',
    width: 70,
    customRender: ({ text }) => {
      const color = text == '1' ? 'green' : text == '2' ? 'blue': 'red';
      return render.renderTag(text==1?'本地':text==2?'阿里云':'七牛云', color);
    },
  },
  {
    title: '创建人',
    align: "center",
    width: 70,
    dataIndex: 'createBy'
  },
  {
    title: '上传时间',
    align: "center",
    width: 130,
    dataIndex: 'createTime'
  },

];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: "素材名称",
    field: 'attachName',
    component: 'Input',
    colProps: { span: 6 },
  }
];
//表单数据
export const formSchema: FormSchema[] = [
  // {
  //   label: '上传平台：1、本地 2、阿里云 3、七牛云',
  //   field: 'uploadType',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '文件类型 1、视频 2、音频 3、图片 4、文档',
  //   field: 'fileType',
  //   component: 'InputNumber',
  // },
  {
    label: '所属分类',
    field: 'parentName',
    component: 'Input',
    componentProps: {
      disabled: true,
    }

  },
  {
    label: '资料分类1',
    field: 'oneCateId',
    component: 'Input',
    show: false,
  },
  {
    label: '资料分类2',
    field: 'twoCateId',
    component: 'Input',
    show: false,
  },
  {
    label: '文件',
    field: 'fileList',
    component: 'JUpload',
    slot: 'draggerUpload',
  },

  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
];

//编辑表单数据
export const formSchema1: FormSchema[] = [
  // {
  //   label: '上传平台：1、本地 2、阿里云 3、七牛云',
  //   field: 'uploadType',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '文件类型 1、视频 2、音频 3、图片 4、文档',
  //   field: 'fileType',
  //   component: 'InputNumber',
  // },
  {
    label: '文件名称',
    field: 'attachName',
    component: 'Input',
  },
  {
    label: '文件路径',
    field: 'fileUrl',
    component: 'Input',
  },

  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
];
