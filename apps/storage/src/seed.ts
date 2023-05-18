import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const logger = new Logger('SEED');
const data = [
  {
    name: 'Space 1',
    module: 'module1',
    status: true,
    parent: null,
    path: 'path',
    userId: 1,
    projectId: 1,
    files: {
      createMany: {
        data: [
          {
            name: 'file 1',
            mimeType: 'text/plain',
            size: 1024,
            path: 'path/file1.txt',
            tag: 9,
            userId: 1,
          },
          {
            name: 'file 2',
            mimeType: 'text/plain',
            size: 2048,
            path: 'path/file2.txt',
            tag: 9,
            userId: 2,
          },
        ],
      },
    },
  },
  {
    name: 'Space 2',
    module: 'module2',
    status: true,
    parent: null,
    path: 'path',
    userId: 1,
    projectId: 1,
    files: {
      createMany: {
        data: [
          {
            name: 'file 1',
            mimeType: 'text/plain',
            size: 1024,
            path: 'path/file1.txt',
            tag: 9,
            userId: 1,
          },
          {
            name: 'file 2',
            mimeType: 'text/plain',
            size: 2048,
            path: 'path/file2.txt',
            tag: 9,
            userId: 2,
          },
        ],
      },
    },
  },
  {
    name: 'Space 3',
    module: 'module3',
    status: true,
    parent: null,
    path: 'path',
    userId: 2,
    projectId: 2,
    files: {
      createMany: {
        data: [
          {
            name: 'file 1',
            mimeType: 'text/plain',
            size: 1024,
            path: 'path/file1.txt',
            tag: 9,
            userId: 1,
          },
          {
            name: 'file 2',
            mimeType: 'text/plain',
            size: 2048,
            path: 'path/file2.txt',
            tag: 9,
            userId: 2,
          },
        ],
      },
    },
  },
  {
    name: 'Space 4',
    module: 'module4',
    status: true,
    parent: null,
    path: 'path',
    userId: 2,
    projectId: 2,
    files: {
      createMany: {
        data: [
          {
            name: 'file 1',
            mimeType: 'text/plain',
            size: 1024,
            path: 'path/file1.txt',
            tag: 9,
            userId: 1,
          },
          {
            name: 'file 2',
            mimeType: 'text/plain',
            size: 2048,
            path: 'path/file2.txt',
            tag: 9,
            userId: 2,
          },
        ],
      },
    },
  },
];
async function seed() {
  const result = data.map(async (space) => {
    return await prisma.space.create({
      data: space,
      include: {
        files: true,
      },
    });
  });

  await Promise.allSettled(result);
}

seed()
  .then(async () => {
    logger.log('Seeding completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error('Seeding failed', e);
    await prisma.$disconnect();
    process.exit(1);
  });
