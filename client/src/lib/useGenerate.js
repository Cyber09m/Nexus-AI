import { useCallback, useState } from 'react';
import { errorCode, errorMessage, useApi } from './api.js';
import { useMe } from './me.jsx';

export function useGenerate(path) {
  const api = useApi();
  const { refresh } = useMe();
  const [state, setState] = useState({ loading: false, error: null, code: null, data: null });

  const run = useCallback(async (body) => {
    setState({ loading: true, error: null, code: null, data: null });
    try {
      const { data } = await api.post(path, body);
      setState({ loading: false, error: null, code: null, data });
      refresh();
      return data;
    } catch (e) {
      setState({ loading: false, error: errorMessage(e), code: errorCode(e), data: null });
      return null;
    }
  }, [api, path, refresh]);

  const reset = useCallback(() => setState({ loading: false, error: null, code: null, data: null }), []);
  return { ...state, run, reset };
}
