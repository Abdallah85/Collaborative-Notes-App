import mongoose from "mongoose";

export interface ICreateNote {
  title: string;
  content: string;
  creator: string;
}
