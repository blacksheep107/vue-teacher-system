import axios from "axios";
if (process.env.NODE_ENV === "production") axios.defaults.baseURL = 'http://120.78.155.149:3001';
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
    add(data) {
        let obj = Object.assign(data,{
            'env': store.state.env
        })
        return axios({
            method: 'POST',
            url: '/tcb/databaseadd',
            params: {
                access_token:store.state.access_token
            },
            data:obj
        })
    },
    update(data) {
        let obj = Object.assign(data,{
            'env': store.state.env
        })
        return axios({
            method: 'POST',
            url: '/tcb/databaseupdate',
            params: {
                access_token:store.state.access_token
            },
            data:obj
        })
    },
    deleteRecord(data) {
        let obj = Object.assign(data,{
            'env': store.state.env
        })
        return axios({
            method: 'POST',
            url: '/tcb/databasedelete',
            params: {
                access_token:store.state.access_token
            },
            data:obj
        })
    },
    uploadFile(data) {
        let obj = Object.assign(data,{
            'env': store.state.env
        })
        return axios({
            method: 'POST',
            url: '/tcb/uploadfile',
            params: {
                access_token:store.state.access_token
            },
            data:obj
        })
    },
    // fileUrl(url, data) {
    //     return axios({
    //         method: 'POST',
    //         url: url,
    //         data:data
    //     })
    // },
    fileUrl(url,data) {
        return axios({
            method: 'POST',
            url: '/fileurl',
            data: {
                data: data,
                url: url
            }
        })
    },
    batchdownloadfile(data) {
    let obj = Object.assign(data,{
        'env': store.state.env
    })
        return axios({
            method: 'POST',
            url: '/tcb/batchdownloadfile',
            params: {
                access_token:store.state.access_token
            },
            data: obj
        })
}
}

