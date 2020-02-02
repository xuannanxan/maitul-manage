/*
 * @Description: 根据某一个节点找出全部父亲节点
 * @Author: Xuannan
 * @Date: 2020-01-12 00:03:49
 * @LastEditTime : 2020-01-12 10:51:17
 * @LastEditors  : Xuannan
 */
export const getAllParent = (node, tree, parentNodes = [], index = 0)=>{
    if (!node || node.pid === 0) {
      return
    }
    findParent(node, parentNodes, tree)
    let parentNode = parentNodes[index]
    getAllParent(parentNode, tree, parentNodes, ++index)
    return parentNodes
  }
  
  const findParent = (node, parentNodes, tree)=>{
    for (let i = 0; i < tree.length; i++) {
      let item = tree[i]
      if (item.id === node.pid) {
        parentNodes.push(item)
        return
      }
      if (item.children && item.children.length > 0) {
        findParent(node, parentNodes, item.children)
      }
    }
  }
  
    //根据当前URL获取当前菜单,col是要查找的字段，value是要查找的字段的值
export const getNode=(tree,value,col='')=>{
      if(!col || !tree.length){
        return
      }
      for (let i = 0; i < tree.length; i++) {
        let item = tree[i]
        if(item[col] === value){
          return item
        }
        if (item.children && item.children.length > 0) {
          let node = getNode(item.children,value,col)
          if(node){
            return node
          }
        }
      }
  }