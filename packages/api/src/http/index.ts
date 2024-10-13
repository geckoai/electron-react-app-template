import { AxiosError } from '@geckoai/axios';
import { HttpClient, HttpException } from '@geckoai/http';
import { notification } from '@packages/components';
import qs from 'qs';

export const API = HttpClient.create({
  baseURL: process.env.API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
});

const EXCLUDE_CODE_URLS = ['/api/device-service/store/device/lookOver'];

API.interceptors.response.use(
  (res) => {
    const { data, config } = res;
    if (
      !(data instanceof ArrayBuffer) &&
      data.code !== '200' &&
      // Support xml response
      typeof data !== 'string'
    ) {
      if (!EXCLUDE_CODE_URLS.includes(config.url as string)) {
        notification.error({
          message: data.message,
        });
        throw new HttpException(res.config, res, data.message);
      }
    }
    return res;
  },
  (err: AxiosError<any>) => {
    if (err.isAxiosError) {
      if (err.response) {
        const { status } = err.response;
        if (status === 401) {
          localStorage.clear();
          window.location.reload();
        }
      }
    }
    return Promise.reject(err);
  }
);
