<template>
	<navbar />
	<view class="home">
		<!-- 轮播图 -->
		<view class="home-banner">
			<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay>
				<swiper-item @click="toAlbumDetail(item)" v-for="(item, index) in album" :key="index">
					<image :src="item.cover" lazy-load mode="aspectFill"></image>
					<view class="item-info">
						<view class="info-title">
							<text class="name">{{ item.name }}</text>
							<text class="count">{{ item.wallpaper_count }}</text>
						</view>
						<view class="info-like">
							<text>{{ item.total_likes }}人喜欢</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 推荐创作者 -->
		<view class="home-author">
			<view class="author-title">
				<view class="title">推荐创作者</view>
				<navigator url="/pages/author/author" open-type="reLaunch" class="more">More+</navigator>
			</view>
			<view class="author-list">
				<view @click="toUserDetail(item)" v-for="(item, index) in userList" :key="index" class="list-item">
					<image :src="item.avatar_url" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<!-- 今日主题 -->
		<view class="home-sort">
			<view class="sort-title">
				<view class="title">今日主题</view>
				<navigator url="/pages/sort/sort" open-type="reLaunch" class="more">More+</navigator>
			</view>
			<view class="sort-list">
				<scroll-view scroll-x>
					<view @click="toSortList(item, index)" class="list-item" v-for="(item, index) in today" :key="index">
						<image :src="item" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 热门头像 -->
		<view class="home-avatar">
			<view class="avatar-title">
				<view class="title">热门头像</view>
				<navigator url="/pages/sort/sort" open-type="reLaunch" class="more">More+</navigator>
			</view>
			<view class="avatar-list">
				<scroll-view scroll-x>
					<view @click="toSortList(item, index)" class="list-item" v-for="(item, index) in avatar" :key="index">
						<image :src="item" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 电脑平板 -->
		<view class="home-tablet">
			<view class="tablet-title">
				<view class="title">电脑平板</view>
				<navigator url="/pages/sort/sort" open-type="reLaunch" class="more">More+</navigator>
			</view>
			<view class="tablet-list">
				<scroll-view scroll-x>
					<view @click="toSortList(item, index)" class="list-item" v-for="(item, index) in tablet" :key="index">
						<image :src="item" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 优选推荐 -->
		<view class="home-recommend">
			<view class="recommend-title">
				<view class="title">优选推荐</view>
				<view @click="toSortList({ id: '' }, -1)" class="more">More+</view>
			</view>
			<!-- 加载提示 -->
			<view class="loading" v-if="isLoading">加载中...</view>
			<view class="recommend-list">
				<view @click="toPreview(item, index)" class="list-item" v-for="(item, index) in rankList" :key="index">
					<image :src="item.url" lazy-load mode="aspectFill"></image>
				</view>
			</view>
			<!-- 到底提示 -->
			<view class="end-tip" v-if="isEnd && rankList.length > 0">已经到底啦~</view>
		</view>
	</view>
	<tabbar />
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import tabbar from '../../components/tabbar.vue';
import { selecCategoryPage, selecUserPage, login, selectAllWallpaperByType } from '../../api/api';
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';

