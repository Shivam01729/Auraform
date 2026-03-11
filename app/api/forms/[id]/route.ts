import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const form = await prisma.form.findUnique({
      where: { id },
    });

    if (!form || form.userId !== userId) {
      return NextResponse.json({ error: 'Form not found or unauthorized' }, { status: 404 });
    }

    await prisma.form.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[FORM_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        elements: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error('[FORM_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const form = await prisma.form.findUnique({
      where: { id },
    });

    if (!form || form.userId !== userId) {
      return NextResponse.json({ error: 'Form not found or unauthorized' }, { status: 404 });
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, form: updatedForm });
  } catch (error) {
    console.error('[FORM_PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
