import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const unwrap = (response) => response?.data ?? response;

const incomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: ({ currency = "BDT" } = {}) => ({ url: "/admin-dashboard/overview", params: { currency } }),
      providesTags: [tagTypes.income],
      transformResponse: unwrap,
    }),
    getIncomeHistory: builder.query({
      query: (params) => ({ url: "/admin-dashboard/income-history", params }),
      providesTags: [tagTypes.incomes],
      transformResponse: (response) => {
        const payload = unwrap(response) ?? {};
        return { records: Array.isArray(payload.data) ? payload.data : [], summary: payload.summary ?? {}, meta: payload.meta ?? {} };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetOverviewQuery, useGetIncomeHistoryQuery } = incomeApi;
export default incomeApi;
