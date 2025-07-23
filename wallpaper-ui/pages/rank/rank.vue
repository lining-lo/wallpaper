<template>
	<view class="rank">
		<!-- 毛玻璃背景 -->
		<view class="sortlist-background"></view>
		<!-- 头部导航 -->
		<view class="sortlist-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>排行榜</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 榜单类型 -->
		<view class="rank-type">
			<view class="type-item selected">
				<text class="title">热门榜</text>
				<text class="english">Hot ranking</text>
			</view>
			<view class="type-item">
				<text class="title">点赞榜</text>
				<text class="english">Like ranking</text>
			</view>
			<view class="type-item">
				<text class="title">收藏榜</text>
				<text class="english">Rating ranking</text>
			</view>
		</view>
		<!-- 榜单列表 -->
		<view class="rank-list">
			<navigator url="/pages/preview/preview" class="list-item">
				<view class="number">No.1</view>
				<image src="https://img1.baidu.com/it/u=527057941,1875065910&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1409" mode="aspectFill"></image>
				<view class="progress">
					<progress percent="100" active active-mode="forwards" border-radius="8" activeColor="#ee6666" backgroundColor="#ebebeb" />
				</view>
				<view class="count">23</view>
			</navigator>
			<navigator url="/pages/preview/preview" class="list-item">
				<view class="number">No.2</view>
				<image src="https://img1.baidu.com/it/u=871510114,929433989&fm=253&fmt=auto?w=800&h=1123" mode="aspectFill"></image>
				<view class="progress">
					<progress percent="90" active active-mode="forwards" border-radius="8" activeColor="#fc8452" backgroundColor="#ebebeb" />
				</view>
				<view class="count">23</view>
			</navigator>
			<navigator url="/pages/preview/preview" class="list-item">
				<view class="number">No.3</view>
				<image src="https://img1.baidu.com/it/u=2720441681,1775581951&fm=253&fmt=auto?w=800&h=1200" mode="aspectFill"></image>
				<view class="progress">
					<progress percent="80" active active-mode="forwards" border-radius="8" activeColor="#fac858" backgroundColor="#ebebeb" />
				</view>
				<view class="count">23</view>
			</navigator>
			<navigator url="/pages/preview/preview" class="list-item">
				<view class="number">No.4</view>
				<image src="https://img2.baidu.com/it/u=550290641,1185847939&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=677" mode="aspectFill"></image>
				<view class="progress">
					<progress percent="60" active active-mode="forwards" border-radius="8" activeColor="#b1b5b3" backgroundColor="#ebebeb" />
				</view>
				<view class="count">23</view>
			</navigator>
			<navigator url="/pages/preview/preview" class="list-item">
				<view class="number">No.5</view>
				<image src="https://img1.baidu.com/it/u=2387884014,4283587875&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1426" mode="aspectFill"></image>
				<view class="progress">
					<progress percent="50" active active-mode="forwards" border-radius="8" activeColor="#b1b5b3" backgroundColor="#ebebeb" />
				</view>
				<view class="count">23</view>
			</navigator>
			<navigator url="/pages/preview/preview" class="list-item">
				<view class="number">No.6</view>
				<image src="https://img0.baidu.com/it/u=638471292,1538956271&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1160" mode="aspectFill"></image>
				<view class="progress">
					<progress percent="40" active active-mode="forwards" border-radius="8" activeColor="#b1b5b3" backgroundColor="#ebebeb" />
				</view>
				<view class="count">23</view>
			</navigator>
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
.rank {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.sortlist-background {
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
	/* 头部导航栏 */
	.sortlist-navbar {
		width: 100%;
		height: 180rpx;
		background-color: #353962;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	/* 榜单类型 */
	.rank-type {
		width: 100%;
		height: 120rpx;
		position: relative;
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
		.type-item {
			width: 31%;
			height: 100%;
			padding: 12rpx 0;
			background-color: #262a50;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			border-radius: 20rpx;
			box-shadow: 0 1px 20px -6px #00000080;
			&.selected {
				background-color: #2b25a5;
				.title,
				.english {
					color: #fff;
				}
			}
			.title {
				font-weight: 600;
				font-size: 20px;
				color: #cfc7c7;
			}
			.english {
				font-size: 12px;
				color: #cfc7c7;
			}
		}
	}
	/* 榜单列表 */
	.rank-list {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.list-item {
			width: 100%;
			height: 200rpx;
			background-color: rgb(114 114 130 / 50%);
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx;
			&:nth-child(1) {
				.number {
					color: #ee6666;
				}
			}
			&:nth-child(2) {
				.number {
					color: #fc8452;
				}
			}
			&:nth-child(3) {
				.number {
					color: #fac858;
				}
			}

			.number {
				font-size: 30rpx;
				font-weight: bold;
				width: 74rpx;
				margin-right: 10rpx;
				color: #b1b5b3;
			}

			image {
				height: 180rpx;
				width: 100rpx;
				border-radius: 12rpx;
				margin: 0 20rpx;
			}

			.progress {
				flex: 1;
				margin: 0 20rpx;
			}

			.count {
				width: 60rpx;
				text-align: right;
			}
		}
	}
}
</style>
