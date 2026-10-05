const prisma = require('../db/prisma');

async function findAll() {
  return prisma.post.findMany({ 
    orderBy: { id: 'asc' },
    include: { author: true, tags: { include: { tag: true } } }
  });
}

async function findById(id) {
  return prisma.post.findUnique({ 
    where: { id: Number(id) },
    include: { author: true, comments: true, votes: true, tags: { include: { tag: true } } }
  });
}

async function findByAuthorId(authorId) {
  return prisma.post.findMany({
    where: { authorId: Number(authorId) },
    orderBy: { id: 'asc' },
    include: { author: true }
  });
}

async function create(fields) {
  return prisma.post.create({
    data: {
      title: fields.title,
      body: fields.body || '',
      authorId: Number(fields.authorId),
    },
    include: { author: true }
  });
}

async function update(id, patch) {
  const existing = await findById(id);
  if (!existing) return null;
  return prisma.post.update({
    where: { id: Number(id) },
    data: patch,
    include: { author: true }
  });
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) return false;
  await prisma.post.delete({ where: { id: Number(id) } });
  return true;
}

module.exports = { findAll, findById, findByAuthorId, create, update, remove };
