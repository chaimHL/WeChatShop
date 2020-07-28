// pages/goods_detail/index.js
import { request } from "../../request/index.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goodsObj: {},
		// 是否收藏
		isCollected: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow: function() {
		// 1. 获取当前小程序的页面栈（数组，长度最大为10）
		const pages = getCurrentPages()
		// 2. 数组中索引最大的页面就是当前页面
		const currentPage = pages[pages.length - 1]
		// 3. 获取url上的goods_id
		const { goods_id } = currentPage.options
		this.getGoodsDetail(goods_id)
	},
	
	// 接口返回商品数据
	goodsObjMsg: {},
	
	// 获取商品详情数据
	async getGoodsDetail(goods_id) {
		const goodsObjMsg = await request({
			url: '/goods/detail',
			data: { goods_id }
		})
		// 获取商品对象
		const goodsObj = goodsObjMsg.data.message
		this.goodsObjMsg = goodsObj
		// 先找到缓存中存储收藏数据的数组,|| []是为了保证collect为数组格式
		const collect = wx.getStorageSync('collect') || []
		// 判断收藏数组里是否有当前商品
		const isCollected = collect.some(v => v.goods_id === this.goodsObjMsg.goods_id)
		this.setData({
			goodsObj: {
				// 为了让data里只存放页面渲染需要的数据
				pics: goodsObj.pics,
				goods_price: goodsObj.goods_price,
				goods_name: goodsObj.goods_name,
				// 部分苹果机型不能识别webp格式图片
				goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg')
			},
			isCollected
		})
	},
	// 点击轮播图放大预览
	handlePreviewImg(e) {
		// 构造要预览的图片数组
		const urls = this.goodsObjMsg.pics.map(v => v.pics_mid)
		const { url: current } = e.currentTarget.dataset
		wx.previewImage({
		  current, // 当前显示图片的http链接
		  urls // 需要预览的图片http链接列表
		})
	},
	// 点击加入购物车
	handleAddCart() {
		// 1. 调取缓存（查看购物车是否已有该商品）
		// 第一次加入商品前cart为空，所以给个[],保证cart为数组
		const cart = wx.getStorageSync('cart') || []
		// 2. 判断购物车是否已有该商品
		const index = cart.findIndex(v => v.goods_id === this.goodsObjMsg.goods_id)
		if(index === -1){
			// 3. 商品未添加
			// 添加一个属性num
			this.goodsObjMsg.num = 1
			// 添加购物车页面的默认勾选属性checked
			this.goodsObjMsg.checked = true
			// 添加到缓存
			cart.push(this.goodsObjMsg)
		}else{
			// 4. 商品已添加
			cart[index].num++
		}
		// 5. 购物车重新添加到缓存
		wx.setStorageSync('cart', cart)
		// 6. 弹窗提示
		wx.showToast({
		  title: '添加购物车成功',
		  icon: 'success',
		  mask: true
		})
	},
	// 点击 收藏按钮
	handleCollect() {
		let isCollected = false
		// 1. 获取缓存里的收藏数组
		let collect = wx.getStorageSync('collect') || []
		// 2. 判断本商品是否在收藏数组里
		const index = collect.findIndex(v => v.goods_id === this.goodsObjMsg.goods_id)
		if(index != -1) {
			// 2.1 在收藏列表
			collect.splice(index, 1)
			isCollected = false
			wx.showToast({
				title: '已取消收藏',
				icon: 'none'
			})
		}else{
			// 2.2 不在收藏列表
			collect.push(this.goodsObjMsg)
			isCollected = true
			wx.showToast({
				title: '收藏成功',
				icon: 'none'
			})
		}
		// 3. 将collect重新存到缓存
		wx.setStorageSync('collect', collect)
		// 4. 修改data
		this.setData({
			isCollected
		})
	}
})
