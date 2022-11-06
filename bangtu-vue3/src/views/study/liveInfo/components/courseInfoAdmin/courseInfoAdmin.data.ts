import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import {h} from 'vue'
import { Switch } from 'ant-design-vue';
import { render } from '/@/utils/common/renderUtils';
import { cloneDeep } from 'lodash-es';
import { updateEnable } from './courseInfoAdmin.api';
import { useMessage } from '/@/hooks/web/useMessage';
//列表数据
export const columnsClassStudent: BasicColumn[] = [
   {
    title: '学员名称',
    align:"left",
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
  //  {
  //   title: '报名时间',
  //   align:"center",
  //   dataIndex: 'createTime',
  //   // customRender:({text}) =>{
  //   //   return !text?"":(text.length>10?text.substr(0,10):text)
  //   // },
  //  },
  //  {
  //   title: '学习时长',
  //   align:"center",
  //   dataIndex: 'studyDuration',
  //   // customRender:({text}) =>{
  //   //   return !text?"":(text.length>10?text.substr(0,10):text)
  //   // },
  //  },
   {
    title: '状态',
    align:"center",
    dataIndex: 'beginsStatus',
    customRender:({record}) => {
      return h('div',{
        style:record.beginsStatus==1?'color:#009c21':'color:#cd3113',
      },record.beginsStatus==1?'已报名':'取消预约')
    }
   },
   {
    title: '报名时间',
    align:"center",
    dataIndex: 'createTime',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
   },
  //  {
  //   title: '操作',
  //   align:"center",
  //   dataIndex: 'status',
  //   customRender:({record}) => {
  //      return  h(Switch,{
  //       checked: record.status == 1,
  //       checkedChildren: '×',
  //       unCheckedChildren: '√',
  //       loading: record.pendingStatus,
  //       onClick(checked:boolean){
  //         record.pendingStatus = true;
  //         let newStatus = checked?1:0;
  //         const { createMessage } = useMessage();
  //         // let data = cloneDeep(record);
  //         // data.isEnable = newStatus;
  //         let data = {
  //           status:record.status,
  //           userId:record.userId
  //         }
  //         updateEnable(data).then(res =>{
  //           record.status = newStatus;
  //         }).catch(() => {
  //           createMessage.error('修改状态失败');
  //         }).finally(() => {
  //           record.pendingStatus = false;
  //         });
  //       }
  //      })
  //    },
  //  },
];
export const columnsPage: BasicColumn[] = [
  {
   title: '课程名称',
   align:"center",
   dataIndex: 'goodsName',
   customRender:({record}) => {
     // 
      return h('div',{},[render.renderImage({ text:record.headImg || '' }),record.nickName])
    },
  },
  {
   title: '所属章',
   align:"center",
   dataIndex: 'parentName'
  },
  {
   title: '所属节',
   align:"center",
   dataIndex: 'name',
   // customRender:({text}) =>{
   //   return !text?"":(text.length>10?text.substr(0,10):text)
   // },
  },
  {
   title: '课程分类',
   align:"center",
   // dataIndex: 'oneCateName',
   customRender:({record}) => {
      return record.oneCateName+'-'+record.twoCateName+'-'+record.threeCateName
    },
  },
  {
   title: '上课时间',
   align:"center",
   dataIndex: 'startTime',
   // customRender:({text}) =>{
   //   return !text?"":(text.length>10?text.substr(0,10):text)
   // },
  },
  {
   title: '状态',
   align:"center",
   dataIndex: 'currentStatus',
   customRender:({record}) => {
     return h('div',{
        style:record.currentStatus==1?'color:#7693fb':'color:#ff6620'
     },record.currentStatus==1?'待开始':record.currentStatus==2?'正在上课':'已结束')
   }
  },
  {
   title: '类型',
   align:"center",
   dataIndex: 'sectionType',
   customRender:({record}) => {
     return h('div',{
      style:record.sectionType==3?'color:#7693fb':'color:#ff6620'
     },record.sectionType==1?'视频':record.sectionType==2?'图文':record.sectionType==3?'直播':record.sectionType==4?'线下':'音频')
   }
  },
  {
   title: '操作',
   align:"center",
   dataIndex: 'studyStatus',
   customRender:({record}) => {
     return h('div',{
       
     },record.studyStatus==3?'开播':'点名')
   }
  },
  // {
  //  title: '操作',
  //  align:"center",
  //  dataIndex: 'status',
  //  customRender:({record}) => {
  //     return  h(Switch,{
  //      checked: record.status == 1,
  //      checkedChildren: '×',
  //      unCheckedChildren: '√',
  //      loading: record.pendingStatus,
  //      onClick(checked:boolean){
  //        record.pendingStatus = true;
  //        let newStatus = checked?1:0;
  //        const { createMessage } = useMessage();
  //        // let data = cloneDeep(record);
  //        // data.isEnable = newStatus;
  //        let data = {
  //          status:newStatus,
  //          id:record.id
  //        }
  //        updateEnable(data).then(res =>{
  //          record.status = newStatus;
  //        }).catch(() => {
  //          createMessage.error('修改状态失败');
  //        }).finally(() => {
  //          record.pendingStatus = false;
  //        });
  //      }
  //     })
  //   },
  // },
];
//查询数据
export const searchFormClassStudentSchema: FormSchema[] = [
	{
      label: "搜索内容",
      field: 'searchParam',
      component: 'Input',
      componentProps: {
        placeholder:'请输入姓名/手机号'
      },
      colProps: {span: 6},
 	},
   {
       label: "报名状态",
       field: 'beginsStatus',
       component: 'Select',
       componentProps: {
         options: [
           {
             label: '已报名',
             value: 1,
           },
           {
             label: '取消预约',
             value: 2,
           },
         ],
       },
       colProps: {span: 6},
    },
    // {
    //     label: "课程名称",
    //     field: 'nickName',
    //     component: 'Input',
    //     colProps: {span: 6},
    //  },
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
export const searchFormPageSchema: FormSchema[] = [
	
    {
      label: "课程名称",
      field: 'goodsName',
      component: 'Input',
      colProps: {span: 6},
  },
  {
      label: '负责讲师',
      field: 'teacherName',
      component: 'JSelectTeacher',
      colProps: {
         span: 6
      },
      componentProps: {
        rowKey: 'code',
        labelKey: 'name',
      },
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