import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
// import { rules } from '/@/utils/helper/validator';
// import { render } from '/@/utils/common/renderUtils';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import { Switch, InputNumber, Avatar } from 'ant-design-vue';
import { h } from 'vue';
import Icon from '/@/components/Icon';
import { batchOnline, editStatus } from './NewsInfo.api';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
import { loadTreeRoot } from './NewsInfo.api';
import { render } from '/@/utils/common/renderUtils';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '封面',
    align: 'center',
    dataIndex: 'coverImg',
    customRender: ({ record }) => {
      if (record.newsCoverImgVOList.length > 0) {
        //update-begin-author:taoyan date:2022-5-24 for:  VUEN-1084 【vue3】online表单测试发现的新问题 41、生成的代码，树默认图大小未改
        if (record.newsType == '2') {
          return h(
            Avatar,
            { shape: 'square', size: 64 },
            {
              icon: () => h(Icon, { icon: 'ant-design:file-image-outlined', size: 64 }),
            }
          );
        } else {
          return h(Avatar, {
            src: record.newsCoverImgVOList.length > 0 ? record.newsCoverImgVOList[0].coverImg.split(',')[0] : '',
            shape: 'square',
            size: 64,
            style: { marginRight: '5px' },
          });
        }
      } else {
        return h(
          Avatar,
          { shape: 'square', size: 64 },
          {
            icon: () => h(Icon, { icon: 'ant-design:file-image-outlined', size: 64 }),
          }
        );
      }
    },
  },
  //  1、答疑文章 2、广场文章 3、资讯文章
  // {
  //   title: '分类',
  //   align: 'center',
  //   dataIndex: 'oneCateName',
  //   customRender: ({ text }) => {
  //     return render.renderTag(text, 'cyan');
  //   },
  // },
  {
    title: '标题',
    align: 'center',
    dataIndex: 'title',
  },
  {
    title: '作者',
    align: 'center',
    dataIndex: 'authorName',
  },
  {
    title: '点赞',
    align: 'center',
    dataIndex: 'likeCount',
  },
  {
    title: '收藏量',
    align: 'center',
    dataIndex: 'collectionCount',
  },
  {
    title: '置顶排序',
    align: 'center',
    dataIndex: 'sort',
    customRender: ({ record }) => {
      return h(InputNumber, {
        defaultValue: record.sort || 0,
        loading: record.pendingStatus,
        disabled: record.applyStatus == 2 || record.applyStatus == 3,
        onChange(value) {
          record.pendingStatus = true;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          editStatus({ id: data.id, sort: value }, true)
            .then(() => {})
            .catch(() => {
              createMessage.error('修改排序失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '审批状态', //1、已通过2、待审批3、已拒绝
    align: 'center',
    dataIndex: 'applyStatus',
    customRender: ({ text }) => {
      const color = text == '1' ? 'green' : text == '2' ? 'blue' : 'red';
      return render.renderTag(text == 1 ? '已通过' : text == 2 ? '待审批' : '已拒绝', color);
    },
  },
  {
    title: '是否置顶', // 1、推荐 0、未推荐
    align: 'center',
    dataIndex: 'isRecommend',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isRecommend')) {
        record.isRecommend = false;
      }
      return h(Switch, {
        checked: record.isRecommend == 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
        loading: record.pendingStatus,
        disabled: record.applyStatus == 2 || record.applyStatus == 3,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          data.isRecommend = newStatus;
          editStatus({ id: data.id, isRecommend: newStatus })
            .then(() => {
              record.isRecommend = newStatus;
            })
            .catch(() => {
              createMessage.error('修改排序失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '上线状态', // 1、推荐 0、未推荐
    align: 'center',
    dataIndex: 'status',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false;
      }
      return h(Switch, {
        checked: record.status == 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
        loading: record.pendingStatus,
        disabled: record.applyStatus == 2 || record.applyStatus == 3,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          // const { createMessage } = useMessage();
          const data = cloneDeep(record);
          data.status = newStatus;
          batchOnline({ id: data.id, status: newStatus }, '')
            .then(() => {
              record.status = newStatus;
            })
            .catch(() => {
              record.status = newStatus;
              // createMessage.error('修改排序失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  // {
  //   title: '上线状态', // 1、推荐 0、未推荐
  //   align: 'center',
  //   dataIndex: 'status',
  //   customRender: ({ record }) => {
  //     if (!Reflect.has(record, 'status')) {
  //       record.status = false;
  //     }
  //     return h(Switch, {
  //       checked: record.status == 1,
  //       checkedChildren: '是',
  //       unCheckedChildren: '否',
  //       loading: record.pendingStatus,
  //       disabled: record.applyStatus == 2 || record.applyStatus == 3,
  //       onChange(checked: boolean) {
  //         record.pendingStatus = true;
  //         const newStatus = checked ? 1 : 0;
  //         // const { createMessage } = useMessage();
  //         const data = cloneDeep(record);
  //         data.status = newStatus;
  //         batchOnline({ ids: data.id, status: newStatus }, true)
  //           .then(() => {
  //             record.status = newStatus;
  //           })
  //           .catch(() => {
  //             // createMessage.error('修改上线状态失败');
  //           })
  //           .finally(() => {
  //             record.pendingStatus = false;
  //           });
  //       },
  //     });
  //   },
  // },
  {
    title: '发布时间',
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: '上线时间',
    align: 'center',
    dataIndex: 'updateTime',
  },
  // {
  //   title: '发布类型', //1、图文 2、视频
  //   align: 'center',
  //   dataIndex: 'newsType',
  // },
  // {
  //   title: '是否推荐', // 1、推荐 0、未推荐
  //   align: 'center',
  //   dataIndex: 'isRecommend',
  // },
  // {
  //   title: '启用停用', // 1、启用 0、停用
  //   align: 'center',
  //   dataIndex: 'status',
  // },
];

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '关键词',
    field: 'searchParam',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '请输入作者或标题',
    },
  },
  {
    label: '发布时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 6 },
  },
  {
    label: '分类',
    field: 'cate',
    component: 'JMsTreeSelect',
    colProps: { span: 6 },
  },
];

//表单数据
export const formSchema: FormSchema[] = function (userInfo, threeCateId, twoCateId, oneCateId, fileData) {
  return [
    // {
    //   label: '文章分类',
    //   field: 'category',
    //   component: 'InputNumber',
    // },
    {
      label: '标题',
      field: 'title',
      component: 'Input',
      rules: [
        {
          required: true,
          message: '请输入标题',
        },
      ],
    },
    {
      label: '摘要',
      field: 'summary',
      component: 'Input',
      rules: [
        {
          required: true,
          message: '请输入摘要',
        },
      ],
    },
    {
      label: '作者',
      field: 'authorName',
      // component: 'Input',
      // rules: [
      //   {
      //     required: true,
      //     message: '请输入作者昵称',
      //   },
      // ],
      component: 'JSelectTeacher',
      componentProps: {
        showButton: false,
        isRadioSelection: true,
        disabled: userInfo.userRoleType === 2,
      },
      required: true,
    },
    // {
    //   label: '作者头像',
    //   field: 'authorImg',
    //   component: 'JMsUpload',
    //   componentProps: {
    //     fileMax: 1,
    //   },
    //   rules: [
    //     {
    //       required: false,
    //       message: '请上传作者头像',
    //     },
    //   ],
    // },
    {
      label: '发布类型',
      field: 'newsType',
      component: 'RadioGroup',
      componentProps: () => {
        return {
          options: [
            { label: '图文', value: 1, key: '1' },
            { label: '视频', value: 2, key: '2' },
          ],
        };
      },
      dynamicRules: () => {
        return [{ required: true, message: '请选择发布类型!' }];
      },
    },
    {
      label: '所属栏目',
      field: 'selectColumn',
      component: 'JMsTreeSelect',
      componentProps: function () {
        return {
          onChange: function (e) {
            threeCateId.value = e.threeCateId;
            twoCateId.value = e.twoCateId;
            oneCateId.value = e.oneCateId;
          },
        };
      },
      required: true,
    },
    {
      label: '点赞数量',
      field: 'likeCount',
      component: 'InputNumber',
    },
    {
      label: '收藏数量',
      field: 'collectionCount',
      component: 'InputNumber',
    },
    {
      label: '封面图片',
      field: 'coverImg',
      component: 'JMsUpload',
      required: true,
      render: ({ model, field }) => {
        return h(JMsUpload, {
          value: model[field],
          onChange(value) {
            model[field] = value;
          },
          fileMax: 3,
        });
      },
      ifShow: ({ values }) => values.newsType == '1',
    },
    {
      label: '封面图片',
      field: 'coverImg',
      component: 'JMsUpload',
      required: true,
      render: ({ model, field }) => {
        return h(JMsUpload, {
          value: model[field],
          onChange(value) {
            model[field] = value;
          },
          fileMax: 1,
        });
      },
      // componentProps: {
      //   fileMax: 3,
      // },
      // rules: [
      //   {
      //     required: false,
      //     message: '请上传封面图片',
      //   },
      // ],
      ifShow: ({ values }) => values.newsType == '2',
    },
    {
      label: '使用素材库',
      field: 'content',
      component: 'JMsUpload',
      componentProps: ({ formModel }) => {
        return {
          fileType: formModel.newsType == 2 ? 'mp4' : '',
          // onUpdatefileData: function (e) {
          //   fileData.value = e;
          // },
        };
      },
      required: false,
      show: ({ values }) => values.newsType == '2',
    },
    {
      label: '内容',
      field: 'content',
      component: 'JEditor',
      rules: [
        {
          required: true,
          message: '请输入内容',
        },
      ],
      ifShow: ({ values }) => values.newsType == '1',
    },
    // TODO 主键隐藏字段，目前写死为ID
    {
      label: '',
      field: 'id',
      component: 'Input',
      show: false,
    },
  ];
};

// 评论数据
export const commentColumns: BasicColumn[] = [
  {
    title: '标题',
    align: 'left',
    dataIndex: 'content',
  },
  {
    title: '评论人',
    align: 'center',
    dataIndex: 'createBy',
  },
  {
    title: '点赞',
    align: 'center',
    dataIndex: 'likeCount',
  },
  {
    title: '发布时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];

//评论表单数据
export const commentFormSchema: FormSchema[] = [
  {
    label: '评论内容',
    field: 'content',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入评论内容',
      },
    ],
  },
  {
    label: '评论时间',
    field: 'createTime',
    component: 'DatePicker',
    rules: [
      {
        required: true,
        message: '请输入评论内容',
      },
    ],
  },
  {
    label: '点赞数量',
    field: 'likeCount',
    component: 'InputNumber',
  },
  {
    label: '评论人昵称',
    field: 'authorName',
    component: 'Input',
    rules: [
      {
        required: false,
        message: '请输入评论人昵称',
      },
    ],
  },
  {
    label: '评论人头像',
    field: 'authorImg',
    component: 'JMsUpload',
    componentProps: {
      fileMax: 1,
    },
    rules: [
      {
        required: false,
        message: '请上传评论人头像',
      },
    ],
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'newsId',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'parentId',
    component: 'Input',
    show: false,
  },
];
