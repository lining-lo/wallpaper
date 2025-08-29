<template>
	<view class="authordetail">
		<!-- 头部导航 -->
		<view class="authordetail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>用户详情</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 账号信息 -->
		<view class="authordetail-info">
			<view class="info-user">
				<view class="user-left">
					<image v-if="authorInfo.avatar_url" :src="authorInfo.avatar_url" mode="aspectFill"></image>
				</view>
				<view class="user-right">
					<view class="name" v-if="authorInfo.name">{{ authorInfo.name }}</view>
					<view class="label" v-if="authorInfo">
						<view class="row">
							<view class="count">{{ authorInfo.total_works }}</view>
							<view class="title">作品</view>
						</view>
						<view class="row">
							<view class="count">{{ authorInfo.total_likes }}</view>
							<view class="title">获赞</view>
						</view>
						<view class="row">
							<view class="count">{{ authorInfo.total_downloads }}</view>
							<view class="title">下载</view>
						</view>
					</view>
				</view>
			</view>
			<view class="info-type">
				<view @click="changeWorks(0)" :class="{ selected: worksParams.type === 0 }" class="title">手机</view>
				<view @click="changeWorks(3)" :class="{ selected: worksParams.type === 3 }" class="title">平板</view>
				<view @click="changeWorks(4)" :class="{ selected: worksParams.type === 4 }" class="title">头像</view>
			</view>
		</view>
		<!-- 作品列表 -->
		<view
			:class="{
				phonelist: worksParams.type === 0,
				tabletlist: worksParams.type === 3,
				avatarlist: worksParams.type === 4
			}"
		>
			<view @click="toWorksPreview(item, index)" class="list-item" v-for="(item, index) in works" :key="index">
				<image :src="item.url" lazy-load mode="aspectFill"></image>
			</view>
			<!-- 空数据提示 -->
			<view
				class="authordetail-nonetip"
				v-if="
					(worksParams.type === 0 && authorInfo.normal_album_works === 0) ||
					(worksParams.type === 3 && authorInfo.tablet_works === 0) ||
					(worksParams.type === 4 && authorInfo.avatar_works === 0)
				"
			>
				<image src="/static/images/none_tip.png" mode="widthFix"></image>
			</view>
			<!-- 加载提示 -->
			<view class="loading" v-if="isLoading">——————&nbsp;&nbsp;加载中...&nbsp;&nbsp;——————</view>
			<!-- 到底提示 -->
			<view class="end-tip" :style="{ opacity: isEnd && works.length > 0 ? '1' : '0' }">——————&nbsp;&nbsp;已经到底啦~&nbsp;&nbsp;——————</view>
		</view>
	</view>
</template>

<script setup>
import { getRandomID } from '../../utils/customize';
import { onLoad, onShow, onReachBottom, onUnload } from '@dcloudio/uni-app';
import { getGender } from '../../utils/customize';
import { selecWallpaperPageByUserId, selectUserByUserId } from '../../api/api';
import { reactive, ref } from 'vue';

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

	// 清除缓存并保持作品数据一致性
	handleWorks();
});

// 作者信息
const authorInfo = ref({});
// 作者的作品
const works = ref([]);
// 获取作者作品的参数
const worksParams = reactive({
	current_userId: '',
	type: 0,
	user_id: '',
	status: 1,
	page: 1,
	pagesize: 9,
	need: 0
});
// 是否加载全部
const isEnd = ref(false);
// 加载状态控制
const isLoading = ref(false);
// 获取作者作品的方法
const getWorks = async (type) => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			worksParams.user_id = authorInfo.value.id;
			// 从本地存储重新读取一次，避免依赖onShow的时机
			userInfo.value = uni.getStorageSync('userInfo');
			worksParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
			const result = await selecWallpaperPageByUserId(worksParams);
			const myInfo = result.myInfo;
			if (myInfo !== null && myInfo !== undefined) {
				authorInfo.value = myInfo;
				console.log('我查了两次', myInfo);
			}
			const wallpapersResult = result.result;
			wallpapersResult.map((item) => {
				item.labels = JSON.parse(item.labels); // 解析labels为数组（假设存的是JSON字符串）
				if (item.is_collected >= 1) {
					item.isFristCollection = false; // 初始化是否首次收藏标记
				} else {
					item.isFristCollection = true; // 初始化是否首次收藏标记
				}
				return item;
			});
			works.value = [...works.value, ...wallpapersResult];
			// 是否到底
			if (wallpapersResult.length === 0) {
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
// 触底加载更多
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		worksParams.page++;
		getWorks();
	}
});

// 切换作品
const changeWorks = (type) => {
	if (worksParams.type === type) return; // 类型未变化则直接返回
	// 重置状态
	works.value = [];
	worksParams.page = 1;
	isEnd.value = false;
	worksParams.type = type;
	worksParams.need = 0;
	// 根据类型判断是否需要请求数据
	let workCount = 0;
	switch (type) {
		case 0:
			workCount = authorInfo.value.normal_album_works;
			break;
		case 3:
			workCount = authorInfo.value.tablet_works;
			break;
		default: // 默认为头像类型（type=4等）
			workCount = authorInfo.value.avatar_works;
	}

	// 只有当作品数量 > 0 时才请求数据
	if (workCount > 0) {
		getWorks();
	}
};

