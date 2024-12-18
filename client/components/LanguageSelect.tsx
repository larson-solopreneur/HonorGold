import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSelect() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ja')}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('settings.language')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('settings.language')}</SelectLabel>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ja">日本語</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}