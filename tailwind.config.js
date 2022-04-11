const { colors: defaultColors } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...defaultColors,
    },
    extend: {
      colors: {
        'side-bar-dark': '#1c1f28',
        'login-wrapper': '#292827',
        'login-input': '#151515',
        'setting-column': '#343332',
        'setting-header': '#222222',
        'setting-option-text': '#888888',
        'iphone-toggle-button': '#FBC308',
        'setting-text-red': '#C0392B',
        'profile-box': '#050505',
        'profile-input': '#242424',
        'profile-font': '#FEFEFE',
        'profile-gender-font': '#363636',
        'profile-gender-text': '#797979',
        'profile-footer-font': '#6F6F6F',
        'pf-bg': '#e2e2e2',
        'left-panel-header-dark': '#2d2f3e',
        'right-panel-header-dark': '#1b1e27',
        'bottom-black-bar': '#101318',
        'add-btn': '#5b6bed',
        'reply-btn': '#6a79f3',
        'search-bar': '#2a2b30',
        'bottom-nav': '#111318',
        'banner-exit': '#AEAEAE',
        'banner-click': 'rgb(229,230,218)',
        'banner-cheeky': 'rgb(233,233,233)',
        'banner-add': 'rgb(231,231,231)',
        'banner-icon': '#7785FF',
        'banner-text': 'rgb(186,186,186)',
        'left-nav-dark': '#1C1F28',
        'top-nav-dark': '#171A1E',
        'right-panel-body-dark': '#2A2D37',
        'left-panel-body-dark': '#2d2f3e',
      },
      backgroundColor: {
        third: '#282B30',
        primary: '#1b1e27',
        secondary: '#ececec',
        fourth: '#52d8e0',
      },
      textColor: {
        icon: '#747474',
        primary: '#ffffff',
        secondary: '#acacab',
        third: '#999999',
        fourth: '#52d8e0',
        fifth: '#7989ff',
        sixth: '#1C1F28',
      },
      borderColor: {
        'outline-add-btn': '#52d8e0',
      },

      minWidth: {
        300: '300px',
        400: '400px',
        150: '150px',
        inherit: 'inherit',
        28: '28px',
      },
      maxWidth: {
        60: '60vw',
        832: '832px',
        inherit: 'inherit',
      },
      width: {
        inherit: 'inherit',
        '7p': '70%',
        '3p': '30%',
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        832: '832px',
        'px-76': '76px',
        'px-80': '80px',
      },
      height: {
        inherit: 'inherit',
        '80p': '83%',
      },
      padding: {
        30: '30px',
      },
      borderWidth: {
        0.5: '0.5px',
        1: '1px',
      },
    },
  },
  variants: {
    extend: {},
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/line-clamp'), require('tailwind-scrollbar-hide')],
};
