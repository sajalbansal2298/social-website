import { catalogUrl, catalogApiKey } from '@/config';
import classInstanceProvider from '@/tools/classInstanceProvider';

import { RequestInterceptor } from './request-interceptors';

export interface AllCourses {
  courses: any[];
  webinars: any[];
  workshops: any[];
}

export class TestAPI extends RequestInterceptor {
  constructor() {
    super(catalogUrl, catalogApiKey);
  }

  // LearnApp Validate Coupon
  async doGetContent(): Promise<void> {
    const data = await this.get<AllCourses>('/catalog/discover');

    console.log(data);
  }
}

export const api = classInstanceProvider.getInstance(TestAPI);
