import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formId, answers } = body;

    const response = await prisma.response.create({
      data: {
        formId,
        answers: {
          create: Object.entries(answers).map(([elementId, value]) => ({
            elementId,
            value: String(value),
          })),
        },
      },
    });

    return NextResponse.json({ success: true, response }, { status: 201 });
  } catch (error) {
    console.error('[RESPONSES_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
