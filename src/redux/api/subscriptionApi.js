import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const normalizeList = (res) => {
  const payload = res?.data ?? res ?? {};
  return { records: Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [], meta: payload.meta ?? {} };
};

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query({
      query: (arg) => ({ url: "/subscription", method: "GET", params: arg }),
      providesTags: [tagTypes.subscriptions],
      transformResponse: normalizeList,
    }),

    getSubscriptionById: builder.query({
      query: (id) => ({ url: `/subscription/${id}`, method: "GET" }),
      providesTags: [tagTypes.subscription],
      transformResponse: (res) => res?.data ?? res,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllSubscriptionsQuery, useGetSubscriptionByIdQuery } = subscriptionApi;

export default subscriptionApi;
