"use client";

import { mainTheme } from "@/theme/mainTheme";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import NextTopLoader from "@/components/NextTopLoader/NextTopLoader";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner"; 

export default function Providers({ children }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={mainTheme}>
        <ReduxProvider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            {children}
          </PersistGate>
        </ReduxProvider>

        <NextTopLoader />
        <Toaster
          position="bottom-center"
          richColors
          duration={3500}
          closeButton
          toastOptions={{
            style: {
              fontFamily: "var(--font-general-sans)",
              fontWeight: 500,
            },
          }}
        />
      </ConfigProvider>
    </AntdRegistry>
  );
}
