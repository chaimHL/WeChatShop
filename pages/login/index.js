// pages/login/index.js
Page({
	handleGetUserInfo(e) {
		// 获取用户信息并存入缓存
		const { userInfo } = e.detail
		wx.setStorageSync('userInfo', userInfo)
		// 返回上一个页面
		wx.navigateBack({
			delta: 1
		})
	}
})