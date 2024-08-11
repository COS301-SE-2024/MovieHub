import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smpxgyiogmxexcsfkkuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcHhneWlvZ214ZXhjc2Zra3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNzQ0MDksImV4cCI6MjAzNTk1MDQwOX0.gnVUUMsFOHHTukiq2jJNZjtJtkDYePSBKvsswrv_r-I';
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: AsyncStorage,
      detectSessionInUrl: false,
    },
  })
