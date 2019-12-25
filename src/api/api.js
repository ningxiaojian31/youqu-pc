import axios from 'axios';
import qs from 'qs';
export const uploadURL = 'http://localhost:9999'; //图片上传路径
axios.defaults.baseURL = 'http://localhost:9999'; //网络请求路径
axios.defaults.headers.post['Content-Type'] = 'application/json'; //设置post请求方式



export const requestLogin = params => { return axios.post('/user/tUser/admin/login', params).then(res => res.data); };


export const getTopicListPage = (params,data) => { return axios.post('/invitation/tTopic/list'+'?'+qs.stringify(params),data); };

export const saveTopic = data => { return axios.post('/invitation/tTopic/save', data); };

export const deleteTopic = params => { return axios.delete('/invitation/tTopic/del/'+params); };


export const getInvitationListPage = (params,data) => { return axios.post('/invitation/tInvitation/list'+'?'+qs.stringify(params),data); };

export const saveInvitation = data => { return axios.post('/invitation/tInvitation/save', data); };

export const deleteInvitation = params => { return axios.delete('/invitation/tInvitation/del/'+params); };


export const getCommentListPage = (params,data) => { return axios.post('/invitation/tComment/list'+'?'+qs.stringify(params),data); };

export const saveComment = data => { return axios.post('/invitation/tComment/save', data); };

export const deleteComment = params => { return axios.delete('/invitation/tComment/del/'+params); };


export const getUserList = params => { return axios.get(`/user/list`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`/user/edit`, { params: params }); };

