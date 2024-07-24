// import router from "@/router";
import type { Router } from 'vue-router';

const Module = () => import('./component.vue');
const NotFound = () => import('./views/not-found-view.vue');

const moduleRoute = {
  path: '/not-found',
  component: Module,
  children: [
    {
      path: '/not-found',
      component: NotFound,
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
