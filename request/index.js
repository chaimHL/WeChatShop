// 发送请求的次数
let ajaxTimes = 0
export const request = (params) => {
	// 判断接口路径是否带有/my/，有就是代表需要header里带token
	let header = {...params.header}
	if(params.url.includes('/my/')) {
		// 给请求头添加token属性
		header.Authorization = wx.getStorageSync('token')
	}
	ajaxTimes++
	// 显示加载中效果
	wx.showLoading({
	  title: '加载中',
	  mask: true
	})
	// 定义公共的url
	const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			header,
			url: baseUrl + params.url,
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => {
				ajaxTimes--
				if(ajaxTimes === 0) {
					// 关闭加载中效果
					wx.hideLoading()
				}
			}
		})
	})
}