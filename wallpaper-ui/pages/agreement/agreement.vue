<template>
	<view class="agreement">
		<!-- 头部导航 -->
		<view class="agreement-navbar">
			<uni-icons type="left" size="20" color="#fff" @click="goBack"></uni-icons>
			<text>用户协议</text>
			<view style="width: 20px"></view>
		</view>
		<!-- 协议内容 -->
		<view class="agreement-content">
			<view class="row" v-for="(item, index) in agreement" :key="index">
				<view class="label" @click="toggleItem(item)">
					<text>{{ item.title }}</text>
					<uni-icons 
						:type="item.isShow ? 'up' : 'down'" 
						size="20" 
						color="#fff"
						transition: transform 0.3s ease;
					></uni-icons>
				</view>
				<view 
					class="text" 
					:class="{ 'text-visible': item.isShow }"
				>
					<view class="text-content">{{ item.content }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};

// 切换显示状态并添加动画
const toggleItem = (item) => {
	item.isShow = !item.isShow;
};

// 协议内容
const agreement = ref([
	{
		title: '🎯 协议概述',
		content:
			'本协议是用户与lo的壁纸分享室平台（以下简称“平台”）之间关于使用平台提供服务的法律协议。用户在注册、登录、使用平台提供的任何服务之前，请务必认真阅读本协议。一旦用户点击 “注册” 或 “同意”按钮，或以其他方式选择接受本协议，即表示用户已充分理解并接受本协议的全部内容。',
		isShow: true
	},
	{
		title: '🎯 用户账号',
		content:
			'用户应保证在注册时提供的信息真实、准确、完整，并承诺在使用平台服务过程中及时更新相关信息。 用户账号仅限本人使用，不得转让、赠与、借用、租用或售卖。用户应妥善保管账号信息及密码，因用户自身原因导致的账号信息泄露或密码遗失，由用户自行承担责任。',
		isShow: true
	},
	{
		title: '🎯 服务内容',
		content: '平台提供免费壁纸下载，仅可用于个人使用或学习交流用途，不可用于商业用途，用户商用出现侵权问题有客户承担。具体信息以平台发布的信息为准。',
		isShow: true
	},
	{
		title: '🎯 用户权利和义务',
		content: '用户有权根据平台提供的各类壁纸图库，自主选择所需进行下载。用户应遵守国家法律法规、社会公德和平台规则，不得利用平台从事违法、违规或损害他人利益的活动。',
		isShow: true
	},
	{
		title: '🎯 平台权利和义务',
		content: '平台有权根据法律法规、政策变化或业务需要，修改本协议或平台规则。修改后的协议或规则将通过平台公告或其他方式通知用户，用户应在规定时间内确认接受，否则视为用户放弃使用平台服务。平台有权对用户使用平台服务的行为进行监督和管理，对于违反本协议或平台规则的用户，平台有权采取限制服务、暂停服务、终止服务等措施。',
		isShow: true
	},
	{
		title: '🎯 隐私保护',
		content: '平台将严格遵守国家法律法规，采取合理的技术和管理措施，保障用户个人信息安全。在未经用户同意的情况下，平台不会向任何第三方披露、泄露或出售用户的个人信息。',
		isShow: true
	},
	{
		title: '🎯 免责条款',
		content: '平台仅是壁纸图库发布方，用于个人学习交流使用，对于因用户自身原因导致的侵犯原作者的权益，不承担任何责任。平台对于因不可抗力因素（如自然灾害、政策变化等）导致的服务中断、延迟或失败，不承担任何责任。',
		isShow: true
	},
	{
		title: '🎯 争议解决',
		content: '如用户与平台之间发生争议，应首先通过友好协商解决；协商不成的，任何一方均有权向平台所在地人民法院提起诉讼。',
		isShow: true
	},
	{
		title: '🎯 其他',
		content: '本协议自用户接受之日起生效，并持续有效至用户注销账号或平台终止服务时止。本协议的解释权归平台所有。如有任何疑问或建议，请通过平台提供的联系方式与平台联系。',
		isShow: true
	},
]);
</script>

<style lang="scss">
.agreement {
	width: 100%;
	min-height: 100vh;
	padding: 30rpx;
	padding-top: 200rpx;
	position: relative;
	background-color: #141414;
	overflow: auto;
	
	/* 头部导航栏 */
	.agreement-navbar {
		width: 100%;
		height: 180rpx;
		background-color: #141414;
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	
	/* 协议内容 */
	.agreement-content {
		width: 100%;
		
		.row {
			width: 100%;
			
			.label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 18px;
				margin-bottom: 20rpx;
				background-color: #212121;
				padding: 10rpx 20rpx;
				border-radius: 12rpx;
				color: #fff;
				cursor: pointer;
				
				uni-icons {
					transition: transform 0.3s ease;
				}
			}
			
			.text {
				/* 基础样式 */
				color: #848485;
				line-height: 1.5;
				letter-spacing: 2px;
				font-size: 17px;
				background-color: #252424;
				border-radius: 10rpx;
				
				/* 过渡动画属性 */
				transition: all 0.3s ease-out;
				
				/* 默认隐藏状态 */
				max-height: 0;
				opacity: 0;
				overflow: hidden;
				padding: 0 30rpx;
				
				.text-content {
					padding: 30rpx 0;
					color: #848485;
				}
			}
			
			/* 显示状态 */
			.text-visible {
				margin-bottom: 60rpx;
				max-height: 1000px; /* 足够大的值容纳内容 */
				opacity: 1;
				padding: 0 30rpx;
			}
		}
	}
}
</style>
