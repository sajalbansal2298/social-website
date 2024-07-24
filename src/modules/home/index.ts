// import router from "@/router";
import type { Router } from 'vue-router';

const Module = () => import('./component.vue');
const Home = () => import('./views/home-view.vue');

const moduleRoute = {
  path: '/home',
  component: Module,
  children: [
    {
      path: '/home',
      component: Home,
    },
  ],
};

// router.addRoute(moduleRoute);

const routes = (router: Router) => {
  router.addRoute(moduleRoute);
};

export default {
  routes,
};
