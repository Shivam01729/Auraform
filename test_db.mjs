import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const form = await prisma.form.findFirst({
    include: { elements: true, responses: { include: { answers: true } } }
  });

  if (!form) {
    console.log("No forms found.");
    return;
  }
  
  console.log("Form:", form.title);
  form.elements.forEach(el => {
    console.log(`Element: ${el.type} - ${el.question}`);
    if (el.type === 'multiple_choice') {
      console.log(`  Options: ${el.options}`);
    }
  });

  console.log("Responses:");
  form.responses.forEach(r => {
    console.log(`Response ${r.id}:`);
    r.answers.forEach(a => {
      console.log(`  Answer for ${a.elementId}: ${a.value}`);
    });
  });
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
