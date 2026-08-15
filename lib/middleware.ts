import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup')
  const isAdminRoute = path.startsWith('/dashboard/admin') || path.startsWith('/admin')
  const isStudentRoute = path.startsWith('/dashboard/student') || path.startsWith('/student')

  // Not logged in → force to login (unless already on an auth route)
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logged in but hitting an auth page → send to their dashboard
  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const dest = profile?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Logged in but trying to access the wrong role's area
  if (user && (isAdminRoute || isStudentRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (isAdminRoute && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url))
    }
    if (isStudentRoute && profile?.role !== 'student') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}