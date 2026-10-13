import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { errorMessage, useApi } from './api.js';

const Ctx = createContext(null);

export function MeProvider({ children }) {
  const api = useApi();
  const [me, setMe] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get('/user/me');
      setMe(data);
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, [api]);

  useEffect(() => { refresh(); }, [refresh]);
  const value = useMemo(() => ({ me, error, refresh }), [me, error, refresh]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMe = () => useContext(Ctx);
export const useLocked = (tool) => {
  const { me } = useMe();
  return Boolean(tool.premium && me && !me.premium);
};
