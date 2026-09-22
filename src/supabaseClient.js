import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bshsvcgfhqmsctsufyan.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaHN2Y2dmaHFtc2N0c3VmeWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MDA3MTcsImV4cCI6MjEwNTQ3NjcxN30.-F68ibSwQqZDXhbopAH5Y9wSEoQ2jV6Y3FScZZbo6YQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
