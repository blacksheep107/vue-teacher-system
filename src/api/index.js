import axios from "axios";
// axios.defaults.baseURL = 'https://api.weixin.qq.com';
import store from "@/store";
export default {
    getAccessToken(){
        return axios({
            method: 'GET',
            url: '/cgi-bin/token',
            params: {
                grant_type:'client_credential',
                appid: store.state.APPID,
                secret: store.state.APPSECRET
            }
        })
    },
    query(data) {
        let obj = Object.assign(data,{
            'env': store.state.env
        })
        return axios({
            method: 'POST',
            url: '/tcb/databasequery',
            params: {
                access_token:store.state.access_token
            },
            data:obj
        })
    },
}

