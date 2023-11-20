'use client';

import ActionIcon from 'components/input/action-icon';
import useLanguage from 'hooks/use-language';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <ActionIcon className='uppercase' onClick={() => toggleLanguage()}>
      {language === 'sv' ? 'en' : 'sv'}
    </ActionIcon>
  );
};

export default LanguageSwitcher;
