import axios from 'axios';
import qs from 'qs';
// axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://localhost:9999'
axios.defaults.headers.post['Content-Type'] = 'application/json';



export const getTopicListPage = (params,data) => { return axios.post('/invitation/tTopic/gets'+'?'+qs.stringify(params),data); };

export const saveTopic = data => { return axios.post('/invitation/tTopic/save', data); };

export const deleteTopic = params => { return axios.delete('/invitation/tTopic/del/'+params); };


export const requestLogin = params => { return axios.post(`/user/tUser/admin/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`/user/list`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`/user/edit`, { params: params }); };

