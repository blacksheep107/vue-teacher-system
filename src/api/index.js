import axios from "axios";
import store from "@/store";
export default {
    getAccessToken(){
        return axios({
            method: 'GET',
            url: 'https://api.weixin.qq.com/cgi-bin/token',
            params: {
                grant_type:'client_credential',
                appid: store.state.APPID,
                secret: store.state.APPSECRET
            }
        })
    },
    login(data) {
        return axios({
            method: 'POST',
            url: 'https://api.weixin.qq.com/tcb/databasequery',
            params: {
                access_token:store.state.access_token
            },
            data
        })
    },
}

