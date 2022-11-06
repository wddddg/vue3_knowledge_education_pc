import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { h } from 'vue'
import { Switch,Button } from 'ant-design-vue';
import { render } from '/@/utils/common/renderUtils';
import { cloneDeep } from 'lodash-es';
import { updateEnable } from './courseDate.api';
import { useMessage } from '/@/hooks/web/useMessage';
//列表数据
export const columnsClassStudent: BasicColumn[] = [
  {
    title: '学员信息',
    align: "center",
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      //
      return h('div', {}, [record.nickName])
      //  return h('div',{},[render.renderImage(record.headImg),record.nickName])
    },
  },
  {
    title: '学员手机号',
    align: "center",
    dataIndex: 'phone'
  },
  {
    title: '报名时间',
    align: "center",
    dataIndex: 'createTime',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
  },
  {
    title: '学习时长',
    align: "center",
    dataIndex: 'studyDuration',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
  },
  {
    title: '学习状态',
    align: "center",
    dataIndex: 'studyStatus',
    customRender: ({ record }) => {
      return h('div', {
        style: record.studyStatus == 1 ? 'color:#009c21' : record.studyStatus == 2 ? 'color:#ff0017' : 'color:#fe9b2a',
      }, record.studyStatus == 1 ? '已完成' : record.studyStatus == 2 ? '学习中' : '未学习')
    }
  },
  {
    title: '最后学习时间',
    align: "center",
    dataIndex: 'updateTime',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
  },
  {
    title: '操作',
    align: "center",
    dataIndex: 'status',
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.status == 1,
        checkedChildren: '×',
        unCheckedChildren: '√',
        loading: record.pendingStatus,
        onClick(checked: boolean) {
          record.pendingStatus = true;
          let newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          // let data = cloneDeep(record);
          // data.isEnable = newStatus;
          let data = {
            status: record.status,
            userId: record.userId
          }
          updateEnable(data).then(res => {
            record.status = newStatus;
          }).catch(() => {
            createMessage.error('修改状态失败');
          }).finally(() => {
            record.pendingStatus = false;
          });
        }
      })
    },
  },
];
export const columnsPage: BasicColumn[] = [
  {
    title: '封面',
    align: "center",
    dataIndex: 'imgUrl',
    customRender: ({ record }) => {
      return h('img', { src: record.imgUrl, style: 'height:80px;width:120px;' })
    },
  },
  {
    title: '课程名称',
    align: "center",
    dataIndex: 'courseName',
    // customRender: ({ record }) => {
    //   //
    //   return h('div', {}, [record.courseName])
    //   // return h('div',{},[render.renderImage(record.headImg),record.nickName])
    // },
  },
  {
    title: '所属章',
    align: "center",
    dataIndex: 'parentName'
  },
  {
    title: '所属节',
    align: "center",
    dataIndex: 'name',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
  },
  {
    title: '课程分类',
    align: "center",
    // dataIndex: 'oneCateName',
    customRender: ({ record }) => {
      let one = record.oneCateName ? record.oneCateName : ''
      let two = record.twoCateName ? '-' + record.twoCateName : ''
      let three = record.threeCateName ? '-' + record.threeCateName : ''
      return one + two + three
    },
  },
  {
    title: '上课时间',
    align: "center",
    dataIndex: 'startTime',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
  },
  {
    title: '状态',
    align: "center",
    dataIndex: 'liveStatus',
    customRender: ({ record }) => {
      const color = record.sectionType == '3' ? 'red' : 'green';
      return render.renderTag(record.statusStr, color);
    }
  },
  {
    title: '类型',
    align: "center",
    dataIndex: 'sectionType',
    customRender: ({ record }) => {
      return h('div', {
        style: record.sectionType == 3 ? 'color:#7693fb' : 'color:#ff6620'
      }, record.sectionType == 3 ? '直播' : '面授')
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
      placeholder: '请输入姓名/手机号'
    },
    colProps: { span: 6 },
  },
  {
    label: "学习状态",
    field: 'studyStatus',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '已完成',
          value: 1,
        },
        {
          label: '学习中',
          value: 2,
        },
        {
          label: '未学习',
          value: 3,
        }
      ],
    },
    colProps: { span: 6 },
  },
  {
    label: "课程名称",
    field: 'nickName',
    component: 'Input',
    colProps: { span: 6 },
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
export const searchFormPageSchema: FormSchema[] = function (userInfo) {
  return [
    {
      label: "课程名称",
      field: 'goodsName',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: '负责讲师',
      field: 'teacherId',
      component: 'JSelectTeacher',
      colProps: {
        span: 6
      },
      componentProps: {
        rowKey: 'code',
        labelKey: 'name',
      },
      ifShow: function () {
        return userInfo.userRoleType != 2
      }
    },
    {
      label: "课程分类",
      field: '',
      component: 'JMsTreeSelect',
      componentProps: ({ formActionType, formModel }) => {
        return {
          onChange: function (e) {
            console.log(formModel, e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
          }
        }
      },
      colProps: { span: 6 },
      ifShow: function () {
        return userInfo.userRoleType != 2
      }
    },
    {
      label: "上课时间",
      field: '',
      component: 'RangePicker',
      componentProps:({formModel})=> {
        return {
          format: 'YYYY-MM-DD',
          onChange:function (e,value){

            value[0]? formModel.startTime =  value[0] + ' 00:00:00':formModel.startTime = ''
            value[1]? formModel.endTime =  value[1] + ' 23:59:59':formModel.endTime = ''
          }
        }
      },
      colProps: { span: 6 },
    },
    {
     label: "",
     field: 'startTime',
     show:false,
     component: 'Input',
     colProps: {span: 6},
   },
   {
     label: "",
     field: 'endTime',
     show:false,
     component: 'Input',
     colProps: {span: 6},
   },
    {
      label: "",
      field: 'oneCateId',
      show: false,
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: "",
      field: 'twoCateId',
      show: false,
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      label: "",
      field: 'threeCateId',
      show: false,
      component: 'Input',
      colProps: { span: 6 },
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
}
