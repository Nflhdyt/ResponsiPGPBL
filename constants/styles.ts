import { StyleSheet } from 'react-native';
import { AppColors } from './theme';

export const globalStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: AppColors.background,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: AppColors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: AppColors.textPrimary,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: AppColors.inputBackground,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  secondaryButtonText: {
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 25,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  outlineButtonText: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
