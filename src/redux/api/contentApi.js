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
toggleAiGenerationFeatures: builder.mutation({
      query: () => ({ url: `/contents/toggle`, method: "PATCH"}),
      invalidatesTags: [tagTypes.content],
}),
  })
});

export const {
  useGetContentsQuery,
  useToggleAiGenerationFeaturesMutation
} = contentApi;