const avatar = ref([
	'https://img0.baidu.com/it/u=2730920252,125676569&fm=253&app=53&size=w500&n=0&g=0n&f=jpeg?sec=1758718245&t=b86853a1c81ca12c675226451de3a33c',
	'https://img0.baidu.com/it/u=559900546,2995137416&fm=253&app=53&size=w500&n=0&g=0n&f=jpeg?sec=1758718245&t=d347f65adbf6a272a07e7636c3b19cc1',
	'https://img2.baidu.com/it/u=1795647913,2590992694&fm=253&app=53&size=w500&n=0&g=0n&f=jpeg?sec=1758718245&t=c41c1d750ddb15207f40e11bd0b99c6a',
	'https://img2.baidu.com/it/u=2936530100,1316476798&fm=253&app=53&size=w500&n=0&g=0n&f=jpeg?sec=1758718245&t=5a1c7d52aa4d798d75d1ef59af94a817',
	'https://img2.baidu.com/it/u=1581320883,910100018&fm=253&app=53&size=w500&n=0&g=0n&f=jpeg?sec=1758717994&t=ac1e238f233c3525ec9b6d04886cc8a0',
	'https://img0.baidu.com/it/u=3997048646,1811313428&fm=253&app=53&size=w500&n=0&g=0n&f=jpeg?sec=1758717994&t=ae83d02a0ad821ebe96d9271660f78e2'
]);
const tablet = ref([
	'https://img0.baidu.com/it/u=251746119,4081491608&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
	'https://img2.baidu.com/it/u=854359417,2647739631&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
	'https://img0.baidu.com/it/u=3359623666,43704731&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
	'https://img0.baidu.com/it/u=991997669,3955028944&fm=253&fmt=auto&app=138&f=JPEG?w=890&h=500',
	'https://img2.baidu.com/it/u=1757959266,2876662344&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
	'https://img0.baidu.com/it/u=17320500,827558150&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
]);
const today = ref([
	'https://img0.baidu.com/it/u=4240484205,4161142490&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1084',
	'https://img2.baidu.com/it/u=1592387971,3334934767&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1112',
	'https://img1.baidu.com/it/u=2578948944,3084781980&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889',
	'https://img0.baidu.com/it/u=861660600,1038167782&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1088',
	'https://img0.baidu.com/it/u=3804574816,3718204157&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1081',
	'https://img1.baidu.com/it/u=3371360631,4284967255&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1111'
]);

// 专辑数据
const album = ref();
// 分页获取专辑的参数
const albumParams = reactive({
	type: 1,
	status: 1,
	page: 1,
	pagesize: 6
});
//  分页获取专辑方法
const getAlbum = async () => {
	const result = await selecCategoryPage(albumParams);
	album.value = result;
	// console.log('首页轮播图数据',album.value);
};
// 跳转到专辑详情
const toAlbumDetail = (item) => {
	const album_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/albumDetail/albumDetail?item=${encodeURIComponent(album_item)}`
	});
};

// 用户数据
const userList = ref();
// 分页获取用户参数
const userParams = reactive({
	page: 1,
	pagesize: 5
});
// 分页获取用户方法
const getUserList = async () => {
	const result = await selecUserPage(userParams);
	userList.value = result;
};
// 跳转到用户详情
const toUserDetail = (item) => {
	const author_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/authorDetail/authorDetail?item=${encodeURIComponent(author_item)}&need=0`
	});
};

// 分类数据
const sort = ref();
// 分页获取分类的参数
const sortParams = reactive({
	type: 0,
	status: 1,
	page: 1,
	pagesize: 5
});
//  分页获取分类方法
const getSort = async () => {
	const result = await selecCategoryPage(sortParams);
	sort.value = result;
};
// 跳转到壁纸分类页
const toSortList = (item, index) => {
	const sort_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/sortList/sortList?item=${encodeURIComponent(sort_item)}&index=${index + 1}`
	});
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
// 加载状态控制
const isLoading = ref(false);
// 获取排序列表参数
const rankListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 0,
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
			rankListParams.user_id = userInfo.value.id || ''; // 优先用最新存储值
			const result = await selectAllWallpaperByType(rankListParams);
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
			uni.setStorageSync('home-wallpapers', JSON.stringify(rankList.value));
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

// 跳转到排行榜页面
const toRank = (type) => {
	uni.navigateTo({
		url: `/pages/rank/rank?type=${type}`
	});
};
// 跳转到壁纸预览界面
const toPreview = (item, index) => {
	const from = 'home-wallpapers';
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${index}&from=${encodeURIComponent(from)}`
	});
};

// 挂载
onLoad(() => {
	// 获取专辑
	getAlbum();
	// 获取用户
	getUserList();
	// 获取分类
	getSort();
	// 获取排序列表数据
	getRankList();
});
</script>

