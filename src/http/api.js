import axios from 'axios'

const api = {
    // 登录
    login(obj) {
        return axios({
            url: 'login',
            method: 'post',
            data: obj
        })
    },

    // 左侧菜单栏
    getLeftNav() {
        return axios({
            url: 'menus'
        })
    },

    // 用户数据列表
    getUserList(pagenum, pagesize,query) {
        return axios({
            url: 'users?pagenum=' + pagenum + '&pagesize=' + pagesize+'&query='+query
        })
    },

    // 添加用户
    addUser(obj) {
        return axios({
            url:'users',
            method:'post',
            data:obj
          })
    },

    // 修改用户状态
    updataUser(id, type) {
        return axios({
            method: 'put',
            url: 'users/' + id + '/state/' + type,
            data:{id,type}
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
            url: 'users/' + obj.id,
            method: 'put',
            data: obj
        })
    },

    // 删除单个用户
    deletePerson(id){
        return axios({
            url:'users/'+id,
            method:'delete',
            data:{id}
        })
    },

    // 分配用户角色
    getRole(id,rid){
        return axios({
            url:'users/'+id/role,
            method:'put',
            data:{id,rid}
        })
    },

    // 所有权限列表


}

export default api