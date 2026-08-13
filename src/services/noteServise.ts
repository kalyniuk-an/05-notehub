import axios from "axios";
import type { Note, NoteTag } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
  sortBy?: "created" | "updated";
}
const API_URL = "https://notehub-public.goit.study/api/notes";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  const { page, perPage, search, tag, sortBy } = params;
  const query: Record<string, unknown> = {
    page,
    perPage
  };
  if (search) {
    query.search = search;
  }
  if (tag) {
    query.tag = tag;
  }
  if (sortBy) {
    query.sortBy = sortBy;
  }
  const response = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: query
  });
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await axios.delete(`${API_URL}/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}
