// Promise形式的getSetting
export const getSetting = () => {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// Promise形式的chooseAddress
export const chooseAddress = () => {
	return new Promise((resolve, reject) => {
		wx.chooseAddress({
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// Promise形式的openSetting
export const openSetting = () => {
	return new Promise((resolve, reject) => {
		wx.openSetting({
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// Promise形式的showModal
export const showModal = ({
	content
}) => {
	return new Promise((resolve, reject) => {
		wx.showModal({
			title: '提示',
			content: content,
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// Promise形式的showToast
export const showToast = ({
	title
}) => {
	return new Promise((resolve, reject) => {
		wx.showToast({
			title: title,
			icon: 'none',
			duration: 2000,
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// Promise形式的login
export const login = () => {
	return new Promise((resolve, reject) => {
		wx.login({
			timeout: 10000,
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// Promise形式的requestPayment，pay为支付所必需参数
export const requestPayment = (pay) => {
	return new Promise((resolve, reject) => {
		wx.requestPayment({
			...pay,
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// Promise形式的chooseImage
export const chooseImage = () => {
	return new Promise((resolve, reject) => {
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (result) => {
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// Promise形式的uploadFile
export const uploadFile = (fileObj) => {
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			...fileObj,
			success (result){
				resolve(result)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}




