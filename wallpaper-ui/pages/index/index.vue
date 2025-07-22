<template>
	<navbar />
	<view class="home">
		<!-- 毛玻璃背景 -->
		<view class="home-background"></view>
		<!-- 轮播图 -->
		<view class="home-banner">
			<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay>
				<swiper-item>
					<image src="/static/images/banner1.jpg" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item>
					<image src="/static/images/banner2.jpg" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item>
					<image src="/static/images/banner3.jpg" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item>
					<image src="/static/images/banner4.jpg" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item>
					<image src="/static/images/banner5.jpg" mode="aspectFill"></image>
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
				<image src="https://img2.baidu.com/it/u=93036002,4253821634&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
				<image src="https://img2.baidu.com/it/u=3177417376,516182796&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800" mode="aspectFill"></image>
				<image src="https://img2.baidu.com/it/u=2201786265,1996910509&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
				<image src="https://img2.baidu.com/it/u=3928639842,338040314&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800" mode="aspectFill"></image>
				<image src="https://img1.baidu.com/it/u=4105985255,4254704125&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 热门专辑 -->
		<view class="home-album">
			<view class="album-title">
				<view class="title">热门专辑</view>
				<view class="more">More+</view>
			</view>
			<view class="album-list">
				<scroll-view scroll-x>
					<view class="list-item">
						<image src="https://img2.baidu.com/it/u=1882468436,1746783708&fm=253&fmt=auto&app=138&f=JPEG?w=791&h=500" mode="aspectFill"></image>
						<view class="item-info">
							<view class="info-title">
								<text class="name">性感迷人大幂幂</text>
								<text class="count">12</text>
							</view>
							<view class="info-like">
								<text>208人喜欢</text>
							</view>
						</view>
					</view>
					<view class="list-item">
						<image src="https://img0.baidu.com/it/u=1639506431,2987721590&fm=253&fmt=auto&app=138&f=JPG?w=889&h=500" mode="aspectFill"></image>
						<view class="item-info">
							<view class="info-title">
								<text class="name">性感迷人大幂幂</text>
								<text class="count">12</text>
							</view>
							<view class="info-like">
								<text>208人喜欢</text>
							</view>
						</view>
					</view>
					<view class="list-item">
						<image src="https://img2.baidu.com/it/u=3561441785,2160995199&fm=253&fmt=auto&app=138&f=JPEG?w=754&h=500" mode="aspectFill"></image>
						<view class="item-info">
							<view class="info-title">
								<text class="name">性感迷人大幂幂</text>
								<text class="count">12</text>
							</view>
							<view class="info-like">
								<text>208人喜欢</text>
							</view>
						</view>
					</view>
					<view class="list-item">
						<image src="https://img1.baidu.com/it/u=3556096279,1315899449&fm=253&fmt=auto&app=138&f=JPEG?w=781&h=500" mode="aspectFill"></image>
						<view class="item-info">
							<view class="info-title">
								<text class="name">性感迷人大幂幂</text>
								<text class="count">12</text>
							</view>
							<view class="info-like">
								<text>208人喜欢</text>
							</view>
						</view>
					</view>
					<view class="list-item">
						<image src="https://img2.baidu.com/it/u=14263107,2364659265&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500" mode="aspectFill"></image>
						<view class="item-info">
							<view class="item-info">
								<view class="info-title">
									<text class="name">性感迷人大幂幂</text>
									<text class="count">12</text>
								</view>
								<view class="info-like">
									<text>208人喜欢</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
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
					<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=1724237667,1967106694&fm=253&fmt=auto&app=138&f=JPEG?w=353&h=499" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img0.baidu.com/it/u=1121191004,2820831222&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=961" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=757855534,1430352529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=851" mode="aspectFill"></image>
				</navigator>
				<navigator url="/pages/preview/preview" class="list-item">
					<image src="https://img1.baidu.com/it/u=2212222371,326919401&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script setup>
	import navbar from '../../components/navbar.vue';
	
</script>

<style lang="scss">
.home {
	margin-top: 192rpx;
	width: 100%;
	height: 100%;
	padding: 30rpx;
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
		width: 100%;
		height: 300rpx;
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
			width: 100%;
			height: 100%;
			swiper-item {
				width: 100%;
				height: 100%;
				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
					border: 1px solid #fff;
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
			image {
				width: 15vw;
				height: 15vw;
				border-radius: 50%;
				border: 2px solid #fff;
			}
		}
	}
	/* 热门专辑 */
	.home-album {
		width: 100%;
		margin: 60rpx 0;
		.album-title {
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
		.album-list {
			height: 32vw;
			scroll-view {
				height: 100%;
				white-space: nowrap;
				height: 100%;
				.list-item {
					width: 64vw;
					height: 100%;
					margin-right: 30rpx;
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
			height: 42vw;
			scroll-view {
				height: 100%;
				white-space: nowrap;
				height: 100%;
				.list-item {
					width: 26vw;
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
				height: 46vw;
				margin-right: 20rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				border: 1px solid #fff;
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
