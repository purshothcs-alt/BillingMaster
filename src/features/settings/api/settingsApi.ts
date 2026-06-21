import { baseApi } from '@/services/api/baseApi';
import type { BusinessSettings } from '../types';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<BusinessSettings, void>({
      query: () => '/settings',
      providesTags: ['Setting'],
    }),
    updateSettings: builder.mutation<BusinessSettings, BusinessSettings>({
      query: (body) => ({ url: '/settings', method: 'PUT', body }),
      invalidatesTags: ['Setting'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
