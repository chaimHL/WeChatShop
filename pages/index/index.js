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
	async getSwiperList() {
		const res = await request({ url: '/home/swiperdata' })
		const swiperList = res.data.message.map(v => {
			v.navigator_url = v.navigator_url.replace(/main/g, 'index')
			return v
		})
		this.setData({
			swiperList
		})
	},
	// 获取导航数据
	getCatesList() {
		request({
			url: '/home/catitems'
		}).then(result => {
			this.setData({
				catesList: result.data.message
			})
		})
	},
	// 获取楼层数据
	async getFloorList() {
		const res = await request({ url: '/home/floordata'})
		const floorList = res.data.message.map(v => {
			v.product_list = v.product_list.map(x => {
				x.navigator_url = x.navigator_url.replace(/\?/g, '/index?')
				return x
			}) 
			return v
		})
		console.log(floorList)
		this.setData({
			floorList
		})
	}
})
