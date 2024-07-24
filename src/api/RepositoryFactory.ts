import postsRepository from './postsRepository';
interface Repositories {
  [key: string]: any;
}

// this will act like a routing table for our api's
const repositories: Repositories = {
  posts: postsRepository,
  // other apis
};

// api's will only be accessed through this factory
export const RepositoryFactory = {
  get: (name: string) => repositories[name],
};
