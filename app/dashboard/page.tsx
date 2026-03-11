import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '../../lib/prisma';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id;

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

  return <DashboardClient forms={formattedForms} email={session.user.email || ''} />;
}
