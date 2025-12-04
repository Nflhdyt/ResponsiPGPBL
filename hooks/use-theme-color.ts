/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import AppColors from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof AppColors
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme]; // This part is still useful for overrides

  if (colorFromProps) {
    return colorFromProps;
  } else if (colorName === 'text') {
    return AppColors.textPrimary;
  } else if (colorName === 'primary') {
    return AppColors.primary;
  }
  // Fallback for other colorNames not directly mapped, or if AppColors becomes more complex
  return AppColors[colorName] || AppColors.textPrimary;
}
