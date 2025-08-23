<template>
	<view class="rank">
		<!-- 头部导航 -->
		<view class="sortlist-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>排行榜</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 榜单类型 -->
		<view class="rank-type">
			<view @click="changeRank(2)" class="title" :class="{selected:rankListParams.type === 2}">热门榜</view>
			<view @click="changeRank(0)" class="title" :class="{selected:rankListParams.type === 0}">点赞榜</view>
			<view @click="changeRank(1)" class="title" :class="{selected:rankListParams.type === 1}">收藏榜</view>
		</view>
		<!-- 榜单列表 -->
		<view class="recommend-list">
			<view @click="toPreview(item, index)" class="list-item" v-for="(item, index) in rankList" :key="index">
				<image :src="item.url" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onShow, onReachBottom,onUnload } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';
import { selectWallpaperBySort } from '../../api/api';

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

// 排序列表
const rankList = ref([]);
// 是否加载全部
const isEnd = ref(false);

// 获取排序列表参数
const rankListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 2,
	page: 1,
	pagesize: 24
});
// 获取排序列表方法
const getRankList = async () => {
	if (!isEnd.value) {
		// 从本地存储重新读取一次，避免依赖onShow的时机
		userInfo.value = uni.getStorageSync('userInfo');
		rankListParams.user_id = userInfo.value.id || ''; // 优先用最新存储值
		const result = await selectWallpaperBySort(rankListParams);
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
		rankList.value = [...rankList.value, ...result];
		uni.setStorageSync('rank-wallpapers', JSON.stringify(rankList.value));
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};
// 挂载
onLoad((options) => {
	// 获取封面信息
	rankListParams.type = Number.parseInt(options.type);
	// 获取排序列表数据
	getRankList();
});
// 销毁页面时
onUnload(() => {
	uni.removeStorageSync('rank-wallpapers');
});

// 切换榜单
const changeRank = (type) => {
  if (rankListParams.type !== type) {
    // 1. 重置列表数据（清空旧榜单数据）
    rankList.value = [];
    // 2. 重置分页参数（从第1页开始加载新榜单）
    rankListParams.page = 1;
    // 3. 重置到底状态（允许加载新数据）
    isEnd.value = false;
    // 4. 更新排序类型
    rankListParams.type = type;
    // 5. 重新请求新榜单数据
    getRankList();
  }
};

// 触底加载更加排序数据
onReachBottom(() => {
	rankListParams.page++;
	getRankList();
});

// 跳转到壁纸预览界面
const toPreview = (item, index) => {
	const from = 'rank-wallpapers';
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${index}&from=${encodeURIComponent(from)}`
	});
};
</script>

<style lang="scss">
.rank {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 320rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.sortlist-navbar {
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
	/* 榜单类型 */
	.rank-type {
		position: fixed;
		top: 92px;
		z-index: 2;
		left: 0;
		width: 100%;
		height: 130rpx;
		background-color: #141414;
		padding: 0 50rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title {
			padding: 10rpx 50rpx;
			background-color: #23232b;
			border-radius: 40rpx;
			&.selected {
				background-color: #444452;
			}
		}
	}
	/* 榜单列表 */
	.recommend-list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.list-item {
			width: calc(34% - 20rpx);
			height: 450rpx;
			margin-right: 20rpx;
			margin-bottom: 30rpx;
			border-radius: 20rpx;
			position: relative;
			&:nth-child(3n) {
				margin-right: 0;
			}
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}
}
</style>
