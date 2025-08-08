import { Platform } from 'react-native';

const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    textWhite: '#ffffff',
    primary: '#0366d6',
    backgroundColor: '#24292e',
    inputBorderColor: '#d0d7de',
    errorState: '#d73a4a',
    platformSpecificColor: Platform.select({
      android: 'green',
      ios: 'blue',
      default: 'black',
    }),
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System',
    }),
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};

export default theme;