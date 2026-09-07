import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const adsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAds: builder.query({
      query: (params) => ({
        url: "/ads",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.ads],
    }),
    getAdById: builder.query({
      query: (id) => ({
        url: `/ads/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.ads, id }],
    }),
    createAd: builder.mutation({
      query: (body) => ({
        url: "/ads",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.ads],
    }),
    updateAd: builder.mutation({
      query: ({ id, body }) => ({
        url: `/ads/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.ads],
    }),
    deleteAd: builder.mutation({
      query: (id) => ({
        url: `/ads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ads],
    }),
  }),
});

export const {
  useGetAllAdsQuery,
  useGetAdByIdQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
} = adsApi;
