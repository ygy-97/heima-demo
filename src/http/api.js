import axios from 'axios'

const api = {
    // 登录
    login(obj) {
        return axios({
            url: '/login',
            method: 'post',
            data: obj
        })
    },

    // 左侧菜单栏
    getLeftNav() {
        return axios({
            url: '/menus'
        })
    },

    // 用户数据列表
    getUserList(pagenum, pagesize) {
        return axios({
            url: '/users?pagenum=' + pagenum + '&pagesize=' + pagesize
        })
    },

    // 添加用户
    addUser(obj) {
        return axios({
            url: '/users',
            type: 'post',
            data: obj,
        })
    },

    // 修改用户状态
    updataUser(id, type) {
        return axios({
            method: 'put',
            url: 'users/' + id + '/state/' + type
        })
    },

    // 根据 ID 查询用户信息
    getUserById(id) {
        return axios({
            url: 'users/' + id
        })
    },

    //  编辑用户提交
    submitData(obj) {
        return axios({
            url: 'user/' + obj.id,
            method: 'put',
            data: obj
        })
    },
}

export default api