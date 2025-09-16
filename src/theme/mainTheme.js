export const mainTheme = {
  token: {
    colorPrimary: "#907a69",
    colorInfo: "#907a69",
    colorError: "#ca0b00",
  },

  components: {
    Menu: {
      itemBg: "transparent",
      itemColor: "var(--primary-white)",
      itemHoverBg: "var(--primary)",
      itemHoverColor: "var(--primary-white)",
      itemSelectedBg: "var(--primary)",
      itemSelectedColor: "var(--primary-white)",
      iconSize: 17,
      itemMarginBlock: 10,
      itemHeight: 56,
      itemPaddingInline: 1,
    },

    Table: {
      headerBg: "var(--primary)",
      headerSplitColor: "white",
      headerColor: "rgb(248, 250, 252)",
      colorBgContainer: "var(--foundation-white-darker)",
      cellFontSize: 16,
      colorText: "var(--primary-white)",
      borderColor: "rgba(255, 255, 255, 0.18)",
      headerFilterHoverBg: "transparent",
      rowHoverBg: "rgba(50, 43, 37, 0.525)",
      filterDropdownMenuBg: "var(--primary)",
      filterDropdownBg: "var(--primary)",
    },

    Button: {
      colorPrimary: "var(--primary)",
      colorBgContainerDisabled: "gray",
    },

    Input: {
      colorBorder: "var(--input-border)",
      activeBorderColor: "var(--primary)",
      controlHeight: 38,
    },

    Select: {
      colorBorder: "var(--input-border)",
    },

    DatePicker: {
      controlHeight: 40,
      colorBorder: "var(--secondary)",
    },

    Tabs: {
      itemColor: "white",
      itemActiveColor: "var(--primary)",
    },

    Pagination: {
      itemActiveBg: "var(--primary)",
      colorBgContainer: "#000000",
      colorText: "#ffffff",
      colorPrimary: "#ffffff",
      colorBgTextHover: "var(--primary)",
    },

    Spin: {
      colorPrimary: "var(--primary)",
    },
    Segmented: {
      itemColor: "var(--primary-white)",
      trackBg: "var(--primary)",
    },

    Empty: {
      colorTextDescription: "var(--primary-white)",
    },
  },
};