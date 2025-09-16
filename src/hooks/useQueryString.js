"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useQueryString() {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (query) => {
      const queryParams = new URLSearchParams(searchParams.toString());

      for (const key in query) {
        queryParams.set(key, query[key]);
      }

      return queryParams;
    },
    [searchParams],
  );

  return { createQueryString };
}
