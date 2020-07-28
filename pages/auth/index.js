// pages/auth/index.js
import { login } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js"

Page({
	// 获取授权
	async handleGetUserInfo(e) {
		try{
			// 以下字段主要用作后台服务器生成用户token所有，无特殊用意
			const { encryptedData, rawData, iv, signature } = e.detail
			// 获取登录凭证（code）
			// wx.login({
			//   success: (res) => {
			//      const { code } = res
			//   }
			// })
			// 对wx.login进行封装
			const { code } = await login()
			// 将请求需要的参数放一起
			const loginParams = { encryptedData, rawData, iv, signature, code }
			// 发送请求(注意，个人appid是没办拿到token的)
			const res = await request({ 
				url: '/users/wxlogin',
				data: loginParams,
				method: 'POST'
			})
			// 因为个人appid没办拿到token，所以这里给个假的
			const token = 'BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
			// 将token存到缓存中，并返回上一页
			wx.setStorageSync('token', token)
			wx.navigateBack({
				delta: 1
			})
		}catch(e){
			console.log(e)
		}
	}

})
