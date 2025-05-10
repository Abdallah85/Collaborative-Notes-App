import { NextFunction, Request, Response } from "express";
import { INote } from "../interface/Inote.interface";
import NoteService from "../services/note.services";
import { ICreateNote } from "../interface/createnote.interface";

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
}
export default NoteController;