<style lang="scss">
.home {
	width: 100%;
	height: 100%;
	padding: 30rpx;
	padding-top: 210rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	/* 轮播图 */
	.home-banner {
		position: relative;
		width: 100%;
		height: 358rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 1px 20px -6px #00000080;
		::v-deep {
			.wx-swiper-dot {
				width: 20rpx !important;
				height: 5rpx !important;
				border-radius: 0 !important;
			}
		}
		swiper {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			width: 100%;
			height: 100%;
			swiper-item {
				width: 100%;
				height: 100%;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				position: relative;
				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
				.item-info {
					width: 100%;
					height: 100%;
					padding: 30rpx;
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
						text {
							font-size: 12px;
							padding: 4px 16px;
							background-color: rgba(40, 40, 40, 0.8);
							border-radius: 20px;
						}
					}
				}
			}
		}
	}
	/* 今日主题 */
	.home-sort {
		width: 100%;
		margin: 60rpx 0;
		.sort-title {
			width: 100%;
			position: relative;
			padding-bottom: 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-family: fantasy;
			.title {
				font-size: 20px;
				font-weight: 700;
			}
			.more {
				font-size: 16px;
				color: gray;
				border-radius: 0.625rem;
				padding: 0.14rem 0.4rem;
				background-color: #2f2a24;
			}
		}
		.sort-list {
			height: 450rpx;
			scroll-view {
				height: 100%;
				white-space: nowrap;
				height: 100%;
				.list-item {
					width: 216rpx;
					height: 100%;
					margin-right: 20rpx;
					display: inline-block;
					border-radius: 20rpx;
					position: relative;
					&:last-child {
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
	}

	/* 推荐创作者 */
	.home-author {
		width: 100%;
		margin: 60rpx 0;
		.author-title {
			width: 100%;
			position: relative;
			padding-bottom: 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-family: fantasy;
			.title {
				font-size: 20px;
				font-weight: 700;
			}
			.more {
				font-size: 16px;
				color: gray;
				border-radius: 0.625rem;
				padding: 0.14rem 0.4rem;
				background-color: #2f2a24;
			}
		}
		.author-list {
			width: 100%;
			position: relative;
			display: flex;
			justify-content: space-between;
			.list-item {
				width: 15vw;
				height: 15vw;
				border-radius: 50%;
				border: 2px solid #fff;
			}
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}
	/* 热门头像 */
	.home-avatar {
		width: 100%;
		margin: 60rpx 0;
		.avatar-title {
			width: 100%;
			position: relative;
			padding-bottom: 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-family: fantasy;
			.title {
				font-size: 20px;
				font-weight: 700;
			}
			.more {
				font-size: 16px;
				color: gray;
				border-radius: 0.625rem;
				padding: 0.14rem 0.4rem;
				background-color: #2f2a24;
			}
		}
		.avatar-list {
			height: 216rpx;
			scroll-view {
				height: 100%;
				white-space: nowrap;
				height: 100%;
				.list-item {
					width: 216rpx;
					height: 100%;
					margin-right: 20rpx;
					display: inline-block;
					overflow: hidden;
					position: relative;
					&:last-child {
						margin-right: 0;
					}
					image {
						width: 100%;
						height: 100%;
						border-radius: 30rpx;
					}
				}
			}
		}
	}
	/* 电脑平板 */
	.home-tablet {
		width: 100%;
		margin: 60rpx 0;
		.tablet-title {
			width: 100%;
			position: relative;
			padding-bottom: 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-family: fantasy;
			.title {
				font-size: 20px;
				font-weight: 700;
			}
			.more {
				font-size: 16px;
				color: gray;
				border-radius: 0.625rem;
				padding: 0.14rem 0.4rem;
				background-color: #2f2a24;
			}
		}
		.tablet-list {
			height: 216rpx;
			scroll-view {
				height: 100%;
				white-space: nowrap;
				height: 100%;
				.list-item {
					width: 330rpx;
					height: 100%;
					margin-right: 20rpx;
					display: inline-block;
					border-radius: 20rpx;
					position: relative;
					&:last-child {
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
	}
	/* 优选推荐 */
	.home-recommend {
		width: 100%;
		margin: 60rpx 0;
		.recommend-title {
			width: 100%;
			position: relative;
			padding-bottom: 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-family: fantasy;
			.title {
				font-size: 20px;
				font-weight: 700;
			}
			.more {
				font-size: 16px;
				color: gray;
				border-radius: 0.625rem;
				padding: 0.14rem 0.4rem;
				background-color: #2f2a24;
			}
		}
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
</style>
