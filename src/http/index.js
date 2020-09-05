import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token') 第一次不行

//请求拦截
axios.interceptors.request.use((config)=>{
    NProgress.start();
    config.headers.Authorization =  sessionStorage.getItem('token');//添加token
    return config;
})

// // 响应拦截
axios.interceptors.response.use(config=>{
    NProgress.done();
    return config;
})


export default axios;
