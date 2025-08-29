<template>
	<view class="live">
		<!-- 头部导航 -->
		<view class="live-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>动态壁纸</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 分享列表 -->
		<view class="live-list">
			<view @click="toLiveListPreview(item, index)" class="list-item" v-for="(item, index) in liveList" :key="index">
				<view class="item-img">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
				<view class="item-info">
					<view class="title">{{ item.title }}</view>
					<view class="count">
						<view class="row">
							<uni-icons v-if="item.is_downloaded >= 1" type="cloud-download-filled" color="#2196f3" size="16"></uni-icons>
							<uni-icons v-else type="cloud-download" color="#2196f3" size="16"></uni-icons>
							<text style="margin-left: 10rpx; color: #fff">{{ item.download_count }}</text>
						</view>
						<view class="row">
							<uni-icons v-if="item.is_liked >= 1" type="heart-filled" color="#ed1c24" size="16"></uni-icons>
							<uni-icons v-else type="heart" color="#ed1c24" size="16"></uni-icons>
							<text style="margin-left: 10rpx; color: #fff">{{ item.like_count }}</text>
						</view>
						<view class="row">
							<uni-icons v-if="item.is_collected >= 1" type="star-filled" color="#ffff7f" size="16"></uni-icons>
							<uni-icons v-else type="star" color="#ffff7f" size="16"></uni-icons>
							<text style="margin-left: 10rpx; color: #fff">{{ item.collect_count }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载提示 -->
		<view class="loading" v-if="isLoading">——————&nbsp;&nbsp;加载中...&nbsp;&nbsp;——————</view>
		<!-- 到底提示 -->
		<view class="end-tip" :style="{ opacity: isEnd && liveList.length > 0 ? '1' : '0' }">——————&nbsp;&nbsp;已经到底啦~&nbsp;&nbsp;——————</view>
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
import { selecWallpaperPageByCategoryId } from '../../api/api';

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

	// 清除缓存并保持动态壁纸数据一致性
	handleLiveList();
});

// 专辑列表
const liveList = ref([]);
// 是否加载全部
const isEnd = ref(false);
// 加载状态控制
const isLoading = ref(false);
// 获取专辑列表参数
const liveListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 2,
	category_id: 'Q5wE2rT7yU',
	status: 1,
	page: 1,
	pagesize: 20
});
// 获取专辑列表方法
const getliveList = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			// 从本地存储重新读取一次，避免依赖onShow的时机
			userInfo.value = uni.getStorageSync('userInfo');
			liveListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
			const result = await selecWallpaperPageByCategoryId(liveListParams);
			// 处理数据
			const processedResult = result.map((item) => {
				// 安全解析 labels
				try {
					const labels = typeof item.labels === 'string' && item.labels ? JSON.parse(item.labels) : [];
					item.labels = labels;
					item.title = labels.join('·');
				} catch (err) {
					console.error('解析 labels 失败:', err);
					item.labels = [];
				}
				return item;
			});
			// 存入数据
			liveList.value = [...liveList.value, ...result];
			// 是否到底
			if (result.length === 0) {
				isEnd.value = true;
			}
		} catch (error) {
			console.error('获取数据失败:', error);
			// 失败时回退页码，方便重试
			liveListParams.page--;
		} finally {
			isLoading.value = false; // 解锁加载状态
		}
	}
};
// 触底加载更加专辑数据
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		liveListParams.page++;
		getliveList();
	}
});

// 页面唯一标识
const fromPage = ref('');
// 选取动态壁纸的预览范围的起始下标
const startIndex = ref(0);
// 选取动态壁纸的预览范围的终止下标
const endIndex = ref(0);
// 跳转到动态壁纸预览界面
const toLiveListPreview = (item, index) => {
	// 计算当前分组（从0开始）
	const group = Math.floor(index / 5);
	// 计算起始下标
	startIndex.value = group * 5;
	// 计算终止下标（用于边界校验，实际截取时用不到）
	endIndex.value = Math.min(startIndex.value + 4, liveList.value.length - 1);
	// 计算当前在分组内的下标（1-5）
	const currentIndex = Math.ceil(index % 5);

	// 直接截取从startIndex开始的5条数据（slice自动处理边界，不足5条时取到末尾）
	const previewData = liveList.value.slice(startIndex.value, startIndex.value + 5);

	uni.setStorageSync(fromPage.value, JSON.stringify(previewData));

	uni.navigateTo({
		url: `/pages/liveDetail/liveDetail?id=${item.id}&index=${currentIndex}&from=${encodeURIComponent(fromPage.value)}`
	});
};
// 清除缓存并保持动态壁纸数据一致性
const handleLiveList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync(fromPage.value);
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		liveList.value = [
			...liveList.value.slice(0, startIndex.value), // 前半段：从开头到 startIndex 前
			...cacheData, // 修改段：新数据
			...liveList.value.slice(endIndex.value + 1) // 后半段：从 endIndex 后到末尾
		];
		// 清理缓存
		uni.removeStorageSync(fromPage.value);
	}
};

// 挂载
onLoad((options) => {
	// 获取唯一标识
	fromPage.value = 'live-' + getRandomID();
	// 获取专辑列表数据
	getliveList();
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
.live {
	width: 100%;
	height: 100%;
	background-color: #141414;
	padding: 30rpx;
	padding-top: 192rpx;
	overflow: auto;
	/* 头部导航栏 */
	.live-navbar {
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
	/* 分享列表 */
	.live-list {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 48%;
			height: 720rpx;
			border-radius: 30rpx;
			background-color: #23232b;
			box-shadow: 0 1px 20px -6px #00000080;
			margin-bottom: 40rpx;
			.item-img {
				width: 100%;
				height: 593rpx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 30rpx 30rpx 0 0;
				}
			}
			.item-info {
				width: 100%;
				height: 127rpx;
				border-radius: 0 0 30rpx 30rpx;
				padding: 0 24rpx;
				.title {
					margin: 20rpx 0 14rpx 0;
					font-size: 13px;
					color: #fff;
					font-weight: 600;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.count {
					display: flex;
					align-items: center;
					font-size: 11px;
					.row {
						margin-right: 20rpx;
						display: flex;
						align-items: center;
					}
				}
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
