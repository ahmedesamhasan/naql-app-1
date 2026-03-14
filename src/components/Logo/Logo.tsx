import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import i18n from '../../i18n';
import DizieLIcon from '../../icons/JeeteakIcon';
import type { LogoTypes } from '../../types/components';

const Logo = ({ theme = 'light', className, noHome, variant }: LogoTypes) => {
  const currentLang = i18n.language;
  const lang: 'ar' | 'en' = currentLang === 'ar' ? 'ar' : 'en';

  const renderImage =
    theme === 'light' ? (
      <DizieLIcon
        lang={lang}
        className={`${
          variant === 'logo' ? 'h-[40px] !w-auto md:h-[35px] sm:!h-[30px]' : ''
        } ${className}`}
      />
    ) : (
      <DizieLIcon
        lang={lang}
        className={`${
          variant === 'logo' ? 'h-[40px] !w-auto md:h-[35px] sm:!h-[30px]' : ''
        } ${className}`}
      />
    );

  return noHome ? (
    renderImage
  ) : (
    <Box
      component={Link}
      to='/dashboard'
      aria-label='Go to dashboard'
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
        minWidth: 0,
        borderRadius: 0,
        boxShadow: 'none',
        textDecoration: 'none',
        lineHeight: 0,

        '&:hover': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },

        '&:focus': {
          outline: 'none',
        },

        '&:focus-visible': {
          outline: '2px solid rgba(255,255,255,0.6)',
          outlineOffset: '2px',
        },
      }}
    >
      {renderImage}
    </Box>
  );
};

export default Logo;
