import type { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';

/**
 * Generic entity hook configuration
 */
interface UseEntityConfig<T> {
  selector: (state: RootState) => {
    items: T[];
    loading: boolean;
    error: string | null;
  };
  fetchAction: (params?: unknown) => AnyAction;
  autoFetch?: boolean;
  fetchParams?: unknown;
  cacheKey?: string;
}

/**
 * Generic hook to fetch and access entity data
 * Similar to useVehicleTypes but works with any entity
 *
 * @example
 * const { items, loading, error, refetch } = useEntity({
 *   selector: (state) => ({
 *     items: state.vehicleTypes.vehicleTypes,
 *     loading: state.vehicleTypes.loading,
 *     error: state.vehicleTypes.error,
 *   }),
 *   fetchAction: fetchVehicleTypes,
 *   autoFetch: true,
 * });
 */
export const useEntity = <T>({
  selector,
  fetchAction,
  autoFetch = false,
  fetchParams,
  cacheKey,
}: UseEntityConfig<T>) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { items, loading, error } = useSelector(selector);
  const hasFetchedRef = useRef(false);
  const cacheKeyRef = useRef<string | null>(null);

  // Memoize selector to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [items]);

  useEffect(() => {
    // Only fetch if autoFetch is enabled and we haven't fetched yet
    if (autoFetch && items.length === 0 && !loading && !hasFetchedRef.current) {
      // Check cache key if provided
      if (cacheKey) {
        if (cacheKeyRef.current === cacheKey) {
          return; // Already fetched for this cache key
        }
        cacheKeyRef.current = cacheKey;
      }

      hasFetchedRef.current = true;
      dispatch(fetchAction(fetchParams as unknown) as unknown as AnyAction);
    }
  }, [autoFetch, items.length, loading, dispatch, fetchAction, fetchParams, cacheKey]);

  const refetch = (params?: unknown) => {
    hasFetchedRef.current = false;
    if (cacheKey) {
      cacheKeyRef.current = null;
    }
    dispatch(fetchAction(params || fetchParams) as unknown as AnyAction);
  };

  return {
    items: memoizedItems as T[],
    loading,
    error,
    refetch,
  };
};

export default useEntity;
