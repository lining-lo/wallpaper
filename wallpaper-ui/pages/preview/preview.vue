<template>
	<view class="preview" @click="changeShow">
		<!-- 返回按钮 -->
		<view class="preview-back" @click="goBack">
			<uni-icons type="left" size="20" color="#fff"></uni-icons>
		</view>
		<!-- 图片轮播图 -->
		<swiper circular @change="changeWallpaper" :current="currentWallpaperIndex">
			<swiper-item v-for="(item, index) in wallpapers" :key="index">
				<image v-if="readWallpaperIndexList.includes(index)" :src="item.url" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!-- 当前图片信息 -->
		<view class="preview-info" v-if="isShow">
			<view class="info-current">
				<text v-if="wallpapers">预览图 {{ currentWallpaperIndex + 1 }}/{{ wallpapers.length }}</text>
			</view>
			<view class="info-user">
				<view class="inner">
					<text>{{ currentWallpaper.user_name }}</text>
					<image :src="currentWallpaper.user_avatar" mode="aspectFill"></image>
				</view>
			</view>
			<view class="info-time">
				<text class="time">18:23</text>
				<text class="date">7月20日</text>
			</view>
		</view>
		<!-- 底部功能按钮 -->
		<view class="preview-bottom" v-if="isShow" @click.stop="">
			<view class="bottom-detail btn" @click="changePopup(1)">
				<uni-icons type="info-filled" color="#fff" size="22"></uni-icons>
				<text>详情</text>
			</view>
			<view class="bottom-favorites btn">
				<uni-icons type="star-filled" color="#fff" size="24"></uni-icons>
				<text>{{currentWallpaper.collect_count}}</text>
			</view>
			<view class="bottom-like btn">
				<uni-icons type="heart-filled" color="#fff" size="22"></uni-icons>
				<text>{{currentWallpaper.like_count}}</text>
			</view>
			<view class="bottom-download btn">
				<uni-icons type="download-filled" color="#fff" size="22"></uni-icons>
				<text>{{currentWallpaper.download_count}}</text>
			</view>
		</view>
		<!-- 详情弹窗 -->
		<uni-popup type="bottom" ref="popupInfo" :safe-area="false" borderRadius="20rpx 20rpx 0 0" background-color="#353962">
			<view class="inner" @click.stop="">
				<view class="popup-title">
					<view class="fill"></view>
					<view class="title">壁纸信息</view>
					<uni-icons @click="changePopup(0)" type="closeempty" color="#fff" size="18"></uni-icons>
				</view>
				<scroll-view scroll-y>
					<view class="content">
						<view class="row">
							<view class="label">壁纸ID：</view>
							<text selectable class="value">{{ currentWallpaper.id }}</text>
						</view>
						<view class="row">
							<view class="label">分类：</view>
							<text selectable class="value">{{ currentWallpaper.category_name }}</text>
						</view>
						<view class="row">
							<view class="label">发布者：</view>
							<text selectable class="value">{{ currentWallpaper.user_name }}</text>
						</view>
						<view class="row">
							<view class="label">摘要：</view>
							<text selectable class="value">{{ currentWallpaper.description }}</text>
						</view>
						<view class="row">
							<view class="label">标签：</view>
							<view selectable class="value tags">
								<text class="tag" v-for="(label, index2) in currentWallpaper.labels" :key="index2">{{ label }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<view class="content">
						声明：本图片来自用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸 ID 到邮箱 2092576148@qq.com，管理将删除侵权壁纸，维护您的权益。
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref } from 'vue';

