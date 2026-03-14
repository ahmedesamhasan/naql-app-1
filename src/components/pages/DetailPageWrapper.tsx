import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import LoadingState from "../common/LoadingState/LoadingState";
import ErrorState from "../common/ErrorState/ErrorState";

interface DetailPageWrapperProps<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
  notFoundMessage?: string;
  onBack: () => void;
  backLabel?: string;
  children: ReactNode;
}

const DetailPageWrapper = <T,>({
  loading,
  error,
  data,
  notFoundMessage = "Item not found",
  onBack,
  backLabel,
  children,
}: DetailPageWrapperProps<T>) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return (
      <ErrorState
        error={error}
        message={notFoundMessage}
        onBack={onBack}
        backLabel={backLabel}
      />
    );
  }

  return <Box className="grid justify-stretch items-start gap-6">{children}</Box>;
};

export default DetailPageWrapper;

