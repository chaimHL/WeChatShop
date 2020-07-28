// pages/search/index.js
import { request } from "../../request/index.js"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 搜索返回的商品数据
		goods: [],
		// 清空按钮的显示隐藏
		btnShow: true,
		// 搜索框的值
		inputValue: ''
	},
	
	// 全局定时器id，用作函数防抖（防止重复发送请求，一般用于搜索框）
	// 不做防抖就会输入一个字发一次请求
	TimeId: -1,
	
	// 搜索框输入内容
	handleInput(e) {
		// 1. 获取搜索框的值
		const { value } = e.detail
		// 2. 检测合法性（值不能为空）
		if(!value.trim()) {
			// 值为空则清除商品搜索信息
			this.setData({
				goods: [],
				btnShow: true
			})
			return
		}
		// 3. 显示清空按钮
		this.setData({
			btnShow: false
		})
		// 4. 发送请求
		// 4.1 先清除上一次的定时器
		clearTimeout(this.TimeId)
		this.TimeId = setTimeout(() => {
			this.qsearch(value)
		}, 1000)
		
	},
	
	// 发送请求获取搜索结果
	async qsearch(query) {
		const res = await request({
			url: '/goods/qsearch',
			data: { query }
		})
		this.setData({
			goods: res.data.message
		})
		console.log(this.data.goods)
	},
	
	// 清空搜索框
	handleClear() {
		this.setData({
			goods: [],
			btnShow: true,
			inputValue: ''
		})
	}
})
