<template>
	<navbar />
	<view class="home">
		<!-- 毛玻璃背景 -->
		<view class="home-background"></view>
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
					<navigator url="/pages/sortList/sortList" class="list-item">
						<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
						<view class="item-time">
							<text>2天前更新</text>
						</view>
						<view class="item-title">
							<text>可爱萌宠</text>
						</view>
					</navigator>
					<navigator url="/pages/sortList/sortList" class="list-item">
						<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
						<view class="item-time">
							<text>2天前更新</text>
						</view>
						<view class="item-title">
							<text>可爱萌宠</text>
						</view>
					</navigator>
					<navigator url="/pages/sortList/sortList" class="list-item">
						<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
						<view class="item-time">
							<text>2天前更新</text>
						</view>
						<view class="item-title">
							<text>可爱萌宠</text>
						</view>
					</navigator>
					<navigator url="/pages/sortList/sortList" class="list-item">
						<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
						<view class="item-time">
							<text>2天前更新</text>
						</view>
						<view class="item-title">
							<text>可爱萌宠</text>
						</view>
					</navigator>
					<navigator url="/pages/sortList/sortList" class="list-item">
						<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
						<view class="item-time">
							<text>2天前更新</text>
						</view>
						<view class="item-title">
							<text>可爱萌宠</text>
						</view>
					</navigator>
				</scroll-view>
			</view>
		</view>
		<!-- 优选推荐 -->
		<view class="home-recommend">
			<view class="recommend-title">
				<view class="title">优选推荐</view>
				<view class="more">More+</view>
			</view>
			<view class="recommend-list">
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=1385187587,3636080608&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=4015338242,787950689&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1085" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=2737969190,1661739575&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1004" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=4263426615,941366807&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1000" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=808317043,911558675&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=967723385,2563996465&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1086" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=2777636240,3699060457&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1109" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=2731060646,3609875482&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=3197135656,4184515407&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1084" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=1577364197,2525632164&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1085" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=2865979413,4138188230&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1430" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=3040379321,586538598&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1085" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=366492549,1054282565&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1084" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=3116809257,1863643066&fm=253&fmt=auto&app=138&f=JPEG?w=231&h=500" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=789324612,3843744592&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1100" mode="aspectFill"></image>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import { selecCategoryPage, selecUserPage, login } from '../../api/api';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

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

// 挂载
onLoad(() => {
	// 获取专辑
	getAlbum();
	// 获取用户
	getUserList();
});
</script>

<style lang="scss">
.home {
	width: 100%;
	height: 100%;
	padding: 30rpx;
	padding-top: 210rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.home-background {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		filter: blur(40px);
		-webkit-backdrop-filter: blur(40rpx);
		background-image: url(https://img2.baidu.com/it/u=2681334238,2875512996&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=625);
		background-size: cover;
		background-position: center;
	}
	/* 轮播图 */
	.home-banner {
		position: relative;
		width: 100%;
		height: 358rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 1px 20px -6px #00000080;
		border: 1px solid #fff;
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
					padding: 20rpx;
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
				background-color: #e1dbd5;
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
				background-color: #e1dbd5;
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
					border: 1px solid #fff;
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
				background-color: #e1dbd5;
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
