// pages/user/index.js
Page({
	data: {
		userInfo: {},
		// 收藏商品数量
		collectNums: 0
	},
	onShow() {
		const userInfo = wx.getStorageSync('userInfo')
		// 获取商品收藏数组
		const collect = wx.getStorageSync('collect') || []
		this.setData({
			userInfo,
			collectNums: collect.length
		})
	}
})
