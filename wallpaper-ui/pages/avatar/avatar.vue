<template>
	<view class="avatar">
		<!-- 头部导航 -->
		<view class="avatar-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>头像</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 头像类型 -->
		<view class="avatar-type">
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
		<view class="avatar-list">
			<view @click="toAvatarDetail(item, index)" class="list-item" v-for="(item, index) in avatarList" :key="index">
				<image :src="item.url" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 加载提示 -->
		<view class="loading" v-if="isLoading">加载中...</view>
		<!-- 到底提示 -->
		<view class="end-tip" v-if="isEnd && avatarList.length > 0">已经到底啦~</view>
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

// 头像类型
const sort = ref([]);
// 分页获取分类的参数
const sortParams = reactive({
	type: 4,
	status: 1,
	page: 1,
	pagesize: 100
});
//  分页获取分类方法
const getSort = async () => {
	const result = await selecCategoryPage(sortParams);
	const all = {
		id: '',
		name: '最新',
		cover: '',
		updatedate: '',
		wallpaper_count: 0,
		total_likes: 0
	};
	result.unshift(all);
	sort.value = result;
	// console.log('sort', sort.value);
};

// 当前类型下标
const currentIndex = ref(0);
// 切换类型
const changeType = (item, index) => {
	if (currentIndex.value === index) return; // 类型未变化则直接返回
	currentIndex.value = index;
	// 重置状态
	avatarList.value = [];
	avatarListParams.page = 1;
	isEnd.value = false;
	avatarListParams.category_id = item.id;
	getAvatarList();
};

// 专辑列表
const avatarList = ref([]);
// 是否加载全部
const isEnd = ref(false);
// 加载状态控制
const isLoading = ref(false);
// 获取专辑列表参数
const avatarListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 4,
	category_id: '',
	status: 1,
	page: 1,
	pagesize: 24
});
// 获取专辑列表方法
const getAvatarList = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			// 从本地存储重新读取一次，避免依赖onShow的时机
			userInfo.value = uni.getStorageSync('userInfo');
			avatarListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
			const result = currentIndex.value === 0 ? await selectAllWallpaperByType(avatarListParams) : await selecWallpaperPageByCategoryId(avatarListParams);
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
			avatarList.value = [...avatarList.value, ...result];
			uni.setStorageSync(fromPage.value, JSON.stringify(avatarList.value));
			// 是否到底
			if (result.length === 0) {
				isEnd.value = true;
			}
		} catch (error) {
			console.error('获取数据失败:', error);
			// 失败时回退页码，方便重试
			avatarListParams.page--;
		} finally {
			isLoading.value = false; // 解锁加载状态
		}
	}
};
// 页面唯一标识
const fromPage = ref('');
// 挂载
onLoad((options) => {
	// 获取唯一标识
	fromPage.value = 'avatar-' + getRandomID();

	// 获取头像分类
	getSort();
	// 获取专辑列表数据
	getAvatarList();
});
// 销毁页面时
onUnload(() => {
	uni.removeStorageSync(fromPage.value);
});

// 触底加载更加专辑数据
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		avatarListParams.page++;
		getAvatarList();
	}
});

// 跳转到壁纸预览界面
const toAvatarDetail = (item, index) => {
	uni.navigateTo({
		url: `/pages/avatarDetail/avatarDetail?id=${item.id}&index=${index}&from=${encodeURIComponent(fromPage.value)}`
	});
};

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
.avatar {
	width: 100%;
	height: 100%;
	background-color: #141414;
	padding: 30rpx;
	padding-top: 280rpx;
	overflow: auto;
	/* 头部导航栏 */
	.avatar-navbar {
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
	/* 头像类型 */
	.avatar-type {
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
	.avatar-list {
		width: 100%;
		position: relative;
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
	/* 加载提示样式 */
	.loading {
		color: #fff;
		text-align: center;
		padding: 20rpx 0;
		font-size: 14px;
	}
	/* 到底提示样式 */
	.end-tip {
		color: #888;
		text-align: center;
		padding: 30rpx 0;
		padding-bottom: 100rpx;
		font-size: 14px;
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
