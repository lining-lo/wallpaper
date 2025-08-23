<template>
	<view class="tablet">
		<!-- 头部导航 -->
		<view class="tablet-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>平板</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 平板类型 -->
		<view class="tablet-type">
			<view class="inner">
				<up-tabs
					@click="changeType"
					:list="sort"
					lineWidth="0"
					lineColor="#141414"
					:activeStyle="{
						color: '#fff',
						padding: ' 10rpx 50rpx',
						backgroundColor: '#444452',
						borderRadius: '40rpx'
					}"
					:inactiveStyle="{
						color: '#fff',
						padding: ' 10rpx 50rpx',
						backgroundColor: '#23232b',
						borderRadius: '40rpx'
					}"
					itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
				></up-tabs>
			</view>
		</view>
		<!-- 分享列表 -->
		<view class="tablet-list">
			<view @click="toTabletDetail(item, index)" class="list-item" v-for="(item, index) in tabletList" :key="index">
				<image :src="item.url" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onShow, onReachBottom, onUnload } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';
import { selecWallpaperPageByCategoryId, selecCategoryPage, selectAllWallpaperByType } from '../../api/api';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 用户信息
const userInfo = ref({});
// token信息
const token = ref();
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');
});

// 当前类型下标
const currentIndex = ref(0);
// 切换类型
const changeType = (item, index) => {
	if (currentIndex.value === index) return; // 类型未变化则直接返回
	currentIndex.value = index;
	// 重置状态
	tabletList.value = [];
	tabletListParams.page = 1;
	isEnd.value = false;
	tabletListParams.category_id = item.id;
	gettabletList();
};

// 头像类型
const sort = ref([]);
// 分页获取分类的参数
const sortParams = reactive({
	type: 3,
	status: 1,
	page: 1,
	pagesize: 100
});
//  分页获取分类方法
const getSort = async () => {
	const result = await selecCategoryPage(sortParams);
	sort.value = result;
	const all = {
		id: '',
		name: '最新',
		cover: '',
		updatedate: '',
		wallpaper_count: 0,
		total_likes: 0
	};
	result.unshift(all);
	// console.log('sort', sort.value);
};

// 专辑列表
const tabletList = ref([]);
// 是否加载全部
const isEnd = ref(false);

// 获取专辑列表参数
const tabletListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 3,
	category_id: '',
	status: 1,
	page: 1,
	pagesize: 24
});
// 获取专辑列表方法
const gettabletList = async () => {
	if (!isEnd.value) {
		// 从本地存储重新读取一次，避免依赖onShow的时机
		userInfo.value = uni.getStorageSync('userInfo');
		tabletListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
		const result = currentIndex.value === 0 ? await selectAllWallpaperByType(tabletListParams) : await selecWallpaperPageByCategoryId(tabletListParams);
		result.map((item) => {
			// 安全解析 labels，避免格式错误导致崩溃
			try {
				item.labels = typeof item.labels === 'string' && item.labels ? JSON.parse(item.labels) : [];
			} catch (err) {
				console.error('解析 labels 失败:', err);
				item.labels = []; // 解析失败时用空数组兜底
			}
			return item;
		});
		// 存入数据
		tabletList.value = [...tabletList.value, ...result];
		uni.setStorageSync('tablet-wallpapers', JSON.stringify(tabletList.value));
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};
// 挂载
onLoad((options) => {
	// 获取头像分类
	getSort();
	// 获取专辑列表数据
	gettabletList();
});
// 销毁页面时
onUnload(() => {
	uni.removeStorageSync('tablet-wallpapers');
});

// 触底加载更加专辑数据
onReachBottom(() => {
	tabletListParams.page++;
	gettabletList();
});

// 跳转到壁纸预览界面
const toTabletDetail = (item, index) => {
	const from = 'tablet-wallpapers';
	uni.navigateTo({
		url: `/pages/tabletDetail/tabletDetail?id=${item.id}&index=${index}&from=${encodeURIComponent(from)}`
	});
};
</script>

<style lang="scss">
.tablet {
	width: 100%;
	height: 100%;
	background-color: #141414;
	padding: 20rpx;
	padding-top: 320rpx;
	overflow: auto;
	/* 头部导航栏 */
	.tablet-navbar {
		width: 100%;
		height: 180rpx;
		background-color: #141414;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	/* 平板类型 */
	.tablet-type {
		position: fixed;
		top: 80px;
		z-index: 2;
		left: 0;
		width: 100%;
		height: 130rpx;
		background-color: #141414;
		.inner {
			width: 100%;
			height: 100%;
			padding-top: 48rpx;
		}
	}
	/* 分享列表 */
	.tablet-list {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 48%;
			height: 120px;
			box-shadow: 0 1px 20px -6px #00000080;
			margin-bottom: 40rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 30rpx;
			}
		}
	}
}
</style>
