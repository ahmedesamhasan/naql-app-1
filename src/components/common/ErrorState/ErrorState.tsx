import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BasicButton } from "../../../mui/buttons/BasicButton";

interface ErrorStateProps {
  error?: string | null;
  message?: string;
  onBack?: () => void;
  backLabel?: string;
  minHeight?: string;
  className?: string;
}

const ErrorState = ({
  error,
  message,
  onBack,
  backLabel = "Back",
  minHeight = "min-h-[400px]",
  className,
}: ErrorStateProps) => {
  const displayMessage = error || message || "Something went wrong";

  return (
    <Box className={`flex flex-col justify-center items-center ${minHeight} gap-4 ${className || ""}`}>
      <Typography variant="h6" className="!text-red-600">
        {displayMessage}
      </Typography>
      {onBack && (
        <BasicButton onClick={onBack}>
          {backLabel}
        </BasicButton>
      )}
    </Box>
  );
};

export default ErrorState;

