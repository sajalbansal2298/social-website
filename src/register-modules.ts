import type { Router } from 'vue-router';
import router from '@/router';

interface ModuleType {
  routes: (router: Router) => void;
}

interface ModuleObjectType {
  [key: string]: ModuleType;
}

const registerModule = (module: ModuleType) => {
  if (module.routes) {
    module.routes(router);
  }
};

export const registerModules = (modules: ModuleObjectType) => {
  Object.keys(modules).forEach((moduleKey) => {
    const module = modules[moduleKey];
    registerModule(module);
  });
};
