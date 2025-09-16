import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (arg) => ({ url: `/category`, method: "GET", params: arg }),
      providesTags: [tagTypes.categories],
    }),

    createCategory: builder.mutation({
      query: (data) => ({ url: `/category/add`, method: "POST", body: data }),
      invalidatesTags: [tagTypes.categories],
    }),

    editCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.categories],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.categories],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
