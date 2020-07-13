// pages/cart/index.js
import {
	getSetting,
	chooseAddress,
	openSetting,
	showModal,
	showToast
} from "../../utils/asyncWx.js"
Page({
	data: {
		address: '',
		cart: [],
		checkAll: false,
		totalPrice: 0,
		totalNum: 0
	},
	// 因为要点击完获取按钮立马显示地址，所以用onShow
	onShow() {
		const address = wx.getStorageSync('address')
		// 获取商品数据
		const cart = wx.getStorageSync('cart') || []
		// 空数组调用every也返回true，所以要做判断
		// let checkAll = cart.length ? cart.every(v => v.checked) : false
		// 避免cart多次遍历，所以进行优化
		// let checkAll = true
		// 获取被选中的商品计算总价格和总数量
		// let totalPrice = 0
		// let totalNum = 0
		// cart.forEach(v => {
		// 	if(v.checked){
		// 		totalPrice += v.goods_price * v.num
		// 		totalNum += v.num
		// 	}else{
		// 		checkAll = false
		// 	}
		// })
		// 如果cart为空，将checkAll设置为false
		// checkAll = cart.length ? checkAll : false
		this.setData({
			address
		})
		this.setCart(cart)
	},
	// 点击获取收货地址
	/* 
	   小程序中,如果用户拒绝过获取收货地址的权限,
	   则无法直接调用收货地址api,
	   需要引导用户重新授权
	*/
	async handleChooseAddress() {
		try {
			//获取权限
			const result = await getSetting()
			const scopeAddress = result.authSetting['scope.address']
			// 如果用户曾经不同意获取地址权限
			if (scopeAddress === false) {
				// 引导用户打开授权页面
				const result1 = await openSetting()
			}
			// 调用获取收货地址api
			let address = await chooseAddress()
			// 先将地址拼接好，方便wxml页面书写
			address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
			// 将地址存到缓存中
			wx.setStorageSync('address', address)

		} catch (e) {
			console.log(e)
		}
	},

	// 商品的选中
	handleItemChange(e) {
		// 获取选中的商品的id
		const {
			id
		} = e.currentTarget.dataset
		// 获取商品数组
		let {
			cart
		} = this.data
		// 获取选中的商品的index
		let index = cart.findIndex(v => v.goods_id === id)
		cart[index].checked = !cart[index].checked
		// 重新将cart赋值给data和缓存
		// this.setData({
		// 	cart
		// })
		// wx.setStorageSync('cart', cart)
		// 重新计算总价格总数量是否全选
		// let checkAll = true
		// let totalPrice = 0
		// let totalNum = 0
		// cart.forEach(v => {
		// 	if(v.checked){
		// 		totalPrice += v.goods_price * v.num
		// 		totalNum += v.num
		// 	}else{
		// 		checkAll = false
		// 	}
		// })
		// this.setData({
		// 	checkAll,
		// 	totalPrice,
		// 	totalNum
		// })
		this.setCart(cart)
	},

	// 商品的选中状态改变后重新计算总价格 总数量 是否全选
	setCart(cart) {
		wx.setStorageSync('cart', cart)
		let checkAll = true
		let totalPrice = 0
		let totalNum = 0
		cart.forEach(v => {
			if (v.checked) {
				totalPrice += v.goods_price * v.num
				totalNum += v.num
			} else {
				checkAll = false
			}
		})
		// 如果cart为空，将checkAll设置为false
		checkAll = cart.length ? checkAll : false
		this.setData({
			cart,
			checkAll,
			totalPrice,
			totalNum
		})
	},

	// 全选
	handleAllChange() {
		let {
			cart,
			checkAll
		} = this.data
		checkAll = !checkAll
		cart.forEach(v => v.checked = checkAll)
		this.setCart(cart)
	},

	// 商品数量加减
	// 绑定同一个函数，加或减用参数表示
	async handleNumEdit(e) {
		const {
			id,
			operation
		} = e.currentTarget.dataset
		let {
			cart
		} = this.data
		const index = cart.findIndex(v => v.goods_id === id)
		// 当数量减到0时询问是否删除商品
		if (cart[index].num === 1 && operation === -1) {
			// wx.showModal({
			//   title: '提示',
			//   content: '这是一个模态弹窗',
			//   success: res => {
			//     if(res.confirm) {
			//       cart.splice(index, 1)
			// 	  // 注意,这里使用了箭头函数才能保证this指向的正确
			// 	  this.setCart(cart)
			//     } else if(res.cancel) {
			//       console.log('用户点击取消')
			//     }
			//   }
			// })
			// 进行async await优化
			const res = await showModal({
				content: '是否删除改商品？'
			})
			if (res.confirm) {
				cart.splice(index, 1)
				this.setCart(cart)
			}
		}else{
			cart[index].num += operation
			this.setCart(cart)
		}
	},
	
	// 点击结算
	handlePay() {
		const { address, cart } = this.data
		// 判断是否有填写地址，注意要return
		if(!address.userName) {
			showToast({ title: '请填写收货地址' })
			return
		}
		// 判断购物车是否有内容
		if(cart.length === 0) {
			showToast({ title: '请添加商品' })
			return
		}
		// 没问题就直接跳支付页
		wx.navigateTo({
		  url: '/pages/pay/index'
		})
	}
})