// 详情弹窗dom
const popupInfo = ref();
// 打开|关闭弹窗(0关闭，1打开)
const changePopup = (option) => {
	if (option === 1) {
		popupInfo.value.open();
	} else {
		popupInfo.value.close();
	}
};
// 显示|隐藏图片以外的信息
const isShow = ref(true);
// 切换信息状态
const changeShow = () => {
	isShow.value = !isShow.value;
};
// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 壁纸列表
const wallpapers = ref([]);
// 当前壁纸id
const currentWallpaperId = ref();
// 当前壁纸的索引
const currentWallpaperIndex = ref();
// 当前的壁纸信息
const currentWallpaper = ref({});
// 看过的壁纸索引
const readWallpaperIndexList = ref([]);
// 挂载
onLoad((options) => {
	// 获取封面信息
	wallpapers.value = JSON.parse(uni.getStorageSync('wallpapers'));
	// 获取当前壁纸id
	currentWallpaperId.value = options.id;
	// 获取当前的索引
	currentWallpaperIndex.value = Number(options.index);
	// 获取当前壁纸信息
	currentWallpaper.value = wallpapers.value[currentWallpaperIndex.value];

	// 提取缓存三张图
	readWallpaperIndexList.value.push(
		currentWallpaperIndex.value <= 0 ? wallpapers.value.length - 1 : currentWallpaperIndex.value - 1,
		currentWallpaperIndex.value,
		currentWallpaperIndex.value >= wallpapers.value.length - 1 ? 0 : currentWallpaperIndex.value + 1
	);
	// 数组去重
	readWallpaperIndexList.value = [...new Set(readWallpaperIndexList.value)];
});
// 更换壁纸的方法
const changeWallpaper = (event) => {
	const currentIndex = event.detail.current;
	currentWallpaperIndex.value = currentIndex;
	currentWallpaper.value = wallpapers.value[currentIndex];
	readWallpaperIndexList.value.push(currentIndex);
	console.log(currentWallpaper.value);

	// 提取缓存三张图
	readWallpaperIndexList.value.push(
		currentWallpaperIndex.value <= 0 ? wallpapers.value.length - 1 : currentWallpaperIndex.value - 1,
		currentWallpaperIndex.value,
		currentWallpaperIndex.value >= wallpapers.value.length - 1 ? 0 : currentWallpaperIndex.value + 1
	);
	// 数组去重
	readWallpaperIndexList.value = [...new Set(readWallpaperIndexList.value)];
};

// 点赞|收藏|下载的参数
const feedbackParams = reactive({
	
})
// 点赞|收藏|下载的方法
const addFeedback = ()=>{
	
}

</script>

<style lang="scss">
.preview {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: #2c333e;
	overflow: auto;
	/* 返回按钮 */
	.preview-back {
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
	swiper {
		position: relative;
		width: 100%;
		height: 100vh;
		swiper-item {
			width: 100%;
			height: 100%;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	/* 当前图片信息 */
	.preview-info {
		position: absolute;
		top: 120rpx;
		width: 100%;
		height: 54vw;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.info-current {
			width: 100%;
			text-align: center;
			text {
				padding: 8rpx 40rpx;
				background-color: rgba(40, 40, 40, 0.6);
				border-radius: 30rpx;
				font-size: 13px;
			}
		}
		.info-user {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			padding-right: 20rpx;
			.inner {
				display: flex;
				align-items: center;
				gap: 20rpx;
				padding: 2px 4px 2px 20px;
				background-color: rgba(40, 40, 40, 0.5);
				border-radius: 50rpx;
				text {
					font-size: 16px;
					color: #fff;
				}
				image {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					border: 2px solid #fff;
				}
			}
		}
		.info-time {
			width: 100%;
			text-align: center;
			display: flex;
			flex-direction: column;
			.time {
				font-size: 46px;
				font-weight: 600;
				letter-spacing: 0.2em;
				margin-bottom: 8px;
			}
			.date {
				font-size: 24px;
				font-weight: 400;
				letter-spacing: 0.2em;
			}
		}
	}
	/* 底部功能按钮 */
	.preview-bottom {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		bottom: 50px;
		width: 80%;
		height: 16vw;
		border-radius: 100rpx;
		background-color: rgba(40, 40, 40, 0.8);
		display: flex;
		justify-content: space-around;
		align-items: center;
		.btn {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			padding: 0 14rpx;
		}
	}
	/* 详情弹窗 */
	uni-popup {
		width: 100%;
		.inner {
			.popup-title {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 40rpx 30rpx;
			}
			scroll-view {
				width: 100%;
				max-height: 60vh;
				padding: 0 60rpx 20rpx 60rpx;
				.content {
					.row {
						display: flex;
						padding: 16rpx 0;
						font-size: 32rpx;
						line-height: 1.7rem;
						.label {
							color: #9c9c9c;
							width: 140rpx;
							text-align: right;
							font-size: 30rpx;
						}
						.value {
							width: calc(100% - 240rpx);
							padding: 0 20rpx;
						}
						.tags {
							display: flex;
							flex-wrap: wrap;
							.tag {
								border: 1px solid #fff;
								font-size: 22rpx;
								padding: 10rpx 30rpx;
								border-radius: 40rpx;
								line-height: 1em;
								margin: 0 10rpx 10rpx 0;
							}
						}
					}
				}
			}
			.popup-footer {
				width: 100%;
				padding: 0 20rpx 80rpx 20rpx;
				.content {
					padding: 30rpx;
					background-color: rgba(40, 40, 40, 0.3);
					border-radius: 10rpx;
					line-height: 1.64;
				}
			}
		}
	}
}
</style>
