import { tagTypes } from "../tagtypes";
import { baseApi } from "./baseApi";

const normalizeList = (res) => {
  const payload = res?.data ?? res ?? {};
  return { records: Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [], meta: payload.meta ?? {} };
};

const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPackages: builder.query({
      query: (arg) => ({ url: "/package", method: "GET", params: arg }),
      providesTags: [tagTypes.packages],
      transformResponse: normalizeList,
    }),

    getPackageById: builder.query({
      query: (id) => ({ url: `/package/${id}`, method: "GET" }),
      providesTags: [tagTypes.package],
      transformResponse: (res) => res?.data ?? res,
    }),

    createPackage: builder.mutation({
      query: (data) => ({ url: "/package", method: "POST", body: data }),
      invalidatesTags: [tagTypes.packages],
    }),

    editPackage: builder.mutation({
      query: ({ id, data }) => ({ url: `/package/${id}`, method: "PATCH", body: data }),
      invalidatesTags: [tagTypes.packages, tagTypes.package],
    }),

    deletePackage: builder.mutation({
      query: (id) => ({ url: `/package/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.packages],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllPackagesQuery,
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useEditPackageMutation,
  useDeletePackageMutation,
} = packageApi;

export default packageApi;
