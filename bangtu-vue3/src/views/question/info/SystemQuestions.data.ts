import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {h} from 'vue'
import { Select,Avatar } from 'ant-design-vue';
import Icon from '/@/components/Icon';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
import { tuple } from 'ant-design-vue/lib/_util/type';
import {queryByCateId,findSysDictList,queryCateId} from './SystemQuestions.api';

// let chapterData
// findSysDictList({dictCode:'questions_chapter'}).then(res=>{
//   chapterData = res
// })
// let sectionData
// findSysDictList({dictCode:'questions_chapter_section'}).then(res=>{
//   sectionData = res
// })
// function getChapter(text){
//   for(let i=0; i<chapterData.length;i++){
//     if(chapterData[i].itemValue == text){
//       return chapterData[i].itemText
//     }
//   }
//   if(text==1){
//     return '第一章';
//   }if(text==2){
//     return '第二章';
//   }if(text==3){
//     return '第三章';
//   }if(text==4){
//     return '第四章';
//   }if(text==5){
//     return '第五章';
//   }if(text==6){
//     return '第六章';
//   }if(text==7){
//     return '第七章';
//   }if(text==8){
//     return '第八章';
//   }if(text==9){
//     return '第九章';
//   }if(text==10){
//     return '第十章';
//   }if(text==11){
//     return '第十一章';
//   }if(text==12){
//     return '第十二章';
//   }if(text==13){
//     return '第十三章';
//   }if(text==14){
//     return '第十四章';
//   }if(text==15){
//     return '第十五章';
//   }
// }
// function section(text){
//   if(text==1){
//     return '第一节';
//   }if(text==2){
//    return '第二节';
//  }if(text==3){
//    return '第三节';
//  }if(text==4){
//    return '第四节';
//  }if(text==5){
//    return '第五节';
//  }if(text==6){
//    return '第六节';
//  }if(text==7){
//    return '第七节';
//  }if(text==8){
//    return '第八节';
//  }if(text==9){
//    return '第九节';
//  }if(text==10){
//    return '第十节';
//  }if(text==11){
//    return '第十一节';
//  }if(text==12){
//    return '第十二节';
//  }if(text==13){
//    return '第十三节';
//  }if(text==14){
//    return '第十四节';
//  }if(text==15){
//    return '第十五节';
//  }
// }
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '题干',
    align:"center",
    dataIndex: 'title',
    slots:{ customRender: 'htmlSlot'},
  },
  {
    title: '题目类型',
    align:"center",
    dataIndex: 'questonType',
    customRender: ({ text }) => {
      const color = text == '1' ? 'red' : text == '2' ? 'green' : text == '3' ? 'yellow': text == '3' ? 'blue': text == '2' ? 'magenta': 'cyan';
      return render.renderTag(text==1?'单选题':text==2?'多选题':text==3?'问答题':text==3?'不定项题':text==3?'填空题':'判断题', color);
    }
  },
  {
    title: '试题类型',
    align:"center",
    dataIndex: 'questionsTag',
    customRender: ({ text }) => {
      const color = text == '1' ? 'cyan' : text == '2' ? 'blue' : 'green';
      return render.renderTag(text==1?'章节练习':text==2?'历年真题':'讲师导入', color);
    }
  },
  {
    title: '试题名称',
    align:"center",
    dataIndex: 'questionTagName'
  },
   {
    title: '行业类型',
    align:"center",
    dataIndex: 'sysCategory_dictText'
   },
   {
    title: '章名称',
    align:"center",
    dataIndex: 'chapterNameStr',
    // customRender:({text}) => {
    //   return getChapter(text)
    // }
   },
   {
    title: '节名称',
    align:"center",
    dataIndex: 'sectionNameStr',
    // customRender:({text}) => {
    //   return section(text)
    // }
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = function(userRoleType){
  return [
  {
      label: "行业分类",
      field: '',
      component: 'JMsTreeSelect',
      // required:true,
      componentProps: ({formActionType,formModel}) => {
        return {
          onChange:function(e){
            console.log(formModel,e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
            formModel.sysCategory = e.selectCateId
          }
        }
      },
      colProps: {span: 6},
   },
   {
     label: "",
     field: 'threeCateId',
     show:false,
     component: 'Input',
     colProps: {span: 6},
   },
    {
      label: "",
      field: 'oneCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'twoCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'sysCategory',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "试题类型",
      field: 'questionsTag',
      component: 'JSearchSelect',
      componentProps: {
        dict:"questions_tag",
        disabled:userRoleType == 2
      },
   },
   {
    label: '章名称',
    field: 'chapterName',
    required:true,
    component: 'ApiSelect',
    ifShow: ({ model }) => {
      return model.questionsTag == '1';
    },
    componentProps:({formModel}) =>{
      // const goodsValue = ref('')
      let cateId = formModel.sysCategory?formModel.sysCategory:0
      let pid = formModel.sysCategory?formModel.sysCategory:0
      return {
        api:queryCateId,
        params: { cateId: cateId,pid:pid },
        labelField: 'name',
        valueField: 'id',
        // defaultValue: goodsValue,
        onOptionsChange(value){

          // formModel.courseName = value[0]?.label
          // renovate()
          // console.log(value);
        }
      }
    },
    dynamicRules({model}){

      if(model?.questionsTag == '1'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
  },
  {
    label: '节名称',
    field: 'sectionName',
    component: 'ApiSelect',
    ifShow: ({ model }) => {
      return model.questionsTag == '1';
    },
    componentProps:({formModel}) =>{
      // const goodsValue = ref('')
      let cateId = formModel.sysCategory?formModel.sysCategory:0
      let pid = formModel.chapterName?formModel.chapterName:0
      return {
        api:queryCateId,
        params: { cateId: cateId,pid:pid },
        labelField: 'name',
        valueField: 'id',
        // defaultValue: goodsValue,
        onOptionsChange(value){

          // formModel.courseName = value[0]?.label
          // renovate()
          // console.log(value);
        }
      }
    },
  },
  {
    label: '试题名称',
    field: 'questionTagId',
    component: 'ApiSelect',
    ifShow: ({ model }) => {
      return model.questionsTag == '2';
    },
    componentProps:({formModel}) =>{
      // const goodsValue = ref('')
      let cateId = formModel.sysCategory?formModel.sysCategory:0
      return {
        api:queryByCateId,
        params: { cateId: cateId },
        labelField: 'name',
        valueField: 'id',
        // defaultValue: goodsValue,
        onOptionsChange(value){

          // formModel.courseName = value[0]?.label
          // renovate()
          // console.log(value);
        }
      }
    },
  },
      {
          label: "题目类型",
          field: 'questonType',
          component: 'JSearchSelect',
          componentProps: {
            dict:"questions_type"
          },
          colProps: {span: 6},
       },
       {
           label: "题干",
           field: 'title',
           component: 'Input',
           componentProps: {
           },
           colProps: {span: 6},
        },

          {
            label: "讲师名称",
            field: 'teacherId',
            component: 'JSelectTeacher',
            show:function(){
              return userRoleType!=2
            },
            colProps: {span: 6},
         },
];
}
//表单数据
export const formSchema: FormSchema[] = function(record,userRoleType,){
  return [
  {
      label: "行业分类",
      field: 'cateName',
      component: 'JMsTreeSelect',
      required:true,
      componentProps: ({formActionType,formModel}) => {
        return {
          onChange:function(e){
            console.log(formModel,e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
            formModel.sysCategory = e.selectCateId
          }
        }
      },
   },
   {
     label: "",
     field: 'threeCateId',
     show:false,
     component: 'Input',
     colProps: {span: 6},
   },
    {
      label: "",
      field: 'oneCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'twoCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'sysCategory',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
   {
       label: "试题类型",
       field: 'questionsTag',
       component: 'JSearchSelect',
       componentProps: {
         dict:"questions_tag",
         disabled:userRoleType == 2
       },
    },

    {
      label: '章名称',
      field: 'chapterName',
      required:true,
      component: 'ApiSelect',
      show: ({ model }) => {
        return model.questionsTag == '1';
      },
      componentProps:({formModel}) =>{
        // const goodsValue = ref('')
        let cateId = formModel.sysCategory?formModel.sysCategory:0
        let pid = formModel.sysCategory?formModel.sysCategory:0
        return {
          api:queryCateId,
          params: { cateId: cateId,pid:pid },
          labelField: 'name',
          valueField: 'id',
          // defaultValue: goodsValue,
          onOptionsChange(value){

            // formModel.courseName = value[0]?.label
            // renovate()
            // console.log(value);
          }
        }
      },
      dynamicRules({model}){

        if(model?.questionsTag == '1'){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
    },
    {
      label: '节名称',
      field: 'sectionName',
      component: 'ApiSelect',
      show: ({ model }) => {
        return model.questionsTag == '1';
      },
      componentProps:({formModel}) =>{
        // const goodsValue = ref('')
        let cateId = formModel.sysCategory?formModel.sysCategory:0
        let pid = formModel.chapterName?formModel.chapterName:0
        return {
          api:queryCateId,
          params: { cateId: cateId,pid:pid },
          labelField: 'name',
          valueField: 'id',
          // defaultValue: goodsValue,
          onOptionsChange(value){

            // formModel.courseName = value[0]?.label
            // renovate()
            // console.log(value);
          }
        }
      },
    },
  {
    label: '试题名称',
    field: 'questionTagId',
    component: 'ApiSelect',
    show: ({ model }) => {
      return model.questionsTag == '2';
    },
    componentProps:({formModel}) =>{
      // const goodsValue = ref('')
      let cateId = formModel.sysCategory?formModel.sysCategory:0
      return {
        api:queryByCateId,
        params: { cateId: cateId },
        labelField: 'name',
        valueField: 'id',
        // defaultValue: goodsValue,
        onOptionsChange(value){

          // formModel.courseName = value[0]?.label
          // renovate()
          // console.log(value);
        }
      }
    },
  },
  {
    label: '题目类型',
    field: 'questonType',
    component: 'JSearchSelect',
    componentProps: {
      dict:"questions_type",
      onChange(e){

        record.value.questonType = e
      }
    },
  },
  {
    label: '题干',
    field: 'title',
    component: 'JEditor',
    required:true,
    // render: render.renderTinymce,
  },
  {
    label: '选项A',
    field: 'selectA',
    component: 'JEditor',
    // required:true,
    show: ({ model }) => {
      return model.questonType == '1'||model.questonType == '2'||model.questonType == '4';
    },
    dynamicRules({model}){

      if(model.questonType == '1'||model.questonType == '2'||model.questonType == '4'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
    // render: render.renderTinymce,
  },
  {
    label: '选项B',
    field: 'selectB',
    component: 'JEditor',
    // required:true,
    show: ({ model }) => {
      return model.questonType == '1'||model.questonType == '2'||model.questonType == '4';
    },
    dynamicRules({model}){

      if(model.questonType == '1'||model.questonType == '2'||model.questonType == '4'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
    // render: render.renderTinymce,
  },
  {
    label: '选项C',
    field: 'selectC',
    component: 'JEditor',
    // required:true,
    show: ({ model }) => {
      return model.questonType == '1'||model.questonType == '2'||model.questonType == '4';
    },
    dynamicRules({model}){

      if(model.questonType == '1'||model.questonType == '2'||model.questonType == '4'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
    // render: render.renderTinymce,
  },
  {
    label: '选项D',
    field: 'selectD',
    component: 'JEditor',
    // required:true,
    show: ({ model }) => {
      return model.questonType == '1'||model.questonType == '2'||model.questonType == '4';
    },
    dynamicRules({model}){

      if(model.questonType == '1'||model.questonType == '2'||model.questonType == '4'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
    // render: render.renderTinymce,
  },
  {
    label: '选项E',
    field: 'selectE',
    component: 'JEditor',
    show: ({ model }) => {
      return model.questonType == '1'||model.questonType == '2'||model.questonType == '4';
    },
    // render: render.renderTinymce,
  },
  {
    label: '选项F',
    field: 'selectF',
    component: 'JEditor',
    show: ({ model }) => {
      return model.questonType == '1'||model.questonType == '2'||model.questonType == '4';
    },
    // render: render.renderTinymce,
  },
  {
    label: '答案',
    field: 'answer3',
    component: 'InputTextArea',
    show: ({ model }) => {
      // model.answer = null
      return model.questonType == '3';
    },
    dynamicRules({model}){

      if(model.questonType == '3'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
    itemProps: {
      extra: '多个答案请以英文"逗号"分割,比如多选、不定项答案为：A,B；填空答案为：答案1,答案2；判断题答案为：正确或错误',
    },
  },
  {
    label: '答案',
    field: 'answer1',
    component: 'Select',
    show: ({ model }) => {
      // model.answer = null
      return model.questonType == '1';
    },
    dynamicRules({model}){

      if(model.questonType == '1'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
    componentProps:{
      options:[
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
        { value: 'E', label: 'E' },
        { value: 'F', label: 'F' },
      ]
    },
    itemProps: {
      extra: '多个答案请以英文"逗号"分割,比如多选、不定项答案为：A,B；填空答案为：答案1,答案2；判断题答案为：正确或错误',
    },
  },
  {
    label: '答案',
    field: 'answer6',
    component: 'Select',
    show: ({ model }) => {
      // model.answer = null
      return model.questonType == '6';
    },
    dynamicRules({model}){

      if(model.questonType == '6'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
    componentProps:{
      options:[
        { value: '正确', label: '正确' },
        { value: '错误', label: '错误' },
      ]
    },
    itemProps: {
      extra: '多个答案请以英文"逗号"分割,比如多选、不定项答案为：A,B；填空答案为：答案1,答案2；判断题答案为：正确或错误',
    },
  },
  {
    label: '答案',
    field: 'answer24',
    component: 'Select',
    show: ({ model }) => {
      // model.answer = null
      return model.questonType != '1'&&model.questonType != '3'&&model.questonType != '5'&&model.questonType != '6';
    },
    dynamicRules({model}){

      if(model.questonType != '1'&&model.questonType != '3'&&model.questonType != '5'&&model.questonType != '6'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
    componentProps:{
      mode:"multiple",
      options:[
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
        { value: 'E', label: 'E' },
        { value: 'F', label: 'F' },
      ],
    },
    itemProps: {
      extra: '多个答案请以英文"逗号"分割,比如多选、不定项答案为：A,B；填空答案为：答案1,答案2；判断题答案为：正确或错误',
    },
  },
  {
    label: '答案解析',
    field: 'answerAnalysis',
    component: 'InputTextArea',
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
}

export const formSchema1: FormSchema[] = function(userRoleType,fileList){
  return [
    {
      label: "行业分类",
      field: 'cateName',
      component: 'JMsTreeSelect',
      required:true,
      componentProps: ({formActionType,formModel}) => {
        return {
          onChange:function(e){
            console.log(formModel,e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
            formModel.sysCategory = e.selectCateId
          }
        }
      },
   },
   {
     label: "",
     field: 'threeCateId',
     show:false,
     component: 'Input',
     colProps: {span: 6},
   },
    {
      label: "",
      field: 'oneCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'twoCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'sysCategory',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
   {
       label: "试题类型",
       field: 'questionsTag',
       component: 'JSearchSelect',
       componentProps: {
         dict:"questions_tag",
         disabled:userRoleType == 2
       },
    },

//    {
//     label: "试题类型Id",
//     field: 'questionsTagId',
//     show:false,
//     component: 'Input',
//  },
  {
    label: '章名称',
    field: 'chapterName',
    required:true,
    component: 'ApiSelect',
    show: ({ model }) => {
      return model.questionsTag == '1';
    },
    componentProps:({formModel}) =>{
      // const goodsValue = ref('')
      let cateId = formModel.sysCategory?formModel.sysCategory:0
      let pid = formModel.sysCategory?formModel.sysCategory:0
      return {
        api:queryCateId,
        params: { cateId: cateId,pid:pid },
        labelField: 'name',
        valueField: 'id',
        // defaultValue: goodsValue,
        onOptionsChange(value){

          // formModel.courseName = value[0]?.label
          // renovate()
          // console.log(value);
        }
      }
    },
    dynamicRules({model}){

      if(model?.questionsTag == '1'){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
    },
  },
  {
    label: '节名称',
    field: 'sectionName',
    component: 'ApiSelect',
    show: ({ model }) => {
      return model.questionsTag == '1';
    },
    componentProps:({formModel}) =>{
      // const goodsValue = ref('')
      let cateId = formModel.sysCategory?formModel.sysCategory:0
      let pid = formModel.chapterName?formModel.chapterName:0
      return {
        api:queryCateId,
        params: { cateId: cateId,pid:pid },
        labelField: 'name',
        valueField: 'id',
        // defaultValue: goodsValue,
        onOptionsChange(value){

          // formModel.courseName = value[0]?.label
          // renovate()
          // console.log(value);
        }
      }
    },
  },
  {
    label: '试题名称',
    field: 'questionTagId',
    component: 'ApiSelect',
    show: ({ model }) => {
      return model.questionsTag == '2';
    },
    componentProps:({formModel}) =>{
      // const goodsValue = ref('')
      let cateId = formModel.sysCategory?formModel.sysCategory:0
      return {
        api:queryByCateId,
        params: { cateId: cateId },
        labelField: 'name',
        valueField: 'id',
        // defaultValue: goodsValue,
        onChange(value){
          console.log(formModel)
          
          // formModel.questionTagId = va
          // renovate()
          // console.log(value);
        }
      }
    },
  },
  {
    label: '上传附件',
    field: 'files[]',
    component: 'JUpload',
    componentProps: {
      beforeUpload:function(file,List){
        fileList.value = List
        return false
      },
      multiple:false,
      maxCount	:1,
    },

  }
  ]
}
