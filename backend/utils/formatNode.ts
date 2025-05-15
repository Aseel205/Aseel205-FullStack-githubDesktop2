// backend/utils/formatNote.ts

export const formatNote = (note: any) => {
  const raw = note.toObject ? note.toObject() : note;
  return {
    _id: raw._id.toString(),
    title: raw.title,
    author: {
      name: raw.author?.name ?? '',
      email: raw.author?.email ?? '',
    },
    content: raw.content,
  };
};
