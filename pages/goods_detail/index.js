// pages/goods_detail/index.js
import { request } from "../../request/index.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goodsObj: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		const { goods_id } = options
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
		const goodsObj = goodsObjMsg.data.message
		this.goodsObjMsg = goodsObj
		this.setData({
			goodsObj: {
				// 为了让data里只存放页面渲染需要的数据
				pics: goodsObj.pics,
				goods_price: goodsObj.goods_price,
				goods_name: goodsObj.goods_name,
				// 部分苹果机型不能识别webp格式图片
				goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg')
			}
		})
		console.log(this.goodsObjMsg)
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
	}
})
