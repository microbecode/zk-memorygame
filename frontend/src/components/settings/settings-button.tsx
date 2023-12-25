import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { useDirection } from '@/lib/hooks/use-direction';
import { useThemeColor } from '@/lib/hooks/use-theme-color';
import { OptionIcon } from '@/components/icons/option';

export default function SettingsButton() {
  const [layout] = useLocalStorage<string>('criptic-layout');
  const [themeColor] = useLocalStorage<string>('criptic-color');

  useDirection(layout ? layout : 'ltr');
  useThemeColor(themeColor ? themeColor : '#323743');

  return (
    <>
      <div className="fixed top-1/2 z-40 -translate-y-1/2 ltr:right-0 rtl:left-0"></div>
    </>
  );
}
