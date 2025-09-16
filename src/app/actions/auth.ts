'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
})

const registerSchema = z
  .object({
    email: z.string().email('Geçerli bir email adresi giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    confirmPassword: z.string(),
    username: z
      .string()
      .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
      .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve _ içerebilir'),
    fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })

export async function login(formData: FormData) {
  const supabase = (await createClient()) as SupabaseClient<Database>

  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate
  const validatedData = loginSchema.parse(rawData)

  const { data, error } = await supabase.auth.signInWithPassword({
    email: validatedData.email,
    password: validatedData.password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/feed')
}

export async function register(formData: FormData) {
  const supabase = (await createClient()) as SupabaseClient<Database>

  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    username: formData.get('username') as string,
    fullName: formData.get('fullName') as string,
  }

  // Validate
  const validatedData = registerSchema.parse(rawData)

  // Check if username is taken
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', validatedData.username)
    .single()

  if (existingUser) {
    return { error: 'Bu kullanıcı adı zaten kullanımda' }
  }

  // Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: validatedData.email,
    password: validatedData.password,
    options: {
      data: {
        username: validatedData.username,
        full_name: validatedData.fullName,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    // Create profile
    const profileInsert: Database['public']['Tables']['profiles']['Insert'] = {
      id: authData.user.id,
      username: validatedData.username,
      full_name: validatedData.fullName ?? null,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${validatedData.username}`,
    }

    const { error: profileError } = await supabase.from('profiles').insert(profileInsert)

    if (profileError) {
      return { error: 'Profil oluşturulurken hata oluştu' }
    }
  }

  redirect('/feed')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function loginWithGithub() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email adresi gerekli' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Şifre sıfırlama linki email adresinize gönderildi' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 6) {
    return { error: 'Şifre en az 6 karakter olmalıdır' }
  }

  if (password !== confirmPassword) {
    return { error: 'Şifreler eşleşmiyor' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/feed')
}
