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
				<view @click="toMoreAuthor" class="more">More+</view>
			</view>
			<view class="author-list">
				<view @click="toAuthorDetail(item)" v-for="(item, index) in authorList" :key="index" class="list-item">
					<image :src="item.avatar_url" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<!-- 今日主题 -->
		<view class="home-sort">
			<view class="sort-title">
				<view class="title">每日主题</view>
				<view @click="toMoreSortList({ id: '' }, -1)" class="more">More+</view>
			</view>
			<view class="sort-list">
				<scroll-view scroll-x>
					<view @click="toThemesPreview(item, index)" class="list-item" v-for="(item, index) in themesList" :key="index">
						<image :src="item.url" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 热门头像 -->
		<view class="home-avatar">
			<view class="avatar-title">
				<view class="title">热门头像</view>
				<navigator url="/pages/avatar/avatar" class="more">More+</navigator>
			</view>
			<view class="avatar-list">
				<scroll-view scroll-x>
					<view @click="toAvatarPreview(item, index)" class="list-item" v-for="(item, index) in avatarList" :key="index">
						<image :src="item.url" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 电脑平板 -->
		<view class="home-tablet">
			<view class="tablet-title">
				<view class="title">电脑平板</view>
				<navigator url="/pages/tablet/tablet" class="more">More+</navigator>
			</view>
			<view class="tablet-list">
				<scroll-view scroll-x>
					<view @click="toTabletPreview(item, index)" class="list-item" v-for="(item, index) in tabletList" :key="index">
						<image :src="item.url" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 动态壁纸 -->
		<view class="home-live">
			<view class="live-title">
				<view class="title">动态壁纸</view>
				<navigator url="/pages/live/live" class="more">More+</navigator>
			</view>
			<view class="live-list">
				<scroll-view scroll-x>
					<view @click="toLivePreview(item, index)" class="list-item" v-for="(item, index) in liveList" :key="index">
						<image :src="item.url" lazy-load mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 优选推荐 -->
		<view class="home-recommend">
			<view class="recommend-title">
				<view class="title">优选推荐</view>
				<view @click="toMoreSortList({ id: '' }, -1)" class="more">More+</view>
			</view>
			<view class="recommend-list">
				<view @click="toRecommendListPreview(item, index)" class="list-item" v-for="(item, index) in recommendList" :key="index">
					<image :src="item.url" lazy-load mode="aspectFill"></image>
				</view>
			</view>
			<!-- 加载提示 -->
			<view class="loading" v-if="isLoading">——————&nbsp;&nbsp;加载中...&nbsp;&nbsp;——————</view>
			<!-- 到底提示 -->
			<view class="end-tip" :style="{ opacity: isEnd && recommendList.length > 0 ? '1' : '0' }">——————&nbsp;&nbsp;已经到底啦~&nbsp;&nbsp;——————</view>
		</view>
		<!-- 前往顶部 -->
		<view class="tools-top" :class="{ 'is-visible': isShow }" @click="toTop">
			<image src="/static/images/top.png" mode="aspectFill"></image>
		</view>
	</view>
	<tabbar />
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import tabbar from '../../components/tabbar.vue';
import { parseLabels } from '../../utils/customize';
import { selecCategoryPage, selecUserPage, login, selectAllWallpaperByType, getHomeData } from '../../api/api';
import { onLoad, onShow, onReachBottom, onPageScroll } from '@dcloudio/uni-app';
import { nextTick, reactive, ref } from 'vue';

// 用户信息
const userInfo = ref({});
// token信息
const token = ref();
onShow(() => {
	// 每次页面显示时，重新读取本地存储的 userInfo 和 token
	userInfo.value = uni.getStorageSync('userInfo');
	token.value = uni.getStorageSync('token');

	// 清除缓存并保持每日主题数据一致性
	handleThemesList();
	// 清除缓存并保持热门头像数据一致性
	handleAvatarList();
	// 清除缓存并保持电脑平板数据一致性
	handleTabletList();
	// 清除缓存并保持动态壁纸数据一致性
	handleLiveList();
	// 清除缓存并保持优选推荐数据一致性
	handleRecommendList();
});

