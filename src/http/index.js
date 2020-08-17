import axios from 'axios'


axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token') || ''

//请求拦截
axios.interceptors.request.use((config)=>{

    return config
})

// 响应拦截
axios.interceptors.response.use(config=>{


    return config
})


export default axios;
