import Respository from './Respository';

const resource = '/posts';

interface Post {
  id: string;
  text: string;
  title: string;
  userId: string;
}
// this is comparable to our catalog api or other api's
export default {
  get() {
    return Respository.get(`${resource}`);
  },
  create(payload: Post) {
    return Respository.post(`${resource}`, payload);
  },

  update(id: string, payload: Post) {
    return Respository.put(`${resource}/${id}`, payload);
  },

  delete(id: string) {
    return Respository.delete(`${resource}/${id}`);
  },
};
