import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from '../layout/index.vue'
import index from '../view/Index.vue'
import About from '../view/About.vue'
import Answer from '../view/Answer.vue'

import StudentGroup from '../view/StudentManage.vue'


const routerHistory = createWebHashHistory()
export const constantRoutes = [

    {
        path: "/",
        component: Layout,
        children: [
            {
                path: '/about',
                name: 'About',
                component: About
            },
            {
                path: '/index',
                component: index
            },
            {
                path: '/',
                component: index
            },
            {
                path: '/answer',
                component: Answer
            },

            {
                path: '/groupManage',
                component: StudentGroup
            }
        ]
    }


]

const router = createRouter({
    history: routerHistory,
    routes: constantRoutes
})
export default router
