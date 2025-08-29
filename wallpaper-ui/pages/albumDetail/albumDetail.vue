<template>
	<view class="albumdetail">
		<!-- 头部导航 -->
		<view class="albumdetail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>壁纸专辑</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 专辑封面 -->
		<view class="albumdetail-cover">
			<image v-if="coverInfo" :src="coverInfo.cover" mode="aspectFill"></image>
			<view class="item-info">
				<view class="info-like">
					<text class="fill"></text>
					<text v-if="coverInfo">{{ coverInfo.wallpaper_count }}</text>
				</view>
				<view class="info-title">
					<text v-if="coverInfo" class="name">{{ coverInfo.name }}</text>
					<text class="count" v-if="coverInfo">{{ coverInfo.total_likes }}人喜欢</text>
				</view>
			</view>
		</view>
		<!-- 专辑内容列表 -->
		<view class="albumdetail-content">
			<view @click="toAlbumListPreview(item, index)" class="content-item" v-for="(item, index) in albumList" :key="index">
				<image :src="item.url" lazy-load mode="aspectFill"></image>
			</view>
		</view>
		<!-- 加载提示 -->
		<view class="loading" v-if="isLoading">——————&nbsp;&nbsp;加载中...&nbsp;&nbsp;——————</view>
		<!-- 到底提示 -->
		<view class="end-tip" :style="{ opacity: isEnd && albumList.length > 0 ? '1' : '0' }">——————&nbsp;&nbsp;已经到底啦~&nbsp;&nbsp;——————</view>
	</view>
</template>

<script setup>
import { getRandomID } from '../../utils/customize';
import { onLoad, onShow, onReachBottom, onUnload } from '@dcloudio/uni-app';
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

	// 清除缓存并保持专辑列表数据一致性
	handleAlbumList();
});

// 封面信息
const coverInfo = ref();

// 专辑列表
const albumList = ref([]);
// 是否加载全部
const isEnd = ref(false);
// 加载状态控制
const isLoading = ref(false);
// 获取专辑列表参数
const albumListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 1,
	category_id: '',
	status: 1,
	page: 1,
	pagesize: 9
});
// 获取专辑列表方法
const getAlbumList = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			// 发送请求
			albumListParams.category_id = coverInfo.value.id;
			// 从本地存储重新读取一次，避免依赖onShow的时机
			userInfo.value = uni.getStorageSync('userInfo');
			albumListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
			const result = await selecWallpaperPageByCategoryId(albumListParams);
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
			albumList.value = [...albumList.value, ...result];
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
// 触底加载更加专辑数据
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		albumListParams.page++;
		getAlbumList();
	}
});

// 页面唯一标识
const fromPage = ref('');
// 选取专辑列表的预览范围的起始下标
const startIndex = ref(0);
// 选取专辑列表的预览范围的终止下标
const endIndex = ref(0);
// 跳转到专辑列表预览界面
const toAlbumListPreview = (item, index) => {
	// 计算当前分组（从0开始）
	const group = Math.floor(index / 24);
	// 计算起始下标
	startIndex.value = group * 24;
	// 计算终止下标（用于边界校验，实际截取时用不到）
	endIndex.value = Math.min(startIndex.value + 23, albumList.value.length - 1);
	// 计算当前在分组内的下标（1-24）
	const currentIndex = Math.ceil(index % 24);

	// 直接截取从startIndex开始的24条数据（slice自动处理边界，不足24条时取到末尾）
	const previewData = albumList.value.slice(startIndex.value, startIndex.value + 24);

	uni.setStorageSync(fromPage.value, JSON.stringify(previewData));
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${currentIndex}&from=${encodeURIComponent(fromPage.value)}`
	});
};
// 清除缓存并保持专辑列表数据一致性
const handleAlbumList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync(fromPage.value);
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		albumList.value = [
			...albumList.value.slice(0, startIndex.value), // 前半段：从开头到 startIndex 前
			...cacheData, // 修改段：新数据
			...albumList.value.slice(endIndex.value + 1) // 后半段：从 endIndex 后到末尾
		];
		// 清理缓存
		uni.removeStorageSync(fromPage.value);
	}
};

// 挂载
onLoad((options) => {
	// 获取唯一标识
	fromPage.value = 'albumdetail-' + getRandomID();

	// 获取封面信息
	const category_item = JSON.parse(decodeURIComponent(options.item));
	coverInfo.value = category_item;
	// 获取专辑列表数据
	getAlbumList();
});
</script>

<style lang="scss">
.albumdetail {
	width: 100%;
	min-height: 100vh;
	padding-top: 180rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 头部导航栏 */
	.albumdetail-navbar {
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
	/* 专辑封面 */
	.albumdetail-cover {
		width: 100%;
		height: 360rpx;
		margin-bottom: 10rpx;
		position: relative;
		image {
			width: 100%;
			height: 100%;
		}
		.item-info {
			width: 100%;
			height: 100%;
			padding: 50rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: absolute;
			top: 0;
			.info-title {
				display: flex;
				justify-content: space-between;
				.name {
					font-weight: 700;
					background-color: rgb(40, 40, 40, 0.8);
					font-size: 20px;
					font-family: cursive;
				}
				.count {
					display: flex;
					align-items: center;
					font-size: 12px;
					padding: 0 8px;
					background-color: rgba(40, 40, 40, 0.8);
					border-radius: 10px;
				}
			}
			.info-like {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				text {
					font-size: 12px;
					padding: 4px 16px;
					background-color: rgba(40, 40, 40, 0.8);
					border-radius: 20px;
				}
			}
		}
	}
	/* 分类内容列表 */
	.albumdetail-content {
		padding: 30rpx;
		padding-bottom: 0;
		position: relative;
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.content-item {
			width: 214rpx;
			height: 450rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			overflow: hidden;
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
		padding-bottom: 62rpx;
		font-size: 14px;
	}
}
</style>
