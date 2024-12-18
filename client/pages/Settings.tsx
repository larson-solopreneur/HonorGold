import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSelect } from '../components/LanguageSelect';
import { useLanguage } from '../contexts/LanguageContext';

export function Settings() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('settings.title')}</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.language')}</CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageSelect />
          </CardContent>
        </Card>

        {/* その他の設定項目 */}
      </div>
    </div>
  );
}