/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-19 15:04:46
 * @LastEditTime: 2020-02-19 15:33:41
 * @LastEditors: Xuannan
 */
export const findNodes = (arr, value,field= 'id', childName= 'children') => {
    const arrs = []
    if (!arr || !value) {
      return
    }
    const getChild = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if(arr[i][field]===value){
                arrs.push(arr[i])
            }
            if (arr[i][childName] && arr[i][childName].length > 0) {
                getChild(arr[i].children)
            }
        }
        return arrs
    }
    return getChild(arr)
  }
  