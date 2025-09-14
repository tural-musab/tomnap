'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { register, loginWithGoogle, loginWithGithub } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User, Chrome, Github, ShoppingBag, CheckCircle, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await register(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.')
        router.push('/feed')
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string'
            ? (error as { message: string }).message
            : 'Bir hata oluştu'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  function checkPasswordStrength(password: string) {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    setPasswordStrength(strength)
  }

  async function handleGoogleLogin() {
    setIsLoading(true)
    try {
      const result = await loginWithGoogle()
      if (result?.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Google ile kayıt yapılamadı')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGithubLogin() {
    setIsLoading(true)
    try {
      const result = await loginWithGithub()
      if (result?.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('GitHub ile kayıt yapılamadı')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                TomNAP
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Hemen üye olun, fırsatları kaçırmayın
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center">Hesap Oluştur</CardTitle>
              <CardDescription className="text-center">
                Sosyal ticaret deneyimine başlayın
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="relative hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                  className="relative hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                    veya email ile
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Kullanıcı adı"
                      required
                      disabled={isLoading}
                      className="pl-10"
                      pattern="[a-zA-Z0-9_]+"
                      title="Sadece harf, rakam ve _ kullanabilirsiniz"
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Ad Soyad"
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email adresiniz"
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Şifre (min. 6 karakter)"
                      required
                      disabled={isLoading}
                      className="pl-10"
                      minLength={6}
                      onChange={(e) => checkPasswordStrength(e.target.value)}
                    />
                  </div>
                  
                  {/* Password Strength Indicator */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength >= level
                            ? level <= 2
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Şifre tekrar"
                    required
                    disabled={isLoading}
                    className="pl-10"
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 rounded border-gray-300"
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      <Link href="/terms" className="text-purple-600 hover:underline">
                        Kullanım Koşulları
                      </Link>
                      {' '}ve{' '}
                      <Link href="/privacy" className="text-purple-600 hover:underline">
                        Gizlilik Politikası
                      </Link>
                      &apos;nı kabul ediyorum
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Üye Ol
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 w-full">
                Zaten hesabınız var mı?{' '}
                <Link
                  href="/login"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
                >
                  Giriş yapın
                </Link>
              </p>
            </CardFooter>
          </Card>

          {/* Benefits */}
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Üye olduğunuzda:
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                Özel indirimler
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                Hızlı checkout
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                Sipariş takibi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
