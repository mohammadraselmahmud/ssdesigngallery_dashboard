import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (arg) => ({
        url: `/product`,
        method: "GET",
        params: arg,
      }),

      providesTags: [tagTypes.slider],
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        url: `/product`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.slider],
    }),

    editProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: [tagTypes.slider],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.slider],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useEditProductMutation,
  useAddProductMutation,
  useDeleteProductMutation
} = productsApi;
