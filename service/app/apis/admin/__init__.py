from flask_restful import Api
from app.apis.admin.admin import AdminAdd
from app.apis import api_blueprint

admin_api = Api(api_blueprint)
admin_api.add_resource(AdminAdd,'/admin/add')