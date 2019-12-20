from app.utils.swagger_filed import IntegerQueryFiled, StringQueryFiled, IntegerPathFiled, StringPathFiled

image_code = StringQueryFiled(name='image_code',
						description="获取图片验证码的唯一CODE",
						default='',
						required=True).data	

captcha_doc = {
	"description": "获取图片验证码",
	"parameters": [
		image_code
	],
	"responses": {
		"200": {
			"description": "获取成功",
			"properties":{
				'data':{
					'type':'string'
				},
			}
		}
	}
}