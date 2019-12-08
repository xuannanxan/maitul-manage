from flask_restful import Api
from app.apis.blog.tags import BlogTags,BlogTagsList
from app.apis import api_blueprint

blog_api = Api(api_blueprint)
blog_api.add_resource(BlogTagsList,'/tags')
blog_api.add_resource(BlogTags,'/tags/<id>')
