import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';


// Replace with your actual Supabase credentials
const supabaseUrl = 'https://qponzmolafnddttidtkn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwb256bW9sYWZuZGR0dGlkdGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjEzMTEsImV4cCI6MjA1MzM5NzMxMX0.nYKtLD1otMKsrO43L9hZorgOmOujozag23Gwfvhy_us';


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not needed for React Native
  },
});
