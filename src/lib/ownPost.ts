import { prisma } from '@/lib/prisma';
import { Post } from '@/types/post';

export async function getOwnPosts(userId: string) {
  return await prisma.post.findMany({
    where: {
      authorId: userId
    },
    select: {
      id: true,
      title: true,
      published: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}