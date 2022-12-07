import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import es from 'vuetify/es5/locale/es'
import en from 'vuetify/es5/locale/en'

Vue.use(Vuetify, {
  theme: {
    // primary: '#ee44aa',
    // secondary: '#424242',
    // accent: '#82B1FF',
    // error: '#FF5252',
    // info: '#2196F3',
    // success: '#4CAF50',
    // warning: '#FFC107'
      black_gray: '#23343E',
      dark_gray: '#344955',
      light_gray: '#ADC0CB',
      white_gray: '#E8F0F6',
      dark_yellow: '#F9AA33',
      light_yellow: '#FFF5A0',
      white_yellow: '#FFFDE8',
      iching_red: '#BF360C',
      primary: '#121212',
      secondary: 'rgba(52, 73, 85, 0.48)',
      accent: '#03a9f4',
      error: '#ff9800',
      warning: '#ffeb3b',
      info: '#3f51b5',
      success: '#8bc34a'
  },
  options: {
    customProperties: true
  },
  iconfont: 'fa',
  lang: {
    locales: { es, en },
    current: 'es'
  },
})
