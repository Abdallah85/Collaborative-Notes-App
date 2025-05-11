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

  createNote = async (req: Request, res: Response) => {
    const noteData: ICreateNote = req.body;
    const user: IUser = res.locals.user;
    const note = await this.noteService.createNote(noteData, user);
    res.status(201).json(note);
  };

  updateNote = async (req: Request, res: Response) => {
    const { content } = req.body;
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    const note = await this.noteService.updateNote(content, noteId);
    res.status(200).json(note);
  };

  getNoteHistory = async (req: Request, res: Response) => {
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    const history = await this.noteService.getNoteHistory(noteId);
    res.status(200).json(history);
  };

  deleteNote = async (req: Request, res: Response) => {
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    await this.noteService.deleteNote(noteId);
    res.status(200).json({});
  };

  searchNotes = expressAsyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query;
    const notes = await this.noteService.searchNotes(query as string);
    res.status(200).json(notes);
  });

  getAllNotes = async (req: Request, res: Response) => {
    const notes = await this.noteService.getNotes();
    console.log("All notes in database:", notes);
    res.status(200).json(notes);
  };
}
export default NoteController;
