import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store';

interface UseDetailPageOptions<T> {
  selector: (state: RootState) => {
    selectedItem: T | null;
    loading: boolean;
    error: string | null;
  };
  fetchAction: (id: number) => unknown;
  clearAction: () => unknown;
  backRoute: string;
  idParamName?: string;
}

const useDetailPage = <T>({
  selector,
  fetchAction,
  clearAction,
  backRoute,
  idParamName = 'id',
}: UseDetailPageOptions<T>) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Memoize the selector result to prevent unnecessary re-renders
  const selectorResult = useSelector(selector, shallowEqual);
  const { selectedItem, loading, error } = selectorResult;

  const id = params[idParamName];

  useEffect(() => {
    dispatch(clearAction() as any);
    if (id) {
      dispatch(fetchAction(+id) as any);
    }
  }, [id, dispatch, fetchAction, clearAction]);

  const handleBack = () => {
    navigate(backRoute);
  };

  return {
    id,
    selectedItem,
    loading,
    error,
    handleBack,
  };
};

export default useDetailPage;
