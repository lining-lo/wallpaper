<template>
	<view class="sharelist">
		<!-- 返回按钮 -->
		<view class="sharelist-back" @click="goBack">
			<uni-icons type="left" size="20" color="#fff"></uni-icons>
		</view>
		<!-- 轮播图 -->
		<view class="sharelist-swaper">
			<view class="currenindx">
				<text>1 / 20</text>
			</view>
			<swiper circular previous-margin="72px" next-margin="72px">
				<swiper-item>
					<image class="portrait" src="https://img1.baidu.com/it/u=3765353395,1092554471&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item>
					<image class="portrait" src="https://img2.baidu.com/it/u=2980862483,1088512996&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item>
					<image class="tablet" src="https://img2.baidu.com/it/u=966907837,2012839154&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item>
					<image class="portrait" src="https://img2.baidu.com/it/u=3407948447,3859345119&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1035" mode="aspectFill"></image>
				</swiper-item>
				<swiper-item>
					<image class="avatar" src="https://img0.baidu.com/it/u=3196617431,1263013381&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 壁纸信息 -->
		<view class="sharelist-info">
			<view class="info-labels">
				<view style="color: #109be8; border-color: #109be8" class="label">插画</view>
				<view style="color: #9d4d64; border-color: #9d4d64" class="label">动物</view>
				<view style="color: #af8933; border-color: #af8933" class="label">猫</view>
				<view style="color: #8b8bef; border-color: #8b8bef" class="label">可爱宠物</view>
			</view>
			<view class="info-base">
				<view class="base-avatar base">
					<image src="https://img0.baidu.com/it/u=371221907,2677121710&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
					<text>阿木木</text>
				</view>
				<view class="base-avatar base">
					<uni-icons type="cloud-download" size="30" color="#109be8"></uni-icons>
					<text>下载：2651</text>
				</view>
				<view class="base-avatar base">
					<uni-icons type="hand-up" size="30" color="#9d4d64"></uni-icons>
					<text>点赞：152</text>
				</view>
				<view class="base-avatar base">
					<uni-icons type="heart" size="30" color="#af8933"></uni-icons>
					<text>收藏：66</text>
				</view>
			</view>
		</view>
		<!-- 相关推荐 -->
		<view class="sharelist-recommend">
			<view class="recommend-title">相关推荐</view>
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
// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss">
.sharelist {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 返回按钮 */
	.sharelist-back {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(40, 40, 40, 0.8);
		position: fixed;
		z-index: 1;
		top: 92rpx;
		left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* 轮播图 */
	.sharelist-swaper {
		width: 100%;
		height: 820rpx;
		margin-top: 100rpx;
		position: relative;
		.currenindx {
			position: absolute;
			top: 20rpx;
			z-index: 1;
			width: 100%;
			text-align: center;
			text {
				padding: 8rpx 40rpx;
				background-color: rgba(40, 40, 40, 0.6);
				border-radius: 30rpx;
				font-size: 13px;
			}
		}
		swiper {
			width: 100%;
			height: 100%;
			swiper-item {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				padding: 0 10rpx;
				.portrait {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
				.avatar {
					width: 100%;
					height: 455rpx;
					border-radius: 20rpx;
				}
				.tablet {
					width: 100%;
					height: 300rpx;
					border-radius: 20rpx;
				}
			}
		}
	}
	/* 壁纸信息 */
	.sharelist-info {
		width: 100%;
		padding: 60rpx 30rpx;
		.info-labels {
			width: 100%;
			display: flex;
			margin-bottom: 30rpx;
			.label {
				padding: 4rpx 30rpx;
				border-radius: 20rpx;
				border: 1px solid #fff;
				margin-right: 20rpx;
			}
		}
		.info-base {
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.base {
				width: calc(50% - 15rpx);
				height: 108rpx;
				border-radius: 12rpx;
				background-color: #222222;
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;
				padding: 0 20rpx;
				&.base-avatar {
					display: flex;
					align-items: center;
					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
					text {
						margin-left: 12rpx;
					}
				}
			}
		}
	}
	/* 相关推荐 */
	.sharelist-recommend {
		padding:0 30rpx;
		width: 100%;
		.recommend-title {
			font-size: 20px;
			font-weight: 700;
			padding-bottom: 36rpx;
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