// 页面唯一标识
const fromPage = ref('');
// 选取作品的预览范围的起始下标
const startIndex = ref(0);
// 选取作品的预览范围的终止下标
const endIndex = ref(0);
// 跳转到作品预览界面
const toWorksPreview = (item, index) => {
	// 计算当前分组（从0开始）
	const group = Math.floor(index / 24);
	// 计算起始下标
	startIndex.value = group * 24;
	// 计算终止下标（用于边界校验，实际截取时用不到）
	endIndex.value = Math.min(startIndex.value + 23, works.value.length - 1);
	// 计算当前在分组内的下标（1-24）
	const currentIndex = Math.ceil(index % 24);

	// 直接截取从startIndex开始的24条数据（slice自动处理边界，不足24条时取到末尾）
	const previewData = works.value.slice(startIndex.value, startIndex.value + 24);

	uni.setStorageSync(fromPage.value, JSON.stringify(previewData));
	switch (item.type) {
		case 3:
			uni.navigateTo({
				url: `/pages/tabletDetail/tabletDetail?id=${item.id}&index=${currentIndex}&from=${encodeURIComponent(fromPage.value)}`
			});
			break;
		case 4:
			uni.navigateTo({
				url: `/pages/avatarDetail/avatarDetail?id=${item.id}&index=${currentIndex}&from=${encodeURIComponent(fromPage.value)}`
			});
			break;
		default:
			uni.navigateTo({
				url: `/pages/preview/preview?id=${item.id}&index=${currentIndex}&from=${encodeURIComponent(fromPage.value)}`
			});
	}
};
// 清除缓存并保持作品数据一致性
const handleWorks = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync(fromPage.value);
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		works.value = [
			...works.value.slice(0, startIndex.value), // 前半段：从开头到 startIndex 前
			...cacheData, // 修改段：新数据
			...works.value.slice(endIndex.value + 1) // 后半段：从 endIndex 后到末尾
		];
		// 清理缓存
		uni.removeStorageSync(fromPage.value);
	}
};

// 挂载
onLoad((options) => {
	// 获取唯一标识
	fromPage.value = 'authordetail-' + getRandomID();

	// 获取作者信息
	const author_item = JSON.parse(decodeURIComponent(options.item));
	authorInfo.value = author_item;
	const need = parseInt(options.need);
	worksParams.need = need;

	// 获取作者作品
	getWorks();
});
</script>

<style lang="scss">
.authordetail {
	width: 100%;
	min-height: 100vh;
	background-color: #141414;
	padding-top: 200rpx;
	overflow: auto;
	/* 头部导航栏 */
	.authordetail-navbar {
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
	/* 账号信息 */
	.authordetail-info {
		padding-top: 30rpx;
		width: 100%;
		position: fixed;
		top: 178rpx;
		z-index: 1;
		background-color: #141414;
		.info-user {
			padding: 0 30rpx;
			width: 100%;
			margin-bottom: 50rpx;
			display: flex;
			align-items: center;
			.user-left {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				border: 2px solid #fff;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.user-right {
				margin-left: 30rpx;
				width: calc(100% - 192rpx);
				height: 130rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.name {
					font-size: 20px;
					font-weight: 600;
					margin-bottom: 20rpx;
				}
				.label {
					width: 100%;
					display: flex;
					align-items: center;
					font-weight: 600;
					.row {
						display: flex;
						align-items: center;
						margin-right: 20rpx;
						.count {
							margin-right: 10rpx;
						}
						.title {
							color: #797979;
						}
					}
				}
			}
		}
		.info-type {
			width: 100%;
			height: 130rpx;
			background-color: #1e1d1d;
			border-radius: 40rpx 40rpx 0 0;
			padding: 0 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				padding: 10rpx 70rpx;
				background-color: #23232b;
				border-radius: 40rpx;
				&.selected {
					background-color: #444452;
				}
			}
		}
	}
	/* 作品列表 */
	// 普通|专辑
	.phonelist {
		padding: 0 30rpx;
		padding-top: 340rpx;
		width: 100%;
		min-height: calc(100vh - 200rpx);
		background-color: #1e1d1d;
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
	// 平板
	.tabletlist {
		padding: 0 20rpx;
		padding-top: 340rpx;
		width: 100%;
		min-height: calc(100vh - 200rpx);
		background-color: #1e1d1d;
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
	// 头像
	.avatarlist {
		padding: 0 30rpx;
		padding-top: 340rpx;
		width: 100%;
		min-height: calc(100vh - 200rpx);
		background-color: #1e1d1d;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.list-item {
			width: 48%;
			height: 172px;
			border-radius: 40rpx;
			box-shadow: 0 1px 20px -6px #00000080;
			margin-bottom: 40rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 40rpx;
			}
		}
	}

	/* 空数据提示 */
	.authordetail-nonetip {
		width: 100%;
		display: flex;
		margin-top: 200rpx;
		justify-content: center;
		image {
			width: 340rpx;
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
</style>
