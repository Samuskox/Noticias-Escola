import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxrepezpvnfsnaxvzdwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cmVwZXpwdm5mc25heHZ6ZHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MzQyNzMsImV4cCI6MjEwNjQxMDI3M30.lY9DF_j6DNCMaPD_GB0Q1DKcHXUCUgQnM604Dj_3jsA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);