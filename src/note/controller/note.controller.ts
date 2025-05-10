import { NextFunction, Request, Response } from "express";
import { INote } from "../interface/Inote.interface";
import NoteService from "../services/note.services";
import { ICreateNote } from "../interface/createnote.interface";
import mongoose from "mongoose";

class NoteController {
  private noteService: NoteService;
  constructor() {
    this.noteService = new NoteService();
  }
  async createNote(req: Request, res: Response, next: NextFunction) {
    const noteData: ICreateNote = req.body;
    const note = await this.noteService.createNote(noteData);
    res.status(201).json(note);
  }
  async updateNote(req: Request, res: Response, next: NextFunction) {
    const { content } = req.body;
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    const note = await this.noteService.updateNote(content, noteId);
    res.status(200).json(note);
  }

  async getNoteHistory(req: Request, res: Response, next: NextFunction) {
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    const history = await this.noteService.getNoteHistory(noteId);
    res.status(200).json(history);
  }

  async deleteNote(req: Request, res: Response, next: NextFunction) {
    const noteId = new mongoose.Types.ObjectId(req.params.noteId);
    const note = await this.noteService.deleteNote(noteId);
    res.status(200).json({});
  }
}
export default NoteController;
