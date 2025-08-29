<template>
	<view class="share">
		<!-- 头部导航 -->
		<view class="mycollection-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>我的收藏</text>
			<view style="width: 20px"></view>
		</view>
		<view class="waterfall-container">
			<up-waterfall v-model="shareList" ref="uWaterfallRef" columns="2">
				<template v-slot:column="{ colList, colIndex }">
					<view @click="toShareListPreview(item)" class="waterfall-item" v-for="(item, index) in colList" :key="item.id">
						<image :src="item.url" class="main-img" mode="widthFix" lazy-load></image>
						<!-- 标题（单行省略） -->
						<view class="item-title">{{ item.title }}</view>
						<!-- 底部信息（用户+点赞） -->
						<view class="item-footer">
							<view class="user-info">
								<image :src="item.user_avatar" mode="aspectFill" class="avatar"></image>
								<text class="username">{{ item.user_name }}</text>
							</view>
							<view class="like-info">
								<text class="like-icon">❤</text>
								<text class="like-count">{{ item.like_count }}</text>
							</view>
						</view>
					</view>
				</template>
			</up-waterfall>
		</view>
		<!-- 加载提示 -->
		<view class="loading" v-if="isLoading">——————&nbsp;&nbsp;加载中...&nbsp;&nbsp;——————</view>
		<!-- 到底提示 -->
		<view class="end-tip" :style="{ opacity: isEnd && shareList.length > 0 ? '1' : '0' }">——————&nbsp;&nbsp;已经到底啦~&nbsp;&nbsp;——————</view>
		<!-- 前往顶部 -->
		<view class="tools-top" :class="{ 'is-visible': isShow }" @click="toTop">
			<image src="/static/images/top.png" mode="aspectFill"></image>
		</view>
	</view>
	<tabbar />
</template>

<script setup>
import { getRandomID } from '../../utils/customize';
import navbar from '../../components/navbar.vue';
import { selectUserWallpapers } from '../../api/api';
import { onLoad, onShow, onReachBottom, onUnload, onPageScroll } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';

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

	// 清除缓存并保持广场列表数据一致性
	handleShareList();
});

// 广场列表
const shareList = ref([]);
// 是否加载全部
const isEnd = ref(false);
// 加载状态控制
const isLoading = ref(false);
// 获取广场列表参数
const shareListParams = reactive({
	user_id: '',
	type: 1,
	page: 1,
	pagesize: 24
});
// 获取广场列表方法
const getShareList = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			// 从本地存储重新读取一次，确保使用最新值
			userInfo.value = uni.getStorageSync('userInfo');
			shareListParams.user_id = userInfo.value.id || '';

			const result = await selectUserWallpapers(shareListParams);

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

			// 核心：数据去重 - 过滤掉已存在的项目
			const newItems = processedResult.filter((newItem) => !shareList.value.some((existItem) => existItem.id === newItem.id));

			// 合并新数据
			shareList.value = [...shareList.value, ...newItems];

			// 判断是否到底（基于过滤后的新数据）
			if (newItems.length === 0) {
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
// 页面唯一标识
const fromPage = ref('');
// 挂载
onLoad((options) => {
	// 获取唯一标识
	fromPage.value = 'myCollection-' + getRandomID();
	getShareList();
});
// 触底加载更多数据
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		shareListParams.page++;
		getShareList();
	}
});

// 选取广场列表的预览范围的起始下标
const startIndex = ref(0);
// 选取广场列表的预览范围的终止下标
const endIndex = ref(0);
// 跳转到壁纸查看界面
const toShareListPreview = (item) => {
	const index = shareList.value.findIndex((shareListItem) => item.id === shareListItem.id);
	// 计算当前分组（从0开始）
	const group = Math.floor(index / 48);
	// 计算起始下标
	startIndex.value = group * 48;
	// 计算终止下标（用于边界校验，实际截取时用不到）
	endIndex.value = Math.min(startIndex.value + 47, shareList.value.length - 1);
	// 计算当前在分组内的下标（1-48）
	const currentIndex = Math.ceil(index % 48);

	// 直接截取从startIndex开始的48条数据（slice自动处理边界，不足48条时取到末尾）
	const previewData = shareList.value.slice(startIndex.value, startIndex.value + 48);

	uni.setStorageSync(fromPage.value, JSON.stringify(previewData));
	uni.navigateTo({
		url: `/pages/shareList/shareList?id=${item.id}&index=${currentIndex}&from=${encodeURIComponent(fromPage.value)}`
	});
};
// 清除缓存并保持广场列表数据一致性
const handleShareList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync(fromPage.value);
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		shareList.value = [
			...shareList.value.slice(0, startIndex.value), // 前半段：从开头到 startIndex 前
			...cacheData, // 修改段：新数据
			...shareList.value.slice(endIndex.value + 1) // 后半段：从 endIndex 后到末尾
		];
		// 清理缓存
		uni.removeStorageSync(fromPage.value);
	}
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
.share {
	margin-top: 192rpx;
	width: 100%;
	min-height: 100vh;
	background-color: #141414;
	padding: 10rpx;
	box-sizing: border-box;
	overflow-x: hidden;
	/* 头部导航栏 */
	.mycollection-navbar {
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
	/* 瀑布流容器 */
	.waterfall-container {
		width: 100%;
		/* 瀑布流子项 */
		.waterfall-item {
			break-inside: avoid;
			-webkit-break-inside: avoid;
			margin-bottom: 10rpx;
			border-radius: 10rpx;
			background-color: #23232b;
			box-shadow: 0 1px 20px -6px rgba(0, 0, 0, 0.5);
			overflow: hidden;
			.main-img {
				width: 100%;
			}
			/* 标题样式 */
			.item-title {
				font-size: 13px;
				color: #fff;
				padding: 20rpx;
				font-weight: 600;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			/* 底部信息区 */
			.item-footer {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 20rpx 20rpx;
				box-sizing: border-box;
				/* 用户信息 */
				.user-info {
					display: flex;
					align-items: center;
					.avatar {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						display: block;
					}
					.username {
						color: #fff;
						font-size: 12px;
						margin-left: 8rpx;
					}
				}
				/* 点赞信息 */
				.like-info {
					display: flex;
					align-items: center;
					.like-icon {
						color: #ff4d4f;
						font-size: 14px;
					}
					.like-count {
						color: #fff;
						font-size: 12px;
						margin-left: 8rpx;
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
		padding: 60rpx 0;
		padding-bottom: 80rpx;
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
