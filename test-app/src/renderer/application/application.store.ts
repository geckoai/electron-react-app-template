import { atom } from 'recoil';

export interface AppStore {
  locale: string;
}

export const ApplicationStoreState = atom<AppStore>({
  key: 'application/store',
  default: {
    locale: 'zh_CN',
  },
});

// export const userInfoState = selector({
//   key: 'app/user/info',
//   get: async ({
//     get,
//   }): Promise<AxiosResponse<{ username: string; id: string }>> => {
//     var appStore = get(ApplicationStoreState);
//
//     return axios.post('', {
//       language: appStore.locale,
//     });
//   },
// });
//
// export const userInfoState1 = selectorFamily({
//   key: 'app/user/info/2',
//   get:
//     (param: { id: string }) =>
//     async ({
//       get,
//     }): Promise<AxiosResponse<{ username: string; id: string }>> => {
//       return axios.post('', {
//         id: param.id,
//       });
//     },
// });
