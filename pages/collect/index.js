// pages/collect/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [{
				id: 0,
				value: '商品',
				isActive: true
			},
			{
				id: 1,
				value: '品牌',
				isActive: false
			},
			{
				id: 2,
				value: '店铺',
				isActive: false
			},
			{
				id: 3,
				value: '足迹',
				isActive: false
			}
		],
		collect: []
	},
	
	onShow() {
		const collect = wx.getStorageSync('collect')
		this.setData({
			collect
		})
	},
	
	// 标题点击事件（子传父）
	handleTabsItemChange(e) {
		const { index } = e.detail
		const { tabs } = this.data
		tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
		this.setData({
			tabs
		})
	},
})
