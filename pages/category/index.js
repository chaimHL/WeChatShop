import { request } from "../../request/index.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 左侧的菜单数据
		leftMenuList: [],
		// 右侧的商品数据
		rightContent: [],
		// 左侧激活菜单项
		currentIndex: 0,
		// 右侧商品滚动条距离顶部高度
		scrollTop: 0
	},
	// 设置一个全局变量, 用于存放接口返回数据
	cates: [],
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		// 先判断本地存储是否有未过期的旧数据,没有才发送请求
		// 获取本地存储
		const Cates = wx.getStorageSync("cates")
		// 判断有没有本地存储
		if(!Cates){
			this.getCates()
		}else{
			// 判断本地存储有没有过期, 假设过期时间5分钟
			if(Date.now() - Cates.time > 1000*60*5){
				this.getCates()
			}else{
				this.cates = Cates.data
				let leftMenuList = this.cates.map(v => v.cat_name)
				let rightContent = this.cates[0].children
				this.setData({
					leftMenuList,
					rightContent
				})
			}
		}
	},
	// 获取分类数据
	async getCates() {
		const result = await request({ url: '/categories' })
		this.cates = result.data.message
		// 把接口返回的数据存储到本地存储
		wx.setStorageSync("cates", { time: Date.now(), data: this.cates })
		// 构造左侧菜单数据
		let leftMenuList = this.cates.map(v => v.cat_name)
		this.setData({
			leftMenuList
		})
		// 构造右侧菜单数据
		let rightContent = this.cates[0].children
		this.setData({
			rightContent
		})
	},
	// 左侧菜单的点击事件
	handleItemTap(e) {
		const { index } = e.currentTarget.dataset 
		// 构造右侧菜单数据
		let rightContent = this.cates[index].children
		this.setData({
			currentIndex: index,
			rightContent,
			// 重新设置右侧内容scroll-view的滚动条距离顶部的高度
			scrollTop: 0
		})
	}
})
