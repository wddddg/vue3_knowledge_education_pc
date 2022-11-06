<!--角色选择框-->
<template>
<div>

	<BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="1100px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
		<a-tabs @change="handleChangeTab" v-model.activeKey="activeKey">
			<a-tab-pane tab="平台页面" key="page-tab" v-if="displayTabMap['page-tab']" >
				<PlatformPagesTab ref="pageTab"  @getSelectResult="confirmSelectResult"></PlatformPagesTab>
			</a-tab-pane>
			<a-tab-pane tab="自定义链接" key="link-tab" v-if="displayTabMap['link-tab']">
				<UserDefineLinkTab ref="linkTab"  @getSelectResult="confirmSelectResult"></UserDefineLinkTab>
			</a-tab-pane>
			<a-tab-pane tab="课程" key="course-tab" v-if="displayTabMap['course-tab']" >
				<CourseListTab ref="courseTab"  @getSelectResult="confirmSelectResult"></CourseListTab>
			</a-tab-pane>
			<a-tab-pane tab="班级" key="class-tab" v-if="displayTabMap['class-tab']">
				<ClassListTab ref="classTab"  @getSelectResult="confirmSelectResult"></ClassListTab>
			</a-tab-pane>
			<a-tab-pane tab="考点" key="exam-tab" v-if="displayTabMap['exam-tab']">
				<ExamListTab ref="examTab"  @getSelectResult="confirmSelectResult"></ExamListTab>
			</a-tab-pane>
			<a-tab-pane tab="电子书" key="book-tab" v-if="displayTabMap['book-tab']">
				<BookListTab ref="bookTab"  @getSelectResult="confirmSelectResult"></BookListTab>
			</a-tab-pane>
			<a-tab-pane tab="商城" key="goods-tab" v-if="displayTabMap['goods-tab']">
				<GoodsListTab ref="goodsTab" @getSelectResult="confirmSelectResult"></GoodsListTab>
			</a-tab-pane>
			<a-tab-pane tab="文章" key="article-tab" v-if="displayTabMap['article-tab']">
				<ArticleListTab ref="articleTab"  @getSelectResult="confirmSelectResult"></ArticleListTab>
			</a-tab-pane>
		</a-tabs>

	</BasicModal>
</div>
</template>
<script lang="ts">
import {
	defineComponent,
	ref,
	unref
} from 'vue';
import {
	BasicModal,
	useModalInner
} from '/@/components/Modal';
import {
	createAsyncComponent
} from '/@/utils/factory/createAsyncComponent';
import {
	useSelectBiz
} from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
import {
	selectProps
} from '/@/components/Form/src/jeecg/props/props';
import {
	useAttrs
} from '/@/hooks/core/useAttrs';
import PlatformPagesTab from '../relbiz/PlatformPagesTab.vue';
import UserDefineLinkTab from '../relbiz/UserDefineLinkTab.vue';
import CourseListTab from '../relbiz/CourseListTab.vue';
import ClassListTab from '../relbiz/ClassListTab.vue';
import ExamListTab from '../relbiz/ExamListTab.vue';
import BookListTab from '../relbiz/BookListTab.vue';
import GoodsListTab from '../relbiz/GoodsListTab.vue';
import ArticleListTab from '../relbiz/ArticleListTab.vue';
import {  getGlobalList } from '/@/api/common/api';

export default defineComponent({
	name: 'RelBizSelectModal',
	components: {
		PlatformPagesTab,
		UserDefineLinkTab,
		CourseListTab,
		ClassListTab,
		ExamListTab,
		BookListTab,
		GoodsListTab,
		ArticleListTab,
		//此处需要异步加载BasicTable
		BasicModal,
		BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
			loading: true,
		}),
	},
	props: {
		...selectProps,
		//选择框标题
		modalTitle: {
			type: String,
			default: '全局选择',
		},
		availableTabs: {
			type: Array,
			default: [],
		},
	},
	emits: ['register', 'getSelectResult'],
	setup(props, {
		emit,
		refs
	}) {
		//注册弹框
		const [register, {
			closeModal
		}] = useModalInner();
		const attrs = useAttrs();
		const pageTab = ref();
		const linkTab = ref();
		const courseTab = ref();
		const classTab = ref();
		const examTab = ref();
		const bookTab = ref();
		const goodsTab = ref();
		const articleTab = ref();
		let activeKey = ref('');
		let displayTabMap  = ref({});
		if(props.availableTabs&&props.availableTabs.length>0){
			activeKey.value = props.availableTabs[0];
			let availableMap = {};
			props.availableTabs.forEach(element => {
				availableMap[element]= true;
			});
			displayTabMap.value = availableMap;
		}


		      const searchInfo = ref({'businessType': 3});
		      const getBindValue = Object.assign({}, unref(props), unref(attrs));
		      getBindValue.labelKey = "businessName";
		      getBindValue.isRadioSelection = true;
		      getBindValue.searchInfo = searchInfo.value;

		      let [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(getGlobalList, getBindValue);



		/**
		 * 确定选择
		 */
		function handleOk() {

			switch (activeKey.value) {
				case 'page-tab':
					pageTab.value.handleOk();
					break;
				case 'link-tab':
					linkTab.value.handleOk();
					break;
				case 'course-tab':
					courseTab.value.handleOk();
					break;
				case 'class-tab':
					classTab.value.handleOk();
					break;
				case 'exam-tab':
					examTab.value.handleOk();
					break;
				case 'book-tab':
					bookTab.value.handleOk();
					break;
                case 'goods-tab':
                    goodsTab.value.handleOk();
                    break;
                case 'article-tab':
                    articleTab.value.handleOk();
                    break;
				default:
					break;
			}

		}

		function confirmSelectResult(options, values, selectedClassifyRows) {
			emit('getSelectResult', options, values, selectedClassifyRows);
			closeModal();
		}

		function handleChangeTab(e) {
			console.log(e);
			activeKey.value = e;
		}


		return {
			displayTabMap,
			pageTab,
			linkTab,
			courseTab,
			classTab,
			examTab,
			bookTab,
			goodsTab,
			articleTab,
			confirmSelectResult,
			goodsTab,
			handleOk,
			register,
			handleChangeTab
		};
	},
});
</script>
