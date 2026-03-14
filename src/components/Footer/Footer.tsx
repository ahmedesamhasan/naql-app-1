import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PrimaryBox } from '../../mui/boxes/PrimaryBox';
import { PrimaryContainer } from '../../mui/containers/PrimaryContainer';

/**
 * DizieL Footer Component
 * Displays copyright and brand information at the bottom of every page
 * Uses i18n for localized rights text and branding
 */
const Footer = () => {
  const { t } = useTranslation('components/footer');

  return (
    <Box component={'footer'} className='bg-white h-[60px] w-full'>
      <PrimaryBox>
        <PrimaryContainer className='!flex justify-start items-center'>
          <Typography variant='subtitle1' className='!font-[700]'>
            © {new Date().getFullYear()} <span className='text-primary'>{t('brandName')}</span> .{' '}
            {t('rightsReserved')}
          </Typography>
        </PrimaryContainer>
      </PrimaryBox>
    </Box>
  );
};

export default Footer;
