import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import prisma from '../../../../lib/prisma';
import { redirect } from 'next/navigation';
import AnalysisClient from './AnalysisClient';

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // @ts-ignore
  const userId = session.user.id;
  const resolvedParams = await params;
  const formId = resolvedParams.id;

  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: {
      elements: {
        orderBy: { orderIndex: 'asc' }
      },
      responses: {
        include: {
          answers: true
        }
      }
    }
  });

  if (!form || form.userId !== userId) {
    redirect('/dashboard');
  }

  // Pass serializable data to client
  // @ts-ignore
  return <AnalysisClient form={form} />;
}
