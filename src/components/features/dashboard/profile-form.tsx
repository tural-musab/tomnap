"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ProfileInput } from '@/app/actions/profile'
import { updateProfileAction } from '@/app/actions/profile'
import { profileSchema } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfileForm({
  initial,
}: {
  initial: Partial<ProfileInput>
}) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues: initial })

  async function onUploadAvatar(file: File) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `avatars/${user.id}.${ext}`
    const { error: upErr } = await supabase.storage.from('public').upload(path, file, { upsert: true })
    if (!upErr) {
      const { data } = supabase.storage.from('public').getPublicUrl(path)
      setValue('avatar_url', data.publicUrl)
    }
  }

  const onSubmit = async (values: ProfileInput) => {
    setSaving(true)
    const res = await updateProfileAction(values)
    setSaving(false)
    if (!res.ok) {
      // basit bildirim
      alert(typeof res.error === 'string' ? res.error : 'Doğrulama hatası')
    } else {
      alert('Profil güncellendi')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/90">Kullanıcı Adı</label>
          <Input
            {...register('username')}
            placeholder="kullanici"
            className="rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-500 ring-1 ring-white/40 focus-visible:ring-2 focus-visible:ring-purple-400"
            autoComplete="username"
          />
          {errors.username ? <p className="mt-1 text-xs text-red-300">{errors.username.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/90">Ad Soyad</label>
          <Input
            {...register('full_name')}
            placeholder="Ad Soyad"
            className="rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-500 ring-1 ring-white/40 focus-visible:ring-2 focus-visible:ring-purple-400"
            autoComplete="name"
          />
          {errors.full_name ? <p className="mt-1 text-xs text-red-300">{errors.full_name.message}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/90">Website</label>
          <Input
            {...register('website')}
            placeholder="https://..."
            className="rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-500 ring-1 ring-white/40 focus-visible:ring-2 focus-visible:ring-purple-400"
            inputMode="url"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/90">Konum</label>
          <Input
            {...register('location')}
            placeholder="İzmir, TR"
            className="rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-500 ring-1 ring-white/40 focus-visible:ring-2 focus-visible:ring-purple-400"
            autoComplete="address-level1"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-white/90">Biyografi</label>
        <Textarea
          rows={4}
          {...register('bio')}
          placeholder="Kendinden bahset"
          className="rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-500 ring-1 ring-white/40 focus-visible:ring-2 focus-visible:ring-purple-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-white/90">Avatar</label>
        <input
          className="block w-full rounded-xl bg-white/90 text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-gradient-to-br file:from-purple-600 file:to-pink-600 file:px-4 file:py-2 file:text-white"
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && onUploadAvatar(e.target.files[0])}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:opacity-90">
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>
    </form>
  )
}


