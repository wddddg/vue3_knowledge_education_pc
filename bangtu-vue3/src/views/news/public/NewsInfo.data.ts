import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Switch, InputNumber, Avatar } from 'ant-design-vue';
import { h } from 'vue';
import Icon from '/@/components/Icon';
import { batchOnline, editStatus } from './NewsInfo.api';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
import { render } from '/@/utils/common/renderUtils';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '封面',
    align: 'center',
    dataIndex: 'coverImg',
    customRender: ({ record }) => {
      if (record.newsCoverImgVOList.length == 0) {
        //update-begin-author:taoyan date:2022-5-24 for:  VUEN-1084 【vue3】online表单测试发现的新问题 41、生成的代码，树默认图大小未改
        return h(
          Avatar,
          { shape: 'square', size: 64 },
          {
            icon: () => h(Icon, { icon: 'ant-design:file-image-outlined', size: 64 }),
          }
        );
      }
      return h(Avatar, {
        src: record.newsCoverImgVOList.length > 0 ? record.newsCoverImgVOList[0].coverImg.split(',')[0] : '',
        shape: 'square',
        size: 64,
        style: { marginRight: '5px' },
      });
    },
  },
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
        disabled: record.applyStatus == 2 || record.applyStatus == 3,
        checked: record.isRecommend === 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          data.isRecommend = newStatus;
          editStatus({ id: data.id, isRecommend: newStatus }, true)
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
        disabled: record.applyStatus == 2 || record.applyStatus == 3,
        checked: record.status === 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          // const { createMessage } = useMessage();
          const data = cloneDeep(record);
          batchOnline({ ids: data.id, status: newStatus }, '')
            .then(() => {
              record.status = newStatus;
            })
            .catch(() => {
              record.status = newStatus;
              // createMessage.error('修改上线状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
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
export const formSchema: FormSchema[] = function (userRoleType, threeCateId, twoCateId, oneCateId) {
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
      component: 'Input',
      rules: [
        {
          required: true,
          message: '请输入作者昵称',
        },
      ],
      // component: 'JSelectTeacher',
      // componentProps: {
      //   showButton: false,
      //   isRadioSelection: true,
      // },
      // required: true,
    },
    {
      label: '作者头像',
      field: 'authorImg',
      component: 'JMsUpload',
      componentProps: {
        fileMax: 1,
      },
      rules: [
        {
          required: false,
          message: '请上传作者头像',
        },
      ],
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
    },
    {
      label: '内容',
      field: 'content',
      component: 'JEditor',
      componentProps: {
        fileMax: 1,
      },
      rules: [
        {
          required: true,
          message: '请输入内容',
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
