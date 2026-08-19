import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const normalizeList = (res) => {
  const payload = res?.data ?? res ?? {};
  return { records: Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [], meta: payload.meta ?? {} };
};

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: (arg) => ({ url: "/coupon", method: "GET", params: arg }),
      providesTags: [tagTypes.coupons],
      transformResponse: normalizeList,
    }),

    getCouponById: builder.query({
      query: (id) => ({ url: `/coupon/${id}`, method: "GET" }),
      providesTags: [tagTypes.coupon],
      transformResponse: (res) => res?.data ?? res,
    }),

    createCoupon: builder.mutation({
      query: (data) => ({ url: "/coupon", method: "POST", body: data }),
      invalidatesTags: [tagTypes.coupons],
    }),

    editCoupon: builder.mutation({
      query: ({ id, data }) => ({ url: `/coupon/${id}`, method: "PATCH", body: data }),
      invalidatesTags: [tagTypes.coupons, tagTypes.coupon],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({ url: `/coupon/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.coupons],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useEditCouponMutation,
  useDeleteCouponMutation,
} = couponApi;

export default couponApi;
