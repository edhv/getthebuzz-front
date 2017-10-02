import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Source from '@/components/Source'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/source/:type/:username/:open?',
            name: 'Source',
            component: Source
        }
    ]
})