import { request } from "../../request/index.js"
Page({
	data: {
		// 轮播图数组
		swiperList: [],
		// 导航数组
		catesList: [],
		// 楼层数组
		floorList: []
	},
	//事件处理函数
	onLoad: function() {
		this.getSwiperList()
		this.getCatesList()
		this.getFloorList()
	},
	// 获取轮播图数据
	getSwiperList() {
		request({
			url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'
		}).then(result => {
			this.setData({
				swiperList: result.data.message
			})
		})
	},
	// 获取导航数据
	getCatesList() {
		request({
			url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems'
		}).then(result => {
			this.setData({
				catesList: result.data.message
			})
		})
	},
	// 获取楼层数据
	getFloorList() {
		request({
			url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata'
		}).then(result => {
			this.setData({
				floorList: result.data.message
			})
		})
	}
})
