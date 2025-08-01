<template>
  <navbar />
  <view class="share">
    <!-- 瀑布流列表 -->
    <view class="waterfall-container">
      <!-- 循环渲染列表项 -->
      <navigator 
        url="/pages/shareList/shareList" 
        class="waterfall-item" 
        v-for="(item, index) in waterfallList" 
        :key="index"
      >
        <!-- 主图片（宽度固定，高度自适应） -->
        <image 
          :src="item.imgUrl" 
          mode="widthFix" 
          lazy-load 
          class="main-img"
        ></image>
        
        <!-- 标题（单行省略） -->
        <view class="item-title">{{ item.title }}</view>
        
        <!-- 底部信息（用户+点赞） -->
        <view class="item-footer">
          <view class="user-info">
            <image :src="item.avatar" mode="aspectFill" class="avatar"></image>
            <text class="username">{{ item.username }}</text>
          </view>
          <view class="like-info">
            <text class="like-icon">❤</text>
            <text class="like-count">{{ item.likeCount }}</text>
          </view>
        </view>
      </navigator>
    </view>
  </view>
</template>

<script setup>
import navbar from '../../components/navbar.vue';
import { ref } from 'vue';

// 瀑布流数据列表
const waterfallList = ref([
  {
    imgUrl: 'https://img2.baidu.com/it/u=3109327944,3353382792&fm=253&fmt=auto&app=120&f=JPEG?w=703&h=1216',
    avatar: 'https://img2.baidu.com/it/u=488878239,4127536549&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 12
  },
  {
    imgUrl: 'https://img0.baidu.com/it/u=802058814,788146649&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=711',
    avatar: 'https://img2.baidu.com/it/u=3043984113,2592949962&fm=253&fmt=auto?w=800&h=895',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 0
  },
  {
    imgUrl: 'https://img0.baidu.com/it/u=1054759078,279081371&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=707',
    avatar: 'https://img2.baidu.com/it/u=1733343479,3574365247&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 135
  },
  {
    imgUrl: 'https://img1.baidu.com/it/u=827314903,978560304&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=850',
    avatar: 'https://img0.baidu.com/it/u=3750182325,1283999780&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 88
  },
  {
    imgUrl: 'https://img2.baidu.com/it/u=424471230,304579767&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=760',
    avatar: 'https://img2.baidu.com/it/u=64493523,2922979769&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 55
  },
  {
    imgUrl: 'https://img2.baidu.com/it/u=1291127,1468535221&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=855',
    avatar: 'https://img1.baidu.com/it/u=3230409480,3195207981&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=645',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 14255
  },
  {
    imgUrl: 'https://img2.baidu.com/it/u=899210046,474850241&fm=253&fmt=auto?w=800&h=1130',
    avatar: 'https://img1.baidu.com/it/u=1591021256,1255870316&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 55
  },
  {
    imgUrl: 'https://img2.baidu.com/it/u=4148244255,1125607134&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=1322',
    avatar: 'https://img0.baidu.com/it/u=1398421535,2513760823&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 14
  },
  {
    imgUrl: 'https://img2.baidu.com/it/u=2608272535,2129312721&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    avatar: 'https://img0.baidu.com/it/u=1398421535,2513760823&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 14
  },
  {
    imgUrl: 'https://img2.baidu.com/it/u=3072419864,134434832&fm=253&fmt=auto&app=138&f=JPEG?w=1146&h=800',
    avatar: 'https://img0.baidu.com/it/u=1398421535,2513760823&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    title: '新作品已发布，快来看看吧!',
    username: '书法家噢',
    likeCount: 14
  }
]);
</script>

<style lang="scss">
.share {
  margin-top: 192rpx; /* 适配navbar高度 */
  width: 100%;
  min-height: 100vh;
  background-color: #262a50;
  padding: 10rpx;
  box-sizing: border-box; /* 防止padding导致宽度溢出 */
  overflow-x: hidden; /* 隐藏横向滚动条 */
}

/* 瀑布流容器：核心样式 */
.waterfall-container {
  column-count: 2; /* 固定2列 */
  column-gap: 10rpx; /* 列间距 */
}

/* 瀑布流子项 */
.waterfall-item {
  break-inside: avoid; /* 防止内容被分割 */
  -webkit-break-inside: avoid; /* 兼容小程序 */
  margin-bottom: 10rpx; /* 子项底部间距 */
  border-radius: 10rpx;
  background-color: #262a50;
  box-shadow: 0 1px 20px -6px rgba(0, 0, 0, 0.5);
  overflow: hidden; /* 裁剪超出圆角的内容 */
}

/* 主图片样式 */
.main-img {
  width: 100%;
  display: block; /* 消除图片底部默认间距 */
}

/* 标题样式 */
.item-title {
  font-size: 13px;
  color: #fff; /* 补充文字颜色，适配深色背景 */
  padding: 20rpx;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 底部信息区 */
.item-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx 20rpx; /* 仅底部和左右有padding */
  box-sizing: border-box;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: block; /* 消除图片默认间距 */
}

.username {
  color: #fff;
  font-size: 12px;
  margin-left: 8rpx;
}

/* 点赞信息 */
.like-info {
  display: flex;
  align-items: center;
}

.like-icon {
  color: #ff4d4f; /* 点赞图标红色 */
  font-size: 14px;
}

.like-count {
  color: #fff;
  font-size: 12px;
  margin-left: 8rpx;
}
</style>