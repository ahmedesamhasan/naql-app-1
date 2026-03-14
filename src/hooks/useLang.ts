import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useLang = () => {
  const { t, i18n } = useTranslation('hooks/use_lang');
  const langStorage = import.meta.env.VITE_TOKEN_LANG_STORAGE as string;

  const applyHtmlAttributes = (lang: 'ar' | 'en') => {
    const html = document.documentElement;

    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.body.classList.remove(lang === 'ar' ? 'en' : 'ar');
    document.body.classList.add(lang);

    document.title = t('title');

    const faviconPath = '/images/deziel-no-bg.png';

    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;

    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }

    favicon.href = faviconPath;
  };

  const handleGetLang = () => i18n.language;

  const handleChangeLang = () => {
    const currentLang = localStorage.getItem(langStorage) === 'en' ? 'en' : 'ar';

    const nextLang = currentLang === 'en' ? 'ar' : 'en';

    localStorage.setItem(langStorage, nextLang);
    i18n.changeLanguage(nextLang);
    applyHtmlAttributes(nextLang);
  };

  const handleSetLang = () => {
    let lang = localStorage.getItem(langStorage) as 'ar' | 'en' | null;

    if (!lang) {
      lang = 'ar';
      localStorage.setItem(langStorage, lang);
    }

    i18n.changeLanguage(lang);
    applyHtmlAttributes(lang);
  };

  useEffect(() => {
    handleSetLang();
  }, []);

  return {
    handleChangeLang,
    handleSetLang,
    handleGetLang,
  };
};

export default useLang;
