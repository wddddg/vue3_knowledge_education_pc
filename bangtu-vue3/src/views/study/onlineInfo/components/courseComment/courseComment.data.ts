import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import {h} from 'vue'
import { Switch } from 'ant-design-vue';
import { render } from '/@/utils/common/renderUtils';
import { cloneDeep } from 'lodash-es';
import { saveOrUpdate } from './courseComment.api';
import { useMessage } from '/@/hooks/web/useMessage';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '评论用户',
    align:"center",
    dataIndex: 'nickName',
    customRender:({record}) => {
      // 
       return h('div',{},[render.renderImage({ text:record.headImg || '' }),record.nickName])
     },
   },
   {
    title: '手机号',
    align:"center",
    dataIndex: 'phone'
   },
   {
    title: '类型',
    align:"center",
    dataIndex: 'commentType',
    customRender:({record}) => {
      return h('div',{
        
      },record.commentType==1?'评论':'答疑')
    }
   },
   {
    title: '评论内容',
    align:"center",
    dataIndex: 'content',
   },
   {
    title: '回复内容',
    align:"center",
    dataIndex: 'replyContent',
   },
  //  {
  //   title: '状态',
  //   align:"center",
  //   dataIndex: 'isEnable',
  //   customRender:({record}) => {
  //      return  h(Switch,{
  //       checked: record.isEnable == 1,
  //       checkedChildren: '×',
  //       unCheckedChildren: '√',
  //       loading: record.pendingStatus,
  //       onClick(checked:boolean){
  //         record.pendingStatus = true;
  //         let newStatus = checked?1:0;
  //         const { createMessage } = useMessage();
  //         let data = cloneDeep(record);
  //         data.isEnable = newStatus;
  //         saveOrUpdate(data,true).then(res =>{
  //           record.isEnable = newStatus;
  //         }).catch(() => {
  //           createMessage.error('修改状态失败');
  //         }).finally(() => {
  //           record.pendingStatus = false;
  //         });
  //       }
  //      })
  //    },
  //  },
   {
    title: '评论时间',
    align:"center",
    dataIndex: 'updateTime',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
   },
   {
    title: '回复时间',
    align:"center",
    dataIndex: 'replyTime',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
   },
   {
    title: '评分',
    align:"center",
    dataIndex: 'complexScore',
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	// {
  //     label: "课程名称",
  //     field: 'courseName',
  //     component: 'Input',
  //     componentProps: {
  //     },
  //     colProps: {span: 6},
 	// },
   {
     label: "学员信息",
     field: 'searchParam',
     component: 'Input',
     componentProps: {
       "placeholder": '请输入姓名/手机号'
     },
     colProps: { span: 6 },
   },
   {
       label: "评论时间",
       field: 'datetime',
       component: 'RangePicker',
       componentProps: {
         format: 'YYYY-MM-DD HH:mm:ss',
       },
       colProps: {span: 6},
    },
   {
       label: "类型",
       field: 'commentType',
       component: 'Select',
       componentProps: {
         options: [
           {
             label: '评论',
             value: 1,
           },
           {
             label: '答疑',
             value: 2,
           }
         ],
       },
       colProps: {span: 6},
    },
    // {
    //     label: "回复状态",
    //     field: 'isEnable',
    //     component: 'Select',
    //     componentProps: {
    //       options: [
    //         {
    //           label: '已回',
    //           value: 1,
    //         },
    //         {
    //           label: '未回',
    //           value: 2,
    //         }
    //       ],
    //     },
    //     colProps: {span: 6},
    //  },
];
