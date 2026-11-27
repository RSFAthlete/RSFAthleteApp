import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Null until the Supabase settings are filled in (.env). Screens fall back to sample data.
export const supabase =
  url && anon
    ? createClient(url, anon, {
        auth: {
          storage: Platform.OS === 'web' ? undefined : AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
