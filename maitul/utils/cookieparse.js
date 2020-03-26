/*
 * @Description: 
 * @Author: Xuannan
 * @Date: 2020-02-14 13:09:20
 * @LastEditTime: 2020-03-26 14:34:11
 * @LastEditors: Xuannan
 */
const cookieparse =  (cname, req)=> {
    let name = cname + "="
    let decodedCookie
    if (typeof window === 'undefined') decodedCookie = decodeURIComponent(req.headers.cookie)
    else decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  }

export default cookieparse

  