import {
  RecoilValue,
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
} from 'recoil';

export function usePageInfo<T>(recoilValue: RecoilValue<T>) {
  const { state, contents } = useRecoilValueLoadable(recoilValue);
  const reload = useRecoilRefresher_UNSTABLE(recoilValue);
  return {
    state,
    reload,
    contents: state === 'hasValue' ? contents : undefined,
  };
}
