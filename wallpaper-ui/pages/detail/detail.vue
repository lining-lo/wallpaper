<template>
	<view class="detail">
		<!-- 毛玻璃背景 -->
		<view class="detail-background"></view>
		<!-- 头部导航 -->
		<view class="detail-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>图片详情</text>
			<view style="width: 100rpx"></view>
		</view>
		<!-- 图片展示区 -->
		<view class="detail-image">
			<swiper circular>
				<swiper-item>
					<image class="image-img" src="https://img1.baidu.com/it/u=1869187227,4137243093&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=926" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 详情内容 -->
		<view class="detail-content">
			<view class="content-title">基尼太美，基尼实在是太美</view>
			<view class="content-desc">
				2018 年，蔡徐坤参加《偶像练习生》 ，其自我介绍视频中，背景音乐《只因你太美》的歌词 “只因你太美” 发音听起来像 “基尼太美”
				，被网友玩梗传播。同时，他在节目中表演的唱跳片段，其中打篮球等动作也被大量二创、恶搞，在网络上广泛流传，成为网络热门话题
			</view>
			<view class="content-time">2025-7-11 18:20</view>
		</view>
		<!-- 评论区 -->
		<view class="detail-comment">
			<view class="comment-count">共 46 条评论</view>
			<view class="comment-list">
				<view class="list-item">
					<view class="item-left">
						<image src="https://img0.baidu.com/it/u=2317612037,2363737113&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
					</view>
					<view class="item-right">
						<view class="right-info">
							<view class="info-name">
								<view class="name">玉山</view>
								<view class="time">2025-7-11 18:20</view>
							</view>
							<view class="info-like">
								<view class="like">
									<uni-icons type="heart-filled" color="#fff"></uni-icons>
									<text style="margin-left: 4px">2</text>
								</view>
							</view>
						</view>
						<view class="right-content">
							<text style="color: aqua">@坤坤：</text>
							<text>哦baby,基尼太美！</text>
						</view>
					</view>
				</view>
				<view class="list-item">
					<view class="item-left">
						<image src="https://img0.baidu.com/it/u=2317612037,2363737113&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
					</view>
					<view class="item-right">
						<view class="right-info">
							<view class="info-name">
								<view class="name">玉山</view>
								<view class="time">2025-7-11 18:20</view>
							</view>
							<view class="info-like">
								<view class="like">
									<uni-icons type="heart-filled" color="#fff"></uni-icons>
									<text style="margin-left: 4px">2</text>
								</view>
							</view>
						</view>
						<view class="right-content">
							<text style="color: aqua">@坤坤：</text>
							<text>哦baby,基尼太美！</text>
						</view>
					</view>
				</view>
				<view class="list-item">
					<view class="item-left">
						<image src="https://img0.baidu.com/it/u=2317612037,2363737113&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
					</view>
					<view class="item-right">
						<view class="right-info">
							<view class="info-name">
								<view class="name">玉山</view>
								<view class="time">2025-7-11 18:20</view>
							</view>
							<view class="info-like">
								<view class="like">
									<uni-icons type="heart-filled" color="#fff"></uni-icons>
									<text style="margin-left: 4px">2</text>
								</view>
							</view>
						</view>
						<view class="right-content">
							<text style="color: aqua">@坤坤：</text>
							<text>哦baby,基尼太美！</text>
						</view>
					</view>
				</view>
				<view class="list-item">
					<view class="item-left">
						<image src="https://img0.baidu.com/it/u=2317612037,2363737113&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
					</view>
					<view class="item-right">
						<view class="right-info">
							<view class="info-name">
								<view class="name">玉山</view>
								<view class="time">2025-7-11 18:20</view>
							</view>
							<view class="info-like">
								<view class="like">
									<uni-icons type="heart-filled" color="#fff"></uni-icons>
									<text style="margin-left: 4px">2</text>
								</view>
							</view>
						</view>
						<view class="right-content">
							<text style="color: aqua">@坤坤：</text>
							<text>哦baby,基尼太美！</text>
						</view>
					</view>
				</view>
				<view class="list-item">
					<view class="item-left">
						<image src="https://img0.baidu.com/it/u=2317612037,2363737113&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
					</view>
					<view class="item-right">
						<view class="right-info">
							<view class="info-name">
								<view class="name">玉山</view>
								<view class="time">2025-7-11 18:20</view>
							</view>
							<view class="info-like">
								<view class="like">
									<uni-icons type="heart-filled" color="#fff"></uni-icons>
									<text style="margin-left: 4px">2</text>
								</view>
							</view>
						</view>
						<view class="right-content">
							<text style="color: aqua">@坤坤：</text>
							<text>哦baby,基尼太美！</text>
						</view>
					</view>
				</view>
				<view class="list-item">
					<view class="item-left">
						<image src="https://img0.baidu.com/it/u=2317612037,2363737113&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
					</view>
					<view class="item-right">
						<view class="right-info">
							<view class="info-name">
								<view class="name">玉山</view>
								<view class="time">2025-7-11 18:20</view>
							</view>
							<view class="info-like">
								<view class="like">
									<uni-icons type="heart-filled" color="#fff"></uni-icons>
									<text style="margin-left: 4px">2</text>
								</view>
							</view>
						</view>
						<view class="right-content">
							<text style="color: aqua">@坤坤：</text>
							<text>哦baby,基尼太美！</text>
						</view>
					</view>
				</view>
				<view class="list-item">
					<view class="item-left">
						<image src="https://img0.baidu.com/it/u=2317612037,2363737113&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500" mode="aspectFill"></image>
					</view>
					<view class="item-right">
						<view class="right-info">
							<view class="info-name">
								<view class="name">玉山</view>
								<view class="time">2025-7-11 18:20</view>
							</view>
							<view class="info-like">
								<view class="like">
									<uni-icons type="heart-filled" color="#fff"></uni-icons>
									<text style="margin-left: 4px">2</text>
								</view>
							</view>
						</view>
						<view class="right-content">
							<text style="color: aqua">@坤坤：</text>
							<text>哦baby,基尼太美！</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部遮罩层 -->
		<view class="detail-footer">
			<input type="text" placeholder="说点什么..." />
			<view class="footer-feedback">
				<view class="feedback-favorites btn">
					<uni-icons type="star-filled" color="#fff" size="28"></uni-icons>
					<text style="margin-left: 2px">1343</text>
				</view>
				<view class="feedback-like btn">
					<uni-icons type="heart-filled" color="#fff" size="26"></uni-icons>
					<text style="margin-left: 2px">3243</text>
				</view>
				<view class="feedback-message btn">
					<uni-icons type="chat-filled" color="#fff" size="26"></uni-icons>
					<text style="margin-left: 2px">4343</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import { ref } from 'vue';

