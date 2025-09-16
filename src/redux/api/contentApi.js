import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContents: builder.query({
      query: (query) => ({
        url: "/contents",
        method: "GET",
        params: query,
      }),

      providesTags: [tagTypes.content],
    }),

    updateContent: builder.mutation({
      query: (data) => ({
        url: `/contents`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.content],
    }),
  }),
});

export const { useGetContentsQuery, useUpdateContentMutation } = contentApi;
