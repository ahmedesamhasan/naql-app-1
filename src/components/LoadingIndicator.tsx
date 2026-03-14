import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

type LoadingIndicatorProps = {
  size?: number;
};

const LoadingIndicator = ({ size = 50 }: LoadingIndicatorProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingIndicator;
