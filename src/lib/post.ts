import { prisma } from '@/lib/prisma';
import { Post } from '@/types/post';

export async function getPosts(): Promise<Post[]> {
  return await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPost(id: string): Promise<Post | null> {
  return await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });
}

export async function searchPosts(search: string): Promise<Post[]> {
  const decodedSearch = decodeURIComponent(search);
  const normalizedSearch = decodedSearch.replace(/[\s　]+/g, ' ').trim();
  const searchWords = normalizedSearch.split(' ').filter(Boolean);

  const filters = searchWords.map((word) => ({
    OR: [{ title: { contains: word } }, { content: { contains: word } }],
  }));
  return await prisma.post.findMany({
    where: {
      published: true,
      AND: filters,
    },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}