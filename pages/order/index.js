// pages/order/index.js
import { request } from "../../request/index.js"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 父组件向子组件传的值
		tabs: [{
				id: 0,
				value: '全部',
				isActive: true
			},
			{
				id: 1,
				value: '待付款',
				isActive: false
			},
			{
				id: 2,
				value: '待发货',
				isActive: false
			},
			{
				id: 3,
				value: '退款/退货',
				isActive: false
			}
		],
		// 订单信息
		orders: []
	},
	
	onShow() {
		// 0. 先判断是否有token
		const token = wx.getStorageSync('token')
		if(!token) {
			wx.navigateTo({ url:'/pages/auth/index' })
			return
		}
		// 1. 获取当前小程序的页面栈（数组，长度最大为10）
		const pages = getCurrentPages()
		// 2. 数组中索引最大的页面就是当前页面
		const currentPage = pages[pages.length - 1]
		// 3. 获取url上的type
		const { type } = currentPage.options
		// 3.1 根据type值切换tab的激活标题
		this.changeTabTitle(type-1)
		// 4. 获取订单数据
		this.getOrders(type)
	},
	
	// 获取订单列表的方法
	async getOrders(type) {
		const res = await request({
			url: '/my/orders/all',
			data: {type }
		})
		// 因为拿不到真实的token所以返回不了数据，这里给个假的
		let orders = res.orders
		orders = [
			{
				order_id: 23,
				order_number: 'XMHL202007161602',
				order_price: 1688,
				create_time: 1565616985
			},
			{
				order_id: 23,
				order_number: 'XMHL202007161602',
				order_price: 1688,
				create_time: 1565616985
			}
		]
		
		this.setData({
			// 将时间create_time由秒数变为格式化的日期create_time_cn
			orders: orders.map(v => ({ ...v, create_time_cn: new Date(v.create_time * 1000).toLocaleString() }))
		})
	},
	
	// 标题点击事件（子传父）
	handleTabsItemChange(e) {
		const { index } = e.detail
		this.changeTabTitle(index)
		// 每次切换tab都重新发送请求
		this.getOrders(index+1)
	},
	
	// tab 栏标题根据 index 切换选中状态
	changeTabTitle(index) {
		const { tabs } = this.data
		tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
		this.setData({
			tabs
		})
	}
})
