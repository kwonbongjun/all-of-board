import axios from 'axios';
export function post(url: string, data: object) {
    return axios({
        method: 'post',
        url: 'http://localhost:8080/' + url,
        // headers: {
        //   'content-type': 'application/json;charset=utf-8'
        // },
        data: data,
        withCredentials: true
    })
};
export function get(url: string, data?: Object) {
    return axios({
        method: 'get',
        url: 'http://localhost:8080/' + url,
        data: data,
        // headers: {
        //   'content-type': 'application/json;charset=utf-8'
        // },
        withCredentials: true
    })
};
export function postWithFiles(url: string, data: object, formData: FormData) {
    return axios({
        method: 'post',
        url: 'http://localhost:8080/' + url,
        headers: {
            // 'Accept': 'multipart/form-data',
            // 'Content-Type': 'multipart/form-data',
            // 'encType': 'multipart/form-data',
        },
        data: formData,//data,
        withCredentials: true,
    })
};