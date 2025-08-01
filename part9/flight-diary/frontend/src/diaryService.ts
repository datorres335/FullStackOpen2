import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from '../../packages/types';

const baseUrl = '/api/diaries';

export const getAllEntries = () => {
  return axios
    .get<DiaryEntry[]>(baseUrl)
    .then(response => response.data);
}

export const createEntry = (object: NewDiaryEntry) => {
  return axios
    .post<DiaryEntry>(baseUrl, object)
    .then(response => response.data);
}