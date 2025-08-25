<template>
	<view class="searchdetail">
		<!-- 头部导航 -->
		<view class="searchdetail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>{{ searchListParams.keyword }}</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 榜单类型 -->
		<view class="rank-type">
			<view class="title" @click="changeType(-1)" :class="{ selected: searchListParams.type === -1 }">全部</view>
			<view class="title" @click="changeType(10)" :class="{ selected: searchListParams.type === 10 }">手机</view>
			<view class="title" @click="changeType(3)" :class="{ selected: searchListParams.type === 3 }">平板</view>
			<view class="title" @click="changeType(4)" :class="{ selected: searchListParams.type === 4 }">头像</view>
		</view>
		<!-- 加载提示 -->
		<view class="loading" v-if="isLoading">加载中...</view>
		<view class="waterfall-container">
			<up-waterfall v-model="searchList" ref="uWaterfallRef" columns="2">
				<template v-slot:column="{ colList, colIndex }">
					<view @click="toSearchList(item)" class="waterfall-item" v-for="(item, index) in colList" :key="item.id">
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
		<!-- 到底提示 -->
		<view class="end-tip" v-if="isEnd && searchList.length > 0">已经到底啦~</view>
		<!-- 空数据提示 -->
		<view
			class="authordetail-nonetip"
			v-if="
				(searchListParams.type === -1 && countInfo.total_count == 0) ||
				(searchListParams.type === 10 && countInfo.normal_album_count == 0) ||
				(searchListParams.type === 3 && countInfo.tablet_count == 0) ||
				(searchListParams.type === 4 && countInfo.avatar_count == 0)
			"
		>
			<image src="/static/images/none_tip.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script setup>
import { getRandomID } from '../../utils/customize';
import { selectWallpaperBySearch } from '../../api/api';
import { onLoad, onShow, onReachBottom, onUnload } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';

const styleData = ref({ backgroundColor: '#141414' });

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
const searchList = ref([]);
const countInfo = ref({});
// 是否加载全部
const isEnd = ref(false);
// 加载状态控制
const isLoading = ref(false);

// 获取排序列表参数
const searchListParams = reactive({
	user_id: userInfo.value.id || '',
	type: -1,
	keyword: '',
	page: 1,
	pagesize: 24
});

// 获取排序列表方法
const getSearchList = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			// 从本地存储重新读取一次，确保使用最新值
			userInfo.value = uni.getStorageSync('userInfo');
			searchListParams.user_id = userInfo.value.id || '';

			const data = await selectWallpaperBySearch(searchListParams);
			const result = data.data;
			countInfo.value = data.countInfo[0];

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
			const newItems = processedResult.filter((newItem) => !searchList.value.some((existItem) => existItem.id === newItem.id));

			// 合并新数据
			searchList.value = [...searchList.value, ...newItems];
			uni.setStorageSync(fromPage.value, JSON.stringify(searchList.value));

			// 判断是否到底（基于过滤后的新数据）
			if (newItems.length === 0) {
				isEnd.value = true;
			}
		} catch (error) {
			console.error('获取数据失败:', error);
			// 失败时回退页码，方便重试
			searchListParams.page--;
		} finally {
			isLoading.value = false; // 解锁加载状态
		}
	}
};
// 切换榜单
const changeType = (type) => {
	if (searchListParams.type === type) return; // 类型未变化则直接返回
	// 重置状态
	searchList.value = [];
	searchListParams.page = 1;
	isEnd.value = false;
	searchListParams.type = type;
	// 根据类型判断是否需要请求数据
	let workCount = 0;
	switch (type) {
		case -1:
			workCount = countInfo.value.total_count;
			break;
		case 3:
			workCount = countInfo.value.tablet_count;
			break;
		case 4:
			workCount = countInfo.value.avatar_count;
			break;
		default:
			workCount = countInfo.value.normal_album_count;
	}

	// 只有当作品数量 > 0 时才请求数据
	if (workCount > 0) {
		getSearchList();
	}
};

// 触底加载更多数据
onReachBottom(() => {
	// 只有不在加载中且未到底时才加载更多
	if (!isLoading.value && !isEnd.value) {
		searchListParams.page++;
		getSearchList();
	}
});

// 跳转到壁纸查看界面
const toSearchList = (item) => {
	uni.navigateTo({
		url: `/pages/shareList/shareList?id=${item.id}&from=${encodeURIComponent(fromPage.value)}`
	});
};

// 页面唯一标识
const fromPage = ref('');
// 挂载
onLoad((options) => {
	// 获取唯一标识
	fromPage.value = 'searchdetail-' + getRandomID();

	searchListParams.keyword = decodeURIComponent(options.keyword);
	getSearchList();
});
// 销毁页面时
onUnload(() => {
	uni.removeStorageSync(fromPage.value);
});
</script>

<style lang="scss">
.searchdetail {
	width: 100%;
	min-height: 100vh;
	background-color: #141414;
	padding: 10rpx;
	padding-top: 280rpx;
	box-sizing: border-box;
	overflow-x: hidden;
	/* 头部导航栏 */
	.searchdetail-navbar {
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
		padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.title {
			font-size: 15px;
			padding: 10rpx 46rpx;
			background-color: #23232b;
			border-radius: 40rpx;
			&.selected {
				background-color: #444452;
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
	.end-tip {
		color: #888;
		text-align: center;
		padding: 30rpx 0;
		font-size: 14px;
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
</style>
