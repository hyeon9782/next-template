"use client"

import { createBrowserClient } from "@supabase/ssr"

import { getSupabaseKey, getSupabaseUrl } from "./supabase-env"

export function getBrowserSupabase() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseKey())
}
