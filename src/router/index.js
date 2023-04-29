import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TagView from "@/views/TagView.vue";
import AuthorView from "@/views/AuthorView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import PresentationView from "@/views/PresentationView.vue";

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
    },
    {
      path: "/presentation",
      name: "presentation",
      component: PresentationView
    },
    {
      path: "/:pathMatch(.*)",
      name: "not-found",
      component: NotFoundView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // go upstairs
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  next()
  // go upstairs, but actually works now
  window.scrollTo(0, 0)
})

export default router
