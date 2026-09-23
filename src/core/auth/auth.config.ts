import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/core/database/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      id: 'google-demo',
      name: 'Google Demo Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'tu_correo@gmail.com' },
        name: { label: 'Nombre', type: 'text', placeholder: 'Tu Nombre' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        const email = credentials.email.toLowerCase().trim()
        const name = credentials.name || email.split('@')[0]

        let user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name,
              image: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
            },
          })
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || 'Cliente Juegos de Mesa',
                image: user.image,
              },
            })
          }

          // Auto-crear en la tabla Cliente para que aparezca en el gestor administrativo
          for (const neg of ['BG', '3D']) {
            const existingClient = await prisma.cliente.findFirst({
              where: { email: user.email, negocio: neg }
            })
            
            if (!existingClient) {
              let newName = user.name || 'Cliente Web'
              let count = 1
              while(await prisma.cliente.findUnique({ where: { nombre_negocio: { nombre: newName, negocio: neg} } })) {
                newName = `${user.name} (${count})`
                count++
              }
              await prisma.cliente.create({
                data: {
                  nombre: newName,
                  email: user.email,
                  negocio: neg,
                  canalOrigen: 'Web Store (Google)'
                }
              })
            }
          }
        } catch (e) {
          console.error('Error sincronizando usuario Google:', e)
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret-board-games-store-token',
}
