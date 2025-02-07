import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://aivitylaybzlpdvfduyl.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdml0eWxheWJ6bHBkdmZkdXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzYzMTcsImV4cCI6MjA1NDE1MjMxN30.zO4KIR8mE2Un9aA_14vRP2QV8sO1-_gOr1mpqfOPLCY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

