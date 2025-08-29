<template>
	<view class="rank">
		<!-- 头部导航 -->
		<view class="rank-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>排行榜</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 榜单类型 -->
		<view class="rank-type">
			<view @click="changeRank(2)" class="title" :class="{ selected: rankListParams.type === 2 }">热门榜</view>
			<view @click="changeRank(0)" class="title" :class="{ selected: rankListParams.type === 0 }">点赞榜</view>
			<view @click="changeRank(1)" class="title" :class="{ selected: rankListParams.type === 1 }">收藏榜</view>
		</view>
		<!-- 榜单列表 -->
		<view class="rank-list">
			<view @click="toRankListPreview(item, index)" class="list-item" v-for="(item, index) in rankList" :key="index">
				<image :src="item.url" lazy-load mode="aspectFill"></image>
			</view>
		</view>
		<!-- 加载提示 -->
		<view class="loading" v-if="isLoading">——————&nbsp;&nbsp;加载中...&nbsp;&nbsp;——————</view>
		<!-- 到底提示 -->
		<view class="end-tip" :style="{ opacity: isEnd && rankList.length > 0 ? '1' : '0' }">——————&nbsp;&nbsp;已经到底啦~&nbsp;&nbsp;——————</view>
		<!-- 前往顶部 -->
		<view class="tools-top" :class="{ 'is-visible': isShow }" @click="toTop">
			<image src="/static/images/top.png" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script setup>
import { getRandomID } from '../../utils/customize';
import { onLoad, onShow, onReachBottom, onUnload, onPageScroll } from '@dcloudio/uni-app';
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

	// 清除缓存并保持排行榜数据一致性
	handleRankList();
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

// 排序列表
const rankList = ref([]);
// 是否加载全部
const isEnd = ref(false);
// 加载状态控制
const isLoading = ref(false);
// 获取排序列表参数
const rankListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 2,
	page: 1,
	pagesize: 24
});
// 获取排序列表方法
const getRankList = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			// 从本地存储重新读取一次，避免依赖onShow的时机
			userInfo.value = uni.getStorageSync('userInfo');
			rankListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
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
			// 是否到底
			if (result.length === 0) {
				isEnd.value = true;
			}
		} catch (error) {
			console.error('获取数据失败:', error);
			// 失败时回退页码，方便重试
			shareListParams.page--;
		} finally {
			isLoading.value = false; // 解锁加载状态
		}
	}
};
// 触底加载更加排序数据
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		rankListParams.page++;
		getRankList();
	}
});
// 页面唯一标识
const fromPage = ref('');
// 选取排行榜数据的预览范围的起始下标
const startIndex = ref(0);
// 选取排行榜数据的预览范围的终止下标
const endIndex = ref(0);
// 跳转到排行榜数据预览界面
const toRankListPreview = (item, index) => {
	// 计算当前分组（从0开始）
	const group = Math.floor(index / 24);
	// 计算起始下标
	startIndex.value = group * 24;
	// 计算终止下标（用于边界校验，实际截取时用不到）
	endIndex.value = Math.min(startIndex.value + 23, rankList.value.length - 1);
	// 计算当前在分组内的下标（1-24）
	const currentIndex = Math.ceil(index % 24);

	// 直接截取从startIndex开始的24条数据（slice自动处理边界，不足24条时取到末尾）
	const previewData = rankList.value.slice(startIndex.value, startIndex.value + 24);

	uni.setStorageSync(fromPage.value, JSON.stringify(previewData));
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${currentIndex}&from=${encodeURIComponent(fromPage.value)}`
	});
};
// 清除缓存并保持排行榜数据一致性
const handleRankList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync(fromPage.value);
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		rankList.value = [
			...rankList.value.slice(0, startIndex.value), // 前半段：从开头到 startIndex 前
			...cacheData, // 修改段：新数据
			...rankList.value.slice(endIndex.value + 1) // 后半段：从 endIndex 后到末尾
		];
		// 清理缓存
		uni.removeStorageSync(fromPage.value);
	}
};

// 挂载
onLoad((options) => {
	// 获取唯一标识
	fromPage.value = 'rank-' + getRandomID();

	// 获取封面信息
	rankListParams.type = Number.parseInt(options.type);
	// 获取排序列表数据
	getRankList();
});

// 存储当前滚动高度（px 单位）
const currentScrollTop = ref(0);
// 显示与隐藏图标
const isShow = ref(false);
// 实时监听页面滚动，获取滚动高度
onPageScroll((e) => {
	// e.scrollTop 即为当前页面滚动高度（px 单位）
	currentScrollTop.value = e.scrollTop;
	if (e.scrollTop >= 20) {
		isShow.value = true;
	} else {
		isShow.value = false;
	}
});
// 回到顶部核心方法
const toTop = () => {
	uni.pageScrollTo({
		scrollTop: 0, // 滚动到顶部的距离（必须为 0，代表最顶部）
		duration: 300 // 滚动动画时长（单位 ms，可选，0 表示无动画）
	});
};
</script>

<style lang="scss">
.rank {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 280rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.rank-navbar {
		width: 100%;
		height: 180rpx;
		background-color: #141414;
		position: fixed;
		z-index: 4;
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
		top: 80px;
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
	.rank-list {
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
	/* 到底提示样式 */
	.loading,
	.end-tip {
		color: #888;
		text-align: center;
		padding: 30rpx 0;
		padding-bottom: 52rpx;
		font-size: 14px;
		width: 100%;
	}
	/* 前往顶部 */
	.tools-top {
		/* 基础定位 */
		position: fixed;
		bottom: 260rpx;
		right: 30rpx; // 最终停靠位置
		z-index: 999;
		width: 82rpx;
		height: 82rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.5);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;

		/* 隐藏状态（右侧外部） */
		transform: translateX(150rpx); // 向右偏移150rpx（超出屏幕）
		opacity: 0;
		visibility: hidden; // 不响应点击

		/* 动画过渡 */
		transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease, visibility 1s ease;

		/* 图标样式 */
		image {
			width: 60%;
			height: 60%;
		}

		/* 显示状态（从右侧滑入） */
		&.is-visible {
			transform: translateX(0); // 回到正常位置
			opacity: 1;
			visibility: visible;
		}

		/* 点击反馈 */
		&:active {
			transform: translateX(0) scale(0.95);
		}
	}
}
</style>
