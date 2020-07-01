// pages/goods_list/index.js
import { request } from "../../request/index.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 父组件向子组件传的值
		tabs:[
			{
				id: 0,
				value: '综合',
				isActive: true
			},
			{
				id: 1,
				value: '销量',
				isActive: false
			},
			{
				id: 2,
				value: '价格',
				isActive: false
			}
		],
		// 商品列表数据
		goodList: []
	},
	// 传递给接口的参数
	QueryParams:{
		query: '',
		cid:'',
		pagenum: 1,
		pagesize: 7
	},
	// 总页数
	TotalPage: 1,

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.QueryParams.cid = options.cid
		this.getGoodsList()
	},
	
	// 获取商品列表数据
	async getGoodsList() {
		const result = await request({url: '/goods/search', data: this.QueryParams}) 
		// 计算总页数
		this.TotalPage = Math.ceil(result.data.message.total / this.QueryParams.pagesize) 
		this.setData({
			// 数组拼接，新获取的数据和之前几页的数据进行拼接
			goodList: [...this.data.goodList, ...result.data.message.goods]
		})
		// 停止下拉刷新动画
		wx.stopPullDownRefresh()
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
	
	// 页面上拉触底事件的处理函数
	onReachBottom() {
		// 判断是否还有下一页数据(当前页码是否大于等于总页码)
		if(this.QueryParams.pagenum >= this.TotalPage) {
			wx.showToast({
			  title: '没有更多商品了',
			  icon: 'none',
			  duration: 2000
			})
		}else{
			this.QueryParams.pagenum++
			this.getGoodsList()
		}
	},
	
	// 页面下拉刷新触发
	onPullDownRefresh() {
		this.setData({
			goodList: []
		})
		this.QueryParams.pagenum = 1
		this.getGoodsList()
	}
})