// 显示|隐藏时间
const isShow = ref(true);
// 切换显示|隐藏时间的方法
const changeShow = () => {
	isShow.value = !isShow.value;
};

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss">
.detail {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 毛玻璃背景 */
	.detail-background {
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
	.detail-navbar {
		width: 100%;
		height: 180rpx;
		// background-color: #353962;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	/* 图片展示区 */
	.detail-image {
		position: relative;
		margin: 0 auto;
		width: 100%;
		height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
		swiper {
			width: 100%;
			height: 100%;
			position: absolute;
			swiper-item {
				width: 100%;
				height: 100%;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	/* 详细内容 */
	.detail-content {
		position: relative;
		padding: 60rpx 30rpx;
		.content-title {
			margin-bottom: 20rpx;
			font-weight: 600;
		}
		.content-desc {
			margin-bottom: 20rpx;
		}
		.content-time {
			padding-bottom: 30rpx;
			font-size: 12px;
			color: #9e9e9e;
			border-bottom: 1px dashed #fff;
		}
	}
	/* 底部遮罩层 */
	.detail-footer {
		width: 100%;
		height: 84px;
		padding: 0 30rpx;
		padding-bottom: 50rpx;
		background-color: #353962;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		input {
			width: 25%;
			background-color: rgba(255, 255, 255, 0.1);
			padding: 14rpx 30rpx;
			border-radius: 50rpx;
			margin-right: 8px;
		}
		.footer-feedback {
			width: 75%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.btn {
				display: flex;
				align-items: center;
				font-size: 14px;
			}
		}
	}
	/* 评论区 */
	.detail-comment {
		position: relative;
		width: 100%;
		padding: 0 30rpx;
		.comment-title {
			width: 100%;
			font-weight: 600;
			margin-bottom: 20rpx;
		}
		.comment-list {
			width: 100%;
			margin: 40rpx 0 120px 0;

			.list-item {
				width: 100%;
				display: flex;
				margin-bottom: 40rpx;
				.item-left {
					width: 40px;
					height: 40px;
					margin-right: 10px;
					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						border: 2px solid #fff;
					}
				}
				.item-right {
					width: calc(100% - 50px);
					padding: 0 10rpx;
					.right-info {
						width: 100%;
						display: flex;
						justify-content: space-between;
						margin-bottom: 12rpx;
						.info-name {
							display: flex;
							flex-direction: column;
							.name {
								color: blueviolet;
								margin-bottom: 6rpx;
							}
							.time {
								font-size: 12px;
								color: #9e9e9e;
							}
						}
						.info-like {
							display: flex;
							font-size: 13px;
						}
					}
				}
			}
		}
	}
}
</style>
