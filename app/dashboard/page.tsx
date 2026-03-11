import { auth } from '@clerk/nextjs/server';
import prisma from '../../lib/prisma';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect('/login');
  }

  const forms = await prisma.form.findMany({
    where: { userId },
    include: {
      _count: {
        select: { responses: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedForms = forms.map(f => ({
    id: f.id,
    title: f.title,
    responsesCount: f._count.responses,
    createdAt: f.createdAt.toISOString()
  }));

  const userEmail = (sessionClaims?.email as string) || '';

  return <DashboardClient forms={formattedForms} email={userEmail} />;
}
