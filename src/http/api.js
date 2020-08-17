const { default: axios } = require(".")

const api = {
    // 登录
    login(obj) {
        return axios({
            url: '/login',
            method: 'post',
            data:obj
        })
    },

    // 左侧菜单栏
    getLeftNav(){
        return axios({
            url:'/menus'
        })
    },



}

export default api