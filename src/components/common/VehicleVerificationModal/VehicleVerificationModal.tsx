import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { handleToaster } from '../../../functions/handleToaster';
import CheckCircleIcon from '../../../icons/CheckCircleIcon';
import { BasicButton } from '../../../mui/buttons/BasicButton';
import { GradientButton } from '../../../mui/buttons/GradientButton';
import type { AppDispatch } from '../../../store/store';
import { fetchVehicles, verifyVehicle } from '../../../store/vehiclesSlice';
import RejectionReasonModal from '../RejectionReasonModal/RejectionReasonModal';

interface VehicleVerificationModalProps {
  open: boolean;
  onClose: () => void;
  vehicleId: number;
  currentStatus?: string;
}

const VehicleVerificationModal = ({
  open,
  onClose,
  vehicleId,
  currentStatus,
}: VehicleVerificationModalProps) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch<AppDispatch>();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      await dispatch(verifyVehicle({ id: vehicleId, action: 'verify' })).unwrap();
      handleToaster({
        msg: t('vehicleVerified', { defaultValue: 'Vehicle verified successfully' }),
        status: 'success',
      });
      // Refresh vehicles list
      dispatch(fetchVehicles({ page: 1, limit: 10 }));
      onClose();
    } catch (error: unknown) {
      const err = error as Record<string, unknown> | undefined;
      handleToaster({
        msg:
          (err?.message as string) ||
          t('vehicleVerifyError', { defaultValue: 'Failed to verify vehicle' }),
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleConfirmRejection = async (reason: string) => {
    try {
      setLoading(true);
      await dispatch(verifyVehicle({ id: vehicleId, action: 'reject', notes: reason })).unwrap();
      handleToaster({
        msg: t('vehicleRejected', { defaultValue: 'Vehicle rejected successfully' }),
        status: 'success',
      });
      // Refresh vehicles list
      dispatch(fetchVehicles({ page: 1, limit: 10 }));
      setShowRejectModal(false);
      onClose();
    } catch (error: unknown) {
      const err = error as Record<string, unknown> | undefined;
      handleToaster({
        msg:
          (err?.message as string) ||
          t('vehicleRejectError', { defaultValue: 'Failed to reject vehicle' }),
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const isVerified = currentStatus === 'verified';
  const isRejected = currentStatus === 'rejected';

  return (
    <>
      <Dialog open={open && !showRejectModal} onClose={onClose} maxWidth='sm' fullWidth>
        <DialogTitle>
          {t('vehicleVerification', { defaultValue: 'Vehicle Verification' })}
        </DialogTitle>
        <DialogContent>
          <Box className='mt-4 text-center'>
            <Typography variant='body1' className='!mb-4'>
              {isVerified
                ? t('vehicleAlreadyVerified', { defaultValue: 'This vehicle is already verified.' })
                : isRejected
                ? t('vehicleAlreadyRejected', { defaultValue: 'This vehicle has been rejected.' })
                : t('vehicleVerificationQuestion', {
                    defaultValue: 'What action would you like to perform on this vehicle?',
                  })}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className='!p-4 !pt-2'>
          <BasicButton onClick={onClose} disabled={loading}>
            {t('cancel', { defaultValue: 'Cancel' })}
          </BasicButton>
          {!isVerified && !isRejected && (
            <>
              <BasicButton
                onClick={handleReject}
                className='!bg-red-50 !text-red-600 hover:!bg-red-100 !border-red-200 !border'
                disabled={loading}
              >
                {t('reject', { defaultValue: 'Reject' })}
              </BasicButton>
              <GradientButton onClick={handleVerify} disabled={loading}>
                <CheckCircleIcon className='w-4 h-4 mr-2' />
                {t('verify', { defaultValue: 'Verify' })}
              </GradientButton>
            </>
          )}
        </DialogActions>
      </Dialog>

      <RejectionReasonModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmRejection}
        title={t('rejectVehicle', { defaultValue: 'Reject Vehicle' })}
        label={t('rejectionReason', { defaultValue: 'Rejection Reason' })}
        placeholder={t('enterRejectionReason', {
          defaultValue: 'Enter the reason for rejecting this vehicle',
        })}
      />
    </>
  );
};

export default VehicleVerificationModal;
