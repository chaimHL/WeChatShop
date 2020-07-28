// pages/feedback/index.js
import { chooseImage, showToast, uploadFile } from "../../utils/asyncWx.js"
Page({
	data: {
		// 父组件向子组件传的值
		tabs: [{
				id: 0,
				value: '体验问题',
				isActive: true
			},
			{
				id: 1,
				value: '我要投诉',
				isActive: false
			}
		],
		// 图片数组
		chooseImg: [],
		// 文本域内容
		textVal: ''
	},
	
	// 提交反馈将图片上传服务器后的返回值
	imgMsg: [],
	
	// 标题点击事件（子传父）
	handleTabsItemChange(e) {
		const { index } = e.detail
		const { tabs } = this.data
		tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
		this.setData({
			tabs
		})
	},
	
	// 点击添加图片按钮
	async handleChooseImg() {
		// wx.chooseImage({
		//   count: 9,
		//   sizeType: ['original', 'compressed'],
		//   sourceType: ['album', 'camera'],
		//   success: (res) => {
		//     // tempFilePath可以作为img标签的src属性显示图片
		//     const chooseImg = res.tempFilePaths
		// 	this.setData({
		// 		chooseImg
		// 	})
		//   }
		// })
		const res = await chooseImage()
		this.setData({
			// 保证图片可以分多次选择
			chooseImg: [...this.data.chooseImg, ...res.tempFilePaths]
		})
	},
	
	// 点击叉叉删除图片
	handleTabsRemoveImg(e) {
		const { index } = e.currentTarget.dataset
		let { chooseImg } = this.data
		chooseImg.splice(index, 1)
		this.setData({
			chooseImg
		})
	},
	
	// 
	handleTextInput(e) {
		this.setData({
			textVal: e.detail.value
		})
		
	},
	
	// 点击提交按钮
 	async handleFormSubmit() {
		// 1. 获取文本域内容和图片数组
		const { textVal, chooseImg } = this.data
		// 2. 检测内容合法性(是否为空)
		if(!textVal.trim()) {
			await showToast({ title: '提交文本不能为空' })
			return
		}
		// 3. 判断是否有图片需要上传
		if(chooseImg.length !== 0) {
			// 准备上传图片到专门的服务器
			// 3.1 显示loading图标
			wx.showLoading({
			  title: '图片上传中',
			})
			// 3.2 文件上传api不支持多个文件同时上传，所以要遍历挨个上传
			chooseImg.forEach(async (v, i) => {
				const fileObj = {
					url: 'https://clubajax.autohome.com.cn/Upload/UpImageOfBase64New?dir=image&cros=autohome.com.cn',
					filePath: v,
					name: 'file'
				}
				const res = await uploadFile(fileObj)
				// 返回的信息是json格式，所以要转义
				const { message } = JSON.parse(res.data) 
				this.imgMsg.push(message)
				console.log(this.imgMsg)
				// 当遍历到最后一次，即所有图片都上传完毕后触发
				if(i === chooseImg.length - 1 ) {
					// 关闭loading图标
					wx.hideLoading()
					await showToast({ title: '反馈提交成功' })
					// 重置页面
					this.setData({
						chooseImg: [],
						textVal: ''
					})
				}
			})
		}else{
			console.log('直接上传文本到后台服务器')
		}
	}
})
