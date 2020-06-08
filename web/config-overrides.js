// @TODO remettre le code ci-dssous dans celui dans l'Export du bas! JC
// const rewireReactHotLoader = require("react-app-rewire-hot-loader");
//
// module.exports = function override(config, env) {
//   if (env === "development") {
//     config.resolve.alias["react-dom"] = "@hot-loader/react-dom";
//   }
//   config = rewireReactHotLoader(config, env);
//   return config;
// };

const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("antd", {
    libraryDirectory: "es",

    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        "@primary-color": "#61d8c8",
        // '@success-color': '#52c41a', // success state color
        // '@warning-color': #faad14, // warning state color
        // '@error-color: #f5222d', // error state color
        // '@font-size-base': '14px', // major text font size
        "@heading-color": "#0f2e4d", // heading text color
        "@text-color": "#0f2e4d", // major text color
        // '@text-color-secondary': 'rgba(0, 0, 0, .45)', // secondary text color
        // '@disabled-color': 'rgba(0, 0, 0, .25)', // disable state color
        // '@border-radius-base': '4px', // major border radius
        // '@border-color-base': '#d9d9d9', // major border color
        // '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)' // major shadow for layers
        "@layout-body-background": "none",
        "@font-family":
          '"Roboto",-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB","Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji","Segoe UI Emoji", "Segoe UI Symbol"',
        "@code-family":
          '"Roboto mono","SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
        "@tooltip-max-width": "250px",
        "@tooltip-color": "#0c243b",
        "@tooltip-bg": "rgba(255, 255, 255, 0.95)",
        "@tooltip-arrow-width": "8px",
        // Tooltip distance with trigger
        "@tooltip-distance": "@tooltip-arrow-width - 1px + 4px",
        // Tooltip arrow color
        "@tooltip-arrow-color": "@tooltip-bg",

        "@btn-primary-color": "#fff",
        "@btn-height-base": "32px",
        "@btn-height-lg": "40px",
        "@btn-height-sm": "24px",
        "@btn-circle-size": "@btn-height-base",
        "@btn-circle-size-lg": "@btn-height-lg",
        "@btn-circle-size-sm": "@btn-height-sm",

        "@link-color": "#6673E5",
        "@link-hover-color": 'color(~`colorPalette("@{link-color}", 5) `)',
        "@link-active-color": 'color(~`colorPalette("@{link-color}", 7) `)',
        "@link-decoration": "none",
        "@link-hover-decoration": "none",
        "@dropdown-vertical-padding": "10px",

        // Alert
        "@success-color": "#61d8c8",
        "@alert-success-border-color": "@success-color",
        "@alert-success-bg-color":
          'color(~`colorPalette("@{success-color}", 1) `)',
        "@alert-success-icon-color": "@success-color",
      },
    },
  })
);
