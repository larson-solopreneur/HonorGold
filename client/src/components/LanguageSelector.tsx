import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {t('settings.language.title')}
      </div>
      <Select
        value={i18n.language}
        onValueChange={(value) => i18n.changeLanguage(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('settings.language.select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('settings.language.english')}</SelectItem>
          <SelectItem value="ja">{t('settings.language.japanese')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