// 专辑数据
const album = ref();
// 跳转到专辑详情
const toAlbumDetail = (item) => {
	const album_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/albumDetail/albumDetail?item=${encodeURIComponent(album_item)}`
	});
};

// 推荐创作者
const authorList = ref();
// 前往更多创作者
const toMoreAuthor = () => {
	uni.switchTab({
		url: '/pages/author/author'
	});
};
// 跳转到用户详情
const toAuthorDetail = (item) => {
	const author_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/authorDetail/authorDetail?item=${encodeURIComponent(author_item)}&need=0`
	});
};

// 每日主题
const themesList = ref();
// 前往更多手机壁纸
const toMoreSortList = (item, index) => {
	const sort_item = JSON.stringify(item);
	uni.navigateTo({
		url: `/pages/sortList/sortList?item=${encodeURIComponent(sort_item)}&index=${index + 1}`
	});
};
// 跳转到壁纸预览界面
const toThemesPreview = (item, index) => {
	const from = 'home-themeList';
	uni.setStorageSync(from, JSON.stringify(themesList.value));
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${index}&from=${encodeURIComponent(from)}`
	});
};
// 清除缓存并保持每日主题数据一致性
const handleThemesList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync('home-themeList');
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		themesList.value = cacheData;
		// 清理缓存
		uni.removeStorageSync('home-themeList');
	}
};

// 热门头像
const avatarList = ref();
// 跳转到头像预览界面
const toAvatarPreview = (item, index) => {
	const from = 'home-avatarList';
	uni.setStorageSync(from, JSON.stringify(avatarList.value));
	uni.navigateTo({
		url: `/pages/avatarDetail/avatarDetail?id=${item.id}&index=${index}&from=${encodeURIComponent(from)}`
	});
};
// 清除缓存并保持热门头像数据一致性
const handleAvatarList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync('home-avatarList');
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		avatarList.value = cacheData;
		// 清理缓存
		uni.removeStorageSync('home-avatarList');
	}
};

// 电脑平板
const tabletList = ref();
// 跳转到电脑平板预览界面
const toTabletPreview = (item, index) => {
	const from = 'home-tabletList';
	uni.setStorageSync(from, JSON.stringify(tabletList.value));
	uni.navigateTo({
		url: `/pages/tabletDetail/tabletDetail?id=${item.id}&index=${index}&from=${encodeURIComponent(from)}`
	});
};
// 清除缓存并保持电脑平板数据一致性
const handleTabletList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync('home-tabletList');
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		tabletList.value = cacheData;
		// 清理缓存
		uni.removeStorageSync('home-tabletList');
	}
};

// 动态壁纸
const liveList = ref();
// 跳转到动态壁纸预览页
const toLivePreview = (item, index) => {
	const from = 'home-liveList';
	uni.setStorageSync(from, JSON.stringify(liveList.value));
	uni.navigateTo({
		url: `/pages/liveDetail/liveDetail?id=${item.id}&index=${index}&from=${encodeURIComponent(from)}`
	});
};
// 清除缓存并保持动态壁纸数据一致性
const handleLiveList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync('home-liveList');
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		liveList.value = cacheData;
		// 清理缓存
		uni.removeStorageSync('home-liveList');
	}
};

// 获取首页数据
const getData = async () => {
	// 从本地存储重新读取一次，避免依赖onShow的时机
	userInfo.value = uni.getStorageSync('userInfo');
	const current_userId = userInfo.value.id || '';
	const result = await getHomeData({ current_userId });
	console.log(result);

	// 处理labels字段
	Object.keys(result).forEach((key) => {
		result[key] = result[key].map((item) => {
			item.labels = parseLabels(item.labels);
			return item;
		});
	});

	// 获取专辑数据
	album.value = result.albumList;
	// 获取推荐创作者数据
	authorList.value = result.authorList;
	// 获取每日主题数据
	themesList.value = result.themesList;
	// 获取热门头像数据
	avatarList.value = result.avatarList;
	// 获取电脑平板数据
	tabletList.value = result.tabletList;
	// 获取动态壁纸数据
	liveList.value = result.liveList;
};

// 优选推荐
const recommendList = ref([]);
// 是否加载全部
const isEnd = ref(false);
// 加载状态控制
const isLoading = ref(false);
// 获取优选推荐参数
const recommendListParams = reactive({
	current_userId: userInfo.value.id || '',
	type: 0,
	page: 2,
	pagesize: 24
});
// 获取优选推荐方法
const getRecommendList = async () => {
	// 防止重复请求和无效请求
	if (!isEnd.value && !isLoading.value) {
		isLoading.value = true; // 锁定加载状态

		try {
			// 从本地存储重新读取一次，避免依赖onShow的时机
			userInfo.value = uni.getStorageSync('userInfo');
			recommendListParams.current_userId = userInfo.value.id || ''; // 优先用最新存储值
			const result = await selectAllWallpaperByType(recommendListParams);
			result.map((item) => {
				item.labels = parseLabels(item.labels);
				return item;
			});
			// 存入数据
			recommendList.value = [...recommendList.value, ...result];
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
		recommendListParams.page++;
		getRecommendList();
	}
});
// 选取优选推荐的预览范围的起始下标
const startIndex = ref(0);
// 选取优选推荐的预览范围的终止下标
const endIndex = ref(0);
// 跳转到优选推荐预览界面
const toRecommendListPreview = (item, index) => {
	// 计算当前分组（从0开始）
	const group = Math.floor(index / 24);
	// 计算起始下标
	startIndex.value = group * 24;
	// 计算终止下标（用于边界校验，实际截取时用不到）
	endIndex.value = Math.min(startIndex.value + 23, recommendList.value.length - 1);
	// 计算当前在分组内的下标（1-24）
	const currentIndex = Math.ceil(index % 24);

	const from = 'home-recommendList';
	// 直接截取从startIndex开始的24条数据（slice自动处理边界，不足24条时取到末尾）
	const previewData = recommendList.value.slice(startIndex.value, startIndex.value + 24);

	uni.setStorageSync(from, JSON.stringify(previewData));
	uni.navigateTo({
		url: `/pages/preview/preview?id=${item.id}&index=${currentIndex}&from=${encodeURIComponent(from)}`
	});
};
// 清除缓存并保持优选推荐数据一致性
const handleRecommendList = () => {
	// 获取缓存数据
	const storageStr = uni.getStorageSync('home-recommendList');
	// 先判断缓存是否存在且不是空字符串
	if (storageStr && typeof storageStr === 'string') {
		// 保持数据一致性
		const cacheData = JSON.parse(storageStr);
		recommendList.value = [
			...recommendList.value.slice(0, startIndex.value), // 前半段：从开头到 startIndex 前
			...cacheData, // 修改段：新数据
			...recommendList.value.slice(endIndex.value + 1) // 后半段：从 endIndex 后到末尾
		];
		// 清理缓存
		uni.removeStorageSync('home-recommendList');
	}
};

// 挂载
onLoad(() => {
	// 获取首页数据
	getData();
	// 获取优选推荐数据
	getRecommendList();
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
	/* 动态壁纸 */
	.home-live {
		width: 100%;
		margin: 60rpx 0;
		.live-title {
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
		.live-list {
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

/* 到底提示样式 */
.loading,
.end-tip {
	color: #888;
	text-align: center;
	padding: 30rpx 0;
	padding-bottom: 100rpx;
	font-size: 14px;
}
</style>
