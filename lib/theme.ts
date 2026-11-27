// RSF brand tokens, from the RSF brand guidelines.
// Usage split: blue 40%, off-white 25%, black 20%, volt 10%, orange 3%, white 2%.
export const brand = {
  blue: '#25B1E3',
  offWhite: '#F6F8F5',
  volt: '#CAD632',
  orange: '#ED701B',
  black: '#212120',
  white: '#FFFFFF',
};

export const colors = {
  light: {
    bg: brand.offWhite,
    card: brand.white,
    ink: brand.black,
    mute: '#5E5E5B',
    line: '#DDE1DA',
  },
  dark: {
    bg: '#1A1A19',
    card: '#262624',
    ink: brand.offWhite,
    mute: '#A9AAA5',
    line: '#363633',
  },
};

export type Palette = typeof colors.light;

// Web-safe stand-ins: JetBrains Mono for Config Mono (headlines),
// DM Sans (body, as in the guide), Poppins bold italic for ITC Avant Garde (accent),
// Archivo light for the wide "RSF" wordmark (Manifold Extd stand-in).
// Swap in the licensed brand fonts when available.
export const fonts = {
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
  body: 'DMSans_400Regular',
  bodyLight: 'DMSans_300Light',
  bodyMedium: 'DMSans_500Medium',
  accent: 'Poppins_800ExtraBold_Italic',
  wordmark: 'Archivo_300Light',
};
