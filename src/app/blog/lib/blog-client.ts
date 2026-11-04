import { BlogClient } from 'babylovegrowth-next-js-blog';
import { REVALIDATE_SECONDS } from '../constants';

export const blog = new BlogClient({
  apiKey: process.env.BABYLOVEGROWTH_BLOG_API_KEY,
  // Defaults to the production API. Set BABYLOVEGROWTH_BLOG_API_URL to point at a
  // staging/local backend (e.g. http://localhost:8000/api/integrations/v1).
  baseUrl: process.env.BABYLOVEGROWTH_BLOG_API_URL,
  revalidate: REVALIDATE_SECONDS,
});
