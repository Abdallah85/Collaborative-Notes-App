import { Request, Response } from "express";
import NoteService from "../services/note.services";
import { ICreateNote } from "../interface/createnote.interface";
import mongoose from "mongoose";
import { IUser } from "../../user/interface/Iuser.interface";
import expressAsyncHandler from "express-async-handler";

class NoteController {
  private noteService: NoteService;
  constructor() {
    this.noteService = new NoteService();
  }

  /**
   * @swagger
   * /api/notes:
   *   post:
   *     summary: Create a new note
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - content
   *             properties:
   *               title:
   *                 type: string
   *                 minLength: 3
   *                 maxLength: 100
   *                 description: Title of the note
   *               content:
   *                 type: string
   *                 description: Content of the note
   *             example:
   *               title: "Meeting Notes"
   *               content: "Discussion points from today's meeting..."
   *     responses:
   *       201:
   *         description: Note created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 title:
   *                   type: string
   *                 content:
   *                   type: string
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  createNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const noteData: ICreateNote = req.body;
    const user: IUser = res.locals.user;
    const note = await this.noteService.createNote(noteData, user);
    res.status(201).json(note);
  });

  /**
   * @swagger
   * /api/notes/{noteId}:
   *   put:
   *     summary: Update a note
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: noteId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the note to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - content
   *             properties:
   *               content:
   *                 type: string
   *                 description: Updated content of the note
   *             example:
   *               content: "Updated meeting notes..."
   *     responses:
   *       200:
   *         description: Note updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 title:
   *                   type: string
   *                 content:
   *                   type: string
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Note not found
   *       500:
   *         description: Server error
   */
  updateNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    const note = await this.noteService.updateNote(content, noteId);
    res.status(200).json(note);
  });

  /**
   * @swagger
   * /api/notes/{noteId}/history:
   *   get:
   *     summary: Get note edit history
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: noteId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the note to get history for
   *     responses:
   *       200:
   *         description: Note history retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   content:
   *                     type: string
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Note not found
   *       500:
   *         description: Server error
   */
  getNoteHistory = expressAsyncHandler(async (req: Request, res: Response) => {
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    const history = await this.noteService.getNoteHistory(noteId);
    res.status(200).json(history);
  });

  /**
   * @swagger
   * /api/notes/{noteId}:
   *   delete:
   *     summary: Delete a note
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: noteId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the note to delete
   *     responses:
   *       200:
   *         description: Note deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Note deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Note not found
   *       500:
   *         description: Server error
   */
  deleteNote = expressAsyncHandler(async (req: Request, res: Response) => {
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    await this.noteService.deleteNote(noteId);
    res.status(200).json({});
  });

  /**
   * @swagger
   * /api/notes/search:
   *   get:
   *     summary: Search notes
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: query
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query to find notes
   *     responses:
   *       200:
   *         description: Notes found successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   title:
   *                     type: string
   *                   content:
   *                     type: string
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: No notes found
   *       500:
   *         description: Server error
   */
  searchNotes = expressAsyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query;
    const notes = await this.noteService.searchNotes(query as string);
    res.status(200).json(notes);
  });

  /**
   * @swagger
   * /api/notes/all:
   *   get:
   *     summary: Get all notes
   *     tags: [Notes]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Notes retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   title:
   *                     type: string
   *                   content:
   *                     type: string
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  getAllNotes = expressAsyncHandler(async (req: Request, res: Response) => {
    const notes = await this.noteService.getNotes();
    res.status(200).json(notes);
  });
}

export default NoteController;
