import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { title, elements } = body;

    // Basic Validation
    if (!title || !elements || !Array.isArray(elements)) {
      return NextResponse.json(
        { error: 'Missing required fields (title, elements array)' },
        { status: 400 }
      );
    }

    // Use a Prisma transaction to ensure the form and its elements are created together
    const newForm = await prisma.$transaction(async (tx) => {
      // 1. Create the base Form
      const form = await tx.form.create({
        data: {
          title,
          userId,
          published: false,
        },
      });

      // 2. Prepare the FormElements payload
      const elementsData = elements.map((el: any, index: number) => ({
        formId: form.id,
        type: el.type,
        question: el.question,
        options: JSON.stringify(el.options || []),
        orderIndex: index,
        required: el.required || false,
      }));

      // 3. Bulk insert the FormElements
      if (elementsData.length > 0) {
        await tx.formElement.createMany({
          data: elementsData,
        });
      }

      // 4. Return the fully populated Form
      return tx.form.findUnique({
        where: { id: form.id },
        include: {
          elements: {
            orderBy: {
              orderIndex: 'asc',
            },
          },
        },
      });
    });

    return NextResponse.json({ success: true, form: newForm }, { status: 201 });

  } catch (error) {
    console.error('[FORMS_POST]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
