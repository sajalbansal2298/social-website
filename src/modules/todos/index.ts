import type { Router } from 'vue-router';

const Module = () => import('./component.vue');
const Todos = () => import('./views/todos-view.vue');

const moduleRoute = {
  path: '/todos',
  component: Module,
  children: [
    {
      path: '/todos',
      component: Todos,
    },
  ],
};

const routes = (router: Router) => {
  router.addRoute(moduleRoute);
};

export default {
  routes,
};
