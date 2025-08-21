<template>
	<navbar />
	<view class="home">
		<!-- 轮播图 -->
		<view class="home-banner">
			<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay>
				<swiper-item @click="toAlbumDetail(item)" v-for="(item, index) in album" :key="index">
					<image :src="item.cover" mode="aspectFill"></image>
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
		<!-- 分类精选 -->
		<view class="home-sort">
			<view class="sort-title">
				<view class="title">分类精选</view>
				<navigator url="/pages/sort/sort" open-type="reLaunch" class="more">More+</navigator>
			</view>
			<view class="sort-list">
				<scroll-view scroll-x>
					<navigator url="/pages/sortList/sortList" class="list-item" v-for="(item, index) in sort" :key="index">
						<image :src="item.cover" mode="aspectFill"></image>
						<view class="item-time">
							<text>2天前更新</text>
						</view>
						<view class="item-title">
							<text>{{ item.name }}</text>
						</view>
					</navigator>
				</scroll-view>
			</view>
		</view>
		<!-- 优选推荐 -->
		<view class="home-recommend">
			<view class="recommend-title">
				<view class="title">优选推荐</view>
				<view @click="toRank(2)" class="more">More+</view>
			</view>
			<view class="recommend-list">
				<view @click="toPreview(item, index)" class="list-item" v-for="(item, index) in rankList" :key="index">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import { selecCategoryPage, selecUserPage, login, selectAllWallpaperByType } from '../../api/api';
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';

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
		url: `/pages/authorDetail/authorDetail?item=${encodeURIComponent(author_item)}`
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

// 用户信息
const userInfo = ref({});
// token信息
const token = ref();
// 定义首次加载标记
const isFirstLoad = ref(true);
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');

	// 仅在非首次显示时执行逻辑
	if (!isFirstLoad.value) {
		// 如果需要每次显示都刷新列表（比如更新点赞/收藏状态），可重新调用接口
		rankListParams.page = 1;
		rankList.value = []; // 清空原有列表
		isEnd.value = false; // 重置到底状态
		getRankList(); // 重新请求数据
	}
});

// 排序列表
const rankList = ref([]);
// 是否加载全部
const isEnd = ref(false);

// 获取排序列表参数
const rankListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 0,
	page: 1,
	pagesize: 24
});
// 获取排序列表方法
const getRankList = async () => {
	if (!isEnd.value) {
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
		uni.setStorageSync('wallpapers', JSON.stringify(rankList.value));
		// 是否到底
		if (result.length === 0) {
			isEnd.value = true;
		}
	}
};

// 触底加载更加排序数据
onReachBottom(() => {
	rankListParams.page++;
	getRankList();
});

// 跳转到排行榜页面
const toRank = (type)=>{
	uni.navigateTo({
		url: `/pages/rank/rank?type=${type}`
	});
}
// 跳转到壁纸预览界面
const toPreview = (item, index) => {
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${index}`
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

	// 延迟标记非首次，确保在 onShow 之后执行
	nextTick(() => {
		isFirstLoad.value = false;
	});
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
	/* 分类精选 */
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
			height: 320rpx;
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
					.item-time {
						width: 100%;
						position: absolute;
						top: 0;
						display: flex;
						align-items: center;
						text {
							font-size: 12px;
							background-color: rgba(201, 114, 80, 0.8);
							border-radius: 10px 0 10px 0;
							padding: 2px 4px;
						}
					}
					.item-title {
						width: 100%;
						position: absolute;
						bottom: 0;
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 8px 0;
						background-color: rgba(40, 40, 40, 1.8);
						border-radius: 0 0 10px 10px;
						text {
							font-size: 13px;
							font-weight: 700;
						}
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
</style>
