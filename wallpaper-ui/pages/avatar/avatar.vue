<template>
	<view class="avatar">
		<!-- 毛玻璃背景 -->
		<view class="avatar-background"></view>
		<!-- 头部导航 -->
		<view class="avatar-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>头像</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 头像列表 -->
		<view class="avatar-list">
			<view class="list-item">
				<image src="https://img2.baidu.com/it/u=3876545315,3121605196&fm=253&fmt=auto&app=138&f=JPEG?w=380&h=358" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img1.baidu.com/it/u=4087345783,908287826&fm=253&fmt=auto&app=138&f=JPEG?w=380&h=426" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=2443685452,931201615&fm=253&fmt=auto&app=138&f=JPEG?w=285&h=285" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=621075495,1071335623&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=621075495,1071335623&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=1290872624,1387101814&fm=253&fmt=auto&app=138&f=JPEG?w=285&h=285" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img2.baidu.com/it/u=135596327,555979949&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=3750182325,1283999780&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=3750182325,1283999780&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img1.baidu.com/it/u=1827515073,4159709519&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=1406705969,2667912439&fm=253&fmt=auto?w=800&h=841" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img2.baidu.com/it/u=2017279352,1833764662&fm=253&fmt=auto&app=138&f=JPEG?w=285&h=285" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img2.baidu.com/it/u=2646719074,1648894215&fm=253&fmt=auto&app=138&f=JPEG?w=285&h=285" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=2700391053,473711727&fm=253&fmt=auto&app=138&f=JPEG?w=285&h=285" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img0.baidu.com/it/u=1441294210,3901210582&fm=253&fmt=auto&app=138&f=JPEG?w=380&h=380" mode="aspectFill"></image>
			</view>
			<view class="list-item">
				<image src="https://img1.baidu.com/it/u=3753595470,3950029239&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=523" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup></script>

<style lang="scss">
.avatar {
	width: 100%;
	min-height: 100vh;
	padding: 20rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.avatar-background {
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
	.avatar-navbar {
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
	/* 头像列表 */
	.avatar-list{
		position: relative;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		.list-item{
			width: calc(33% - 10rpx);
			height: 226rpx;
			border: 1px solid #fff;
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
