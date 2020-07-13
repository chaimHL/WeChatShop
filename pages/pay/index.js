// pages/pay/index.js
import {
	getSetting,
	chooseAddress,
	openSetting,
	showModal,
	showToast,
	requestPayment
} from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"

Page({
	data: {
		address: '',
		cart: [],
		totalPrice: 0,
		totalNum: 0
	},
	
	// 因为要点击完获取按钮立马显示地址，所以用onShow
	onShow() {
		const address = wx.getStorageSync('address')
		this.setData({
			address
		})
		// 获取商品数据
		let cart = wx.getStorageSync('cart')
		cart = cart.filter(v => v.checked)
		// 计算商品价格、数量
		let totalPrice = 0
		let totalNum = 0
		cart.forEach(v => {
			totalPrice += v.goods_price * v.num
			totalNum += v.num
		})
		this.setData({
			cart,
			totalPrice,
			totalNum
		})
	},
	
	// 点击支付
	async handleOrderPay() {
		try{
			// 1. 先判断缓存有没有token
			const token = wx.getStorageSync('token')
			// 2. 没有token则要获取token 
			if(!token) {
				// 2.1 跳转到授权页面获取，因为接口文档中说明了获取token需要一些用户信息的参数
				wx.navigateTo({
					url: '/pages/auth/index'
				})
				return
			}
			// 3. 有token就创建订单
			// 3.1 先按接口文档要求准备请求需要的参数 
			// const header = { Authorization: token } 不需要写了，因为在request.js里封装了个判断
			const order_price = this.data.totalPrice
			const consignee_addr = this.data.address
			let goods = []
			const cart = this.data.cart
			cart.forEach(v => goods.push({
				goods_id: v.goods_id,
				goods_number: v.num,
				goods_price: v.goods_price
			}))
			const orderParams = { order_price, consignee_addr, goods }
			// 4. 发送请求，获取订单编号(这里实际上获取不到，所以用let了，后面自己给一个)
			let { order_number } = await request({
				url: '/my/orders/create',
				method: 'POST',
				data: orderParams,
				// header 不需要写了，因为在request.js里封装了个判断
			})
			order_number = 'xqy1049'
			// 5. 发起预支付接口，会返回一个对象pay，里面有微信支付需要的参数(这里同样拿不到，因为没有效的token)
			let { pay } = await request({
				url: '/my/orders/req_unifiedorder',
				method: 'POST',
				data: { order_number },
				// header
			})
			pay = {
				timeStamp: '',
				nonceStr: '',
				package: '',
				signType: 'MD5',
				paySign: ''
			}	
			// 6. 发起微信支付
			await requestPayment(pay)
			// 7. 查询后台支付状态
			const res = await request({
				url: '/my/orders/chkOrder',
				method: 'POST',
				data: { order_number },
				// header
			})
			await showToast({ title: '支付成功' })
			// 8. 将缓存中的购物车数据删除已成功支付的商品
			let newCart = wx.getStorageSync('cart')
			newCart = newCart.filter(v => !v.checked)
			wx.setStorageSync('cart', newCart)
			// 9. 跳转订单页面
			wx.navigateTo({ url:'/pages/order/index' })
		}catch(e){
			await showToast({ title: '支付失败' })
			console.log(e)
			// 因为支付肯定失败，所以就在这价格跳转页面继续下面的学习
			wx.navigateTo({ url:'/pages/order/index' })
		}
	}	
})
