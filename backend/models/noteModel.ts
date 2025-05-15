import mongoose from 'mongoose';

// Define the Author schema
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

// Define the Note schema
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: authorSchema, // Use the authorSchema here
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the Note model
const NoteModel = mongoose.model('Note', noteSchema);

export default NoteModel;
