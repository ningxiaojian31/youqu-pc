import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Topic from './views/nav1/Topic.vue'
import Invitation from './views/nav1/Invitation.vue'
import Comment from './views/nav1/Comment.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Chat from './views/nav2/Chat.vue'
import Log from './views/nav3/Log.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '社区管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/topic', component: Topic, name: '话题' },
			{ path: '/invitation', component: Invitation, name: '帖子' },
			{ path: '/comment', component: Comment, name: '评论' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '聊天管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/chat', component: Chat, name: '聊天记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '日志管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/log', component: Log, name: '日志' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;