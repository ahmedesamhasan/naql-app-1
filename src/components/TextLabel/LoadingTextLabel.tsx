import { Box } from '@mui/material';
import LoadingText from '../LoadingText/LoadingText';

/**
 * LoadingTextLabel Component
 * Displays a skeleton/loading state for text labels with variant styling
 */
const LoadingTextLabel = ({
  variant,
  noTitle,
}: {
  variant?: 'employee' | 'member' | 'payment' | 'user' | 'network' | 'package';
  noTitle?: boolean;
}) => {
  // Determine border and background styling based on variant
  const isEmployeePackageOrNetwork =
    variant === 'employee' || variant === 'package' || variant === 'network';
  const isMemberOrUser = variant === 'member' || variant === 'user';

  const boxClasses = isEmployeePackageOrNetwork
    ? 'border-[1px] border-solid border-text_label_border'
    : isMemberOrUser
    ? '!bg-[#F4F4F4] border-[1px] border-solid border-[#EEEEEE]'
    : '';

  return (
    <Box className={`grid justify-stretch items-center gap-1`}>
      {!noTitle && <LoadingText width={100} unit={'px'} />}
      <Box
        className={`bg-white rounded-md px-4 py-[10px] flex justify-start items-center ${boxClasses}`}
      >
        <LoadingText />
      </Box>
    </Box>
  );
};

export default LoadingTextLabel;
