import {
  createRouter,
  createWebHistory,
  // type NavigationGuardNext,
  // type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', alias: '/index.html', redirect: '/home' },
  { path: '/:pathMatch(.*)*', redirect: '/not-found' }, // add your 404 route here
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
});

// export function getRouteWithLocale(
//   route: RouteLocationNormalized,
//   locale: string
// ): string | undefined {
//   route.query.locale = locale;

//   const queryString = Object.keys(route.query).reduce(
//     (q, key) => (q += `${key}=${route.query[key]}&`),
//     ""
//   );
//   const path = route.path.endsWith("/") ? route.path : `${route.path}/`;

//   return `${path}?${queryString}`;
// }

// const getQueryString = (to: RouteLocationNormalized): string =>
//   Object.keys(to.query)
//     .filter((key) => !!key)
//     .reduce((q, key) => (q += `${key}=${to.query[key]}&`), "");

// const isSuspendedAccessDenied = (to: RouteLocationNormalized): boolean =>
//   to.matched.some((record) => record.meta.isSuspendedAccessDenied);

// const requiresAuth = (to: RouteLocationNormalized): boolean =>
//   to.matched.some((record) => record.meta.requiresAuth);

// router.beforeEach(
//   async (
//     toRoute: RouteLocationNormalized,
//     _from: RouteLocationNormalized,
//     next: NavigationGuardNext
//   ) => {
//     return next();
//   }
// );

// // After navigation is confirmed, but before resolving...
// router.beforeResolve(
//   (
//     _to: RouteLocationNormalized,
//     from: RouteLocationNormalized,
//     next: NavigationGuardNext
//   ) => {
//     // If this isn't an initial page load...
//     next();
//   }
// );

// // When each route is finished evaluating...
// router.afterEach(() => {
//   loadSeoContent();
// });

// export function loadModule(name: string) {
//   return () => import(`@/modules/${name}/component.vue`);
// }

// export function loadLayout(name: string) {
//   return () => import(`@/layouts/${name}/component.vue`);
// }
// const webHost = "https://www.example.com";

// function loadSeoContent() {
//   // Meta Canonical
//   const link = document.querySelector("link[rel='canonical']")
//     ? document.querySelector("link[rel='canonical']")
//     : document.createElement("link");
//   if (link) {
//     link.setAttribute("rel", "canonical");
//     link.setAttribute("href", `${webHost}${window.location.pathname}`);
//     document.head.appendChild(link);
//   }
//   // Og url
//   const ogUrl = document.querySelector("meta[property='og:url']")
//     ? document.querySelector("meta[property='og:url']")
//     : document.createElement("meta");
//   if (ogUrl) {
//     ogUrl.setAttribute("property", "og:url");
//     ogUrl.setAttribute("href", `${webHost}${window.location.pathname}`);
//     document.head.appendChild(ogUrl);
//   }
//   // Remove  noindex,nofollow
//   const metaNoIndex = document.querySelector("meta[name='robots']");
//   if (metaNoIndex) {
//     document.head.removeChild(metaNoIndex);
//   }
// }

export default router;
