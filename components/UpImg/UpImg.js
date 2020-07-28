// components/UpImg/UpImg.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		src: {
			type: String,
			value: ''
		}
	},
	
	/**
	 * 组件的方法列表
	 */
	methods: {
		handleRemoveImg() {
			this.triggerEvent('tabsRemoveImg')
		}
	}
})
