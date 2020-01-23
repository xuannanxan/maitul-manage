/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2019-12-21 19:54:46
 * @LastEditTime : 2020-01-23 17:23:36
 * @LastEditors  : Xuannan
 */
import React, { useRef,useEffect } from 'react';
import E from 'wangeditor'
import {_fileUpload} from '../../utils/api'

const editorConfig = {
  menus: [
    'head',  // 标题
    'bold',  // 粗体
    'fontSize',  // 字号
    'fontName',  // 字体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    // 'quote',  // 引用
    //'emoticon',  // 表情
    'image',  // 插入图片
    'table',  // 表格
    // 'video',  // 插入视频
    'code',  // 插入代码
   // 'undo',  // 撤销
   // 'redo',  // 重复
  ], // 自定义菜单配置
  // fontNames: [
  //   '微软雅黑',
  // ], // 字体配置
  pasteIgnoreImg: true, // 忽略粘贴内容中的图片
  //uploadImgServer :  'http://127.0.0.1:5000/api/upload',
  //自定义上传图片事件
  customUploadImg :function (files, insert) {
    // files 是 input 中选中的文件列表
    // insert 是获取图片 url 后，插入到编辑器的方法
    files.forEach( function ( file, index ) {
        let formData=new FormData();
        formData.append('file',file)
        _fileUpload(formData).then(res=>{
            insert(res.data.path)
        })
    });

    // 上传代码返回结果之后，将图片插入到编辑器中
    //insert(imgUrl)
},
  zIndex: 0, // 编辑框z-index设置
  uploadImgMaxLength : 3,// 限制一次最多上传 1 张图片
  uploadImgMaxSize : 3 * 1024 * 1024,//限制图片大小
}; // 编辑器配置项

const  Editor = React.forwardRef((props,ref)=>{
    const { onChange, value } = props;// 有默认传来的 chang事件，和 value值
    //const { getFieldProps, name } = props;
    const elem = useRef()
    const initEditor = () => {
        const editor = new E(elem.current)
        editor.customConfig = editorConfig
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            onChange(editor.txt.html())
        }
        editor.create()
        if(value){
          editor.txt.html(value)
        }
    };
    useEffect(()=>{
      initEditor()
    },[])

    
    return (
        <div ref={elem}  style={{border: '1px solid #ccc'}}>
        </div>
  );
})

export default Editor;
