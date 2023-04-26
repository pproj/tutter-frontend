import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TagView from "@/views/TagView.vue";
import AuthorView from "@/views/AuthorView.vue";

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/tag/:tag',
      name: 'tag',
      component: TagView
    },
    {
      path: '/author/:id',
      name: 'author',
      component: AuthorView
    }
  ]
})

export default router
