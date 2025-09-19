import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

 

const sliderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSliders: builder.query({
      query: (arg) => ({ url: `/slider`, method: "GET", params: arg }),
      providesTags: [tagTypes.categories],
    }),

    createSlider: builder.mutation({
      query: (data) => ({ url: `/slider`, method: "POST", body: data }),
      invalidatesTags: [tagTypes.categories],
    }),

    editSlider: builder.mutation({
      query: ({ id, data }) => ({
        url: `/slider/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.categories],
    }),

    deleteSlider: builder.mutation({
      query: (id) => ({
        url: `/slider/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.categories],
    }),
  }),
});

export const { 
    useGetAllSlidersQuery,
    useCreateSliderMutation,
    useEditSliderMutation,
    useDeleteSliderMutation
} = sliderApi;
