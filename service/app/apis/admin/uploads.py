
from flask_restful import Resource,reqparse,abort
from werkzeug.datastructures import FileStorage
from app.utils.file import FileUpload
from app.apis.api_constant import *
from app.apis.admin.common import login_required
from app.utils.api_doc import Apidoc
from app.api_docs.admin import upload_doc as doc


api = Apidoc('上传')
parser = reqparse.RequestParser()
parser.add_argument('file', type=FileStorage, location='files',required=True,help='请上传文件')
parser.add_argument('width', type=int, help='宽度信息有误')
parser.add_argument('height', type=int, help='高度信息有误')
parser.add_argument('watermark', type=str)

class UploadResource(Resource):
    @api.doc(api_doc=doc.upload)
    @login_required
    def post(self):
        args = parser.parse_args()
        files = args.get('file')
        width = args.get('width')
        height = args.get('height')
        watermark = args.get('watermark')
        file_upload = FileUpload(files,width,height,watermark=watermark)
        data = {
                'status':RET.OK,
                'name':file_upload.file_name,
                'path':file_upload.full_path,
                'size':file_upload.file_size
                }
        return data
