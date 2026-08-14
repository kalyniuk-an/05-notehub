import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';


import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import { fetchNotes, type FetchNotesResponse } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import { useDebouncedCallback } from 'use-debounce'
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const PER_PAGE = 12;

export default function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
  }, 500);

  const { data, isSuccess, isError, isLoading } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, PER_PAGE, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch }),
    placeholderData: keepPreviousData
  });

  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (value: string) => {
    setSearch(value);
    debouncedSetSearch(value);
    setPage(1);
  };
  const handlePageChange = (newPage: number) =>setPage(newPage);

  return (
    <div className={css.App}>
      <header className={css.toolbar}>
        {<SearchBox value={search} onSearch={handleSearch} />}
        {isSuccess && totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}
        {<button className={css.button} onClick={()=> setIsModalOpen(true)}>Create note +</button>}
      </header>
      <NoteList notes={data?.notes || []} />
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => { setIsModalOpen(false); }} />
        </Modal>
      )}
      {isLoading && <Loader />}
      {isError ? (
          <ErrorMessage />
        ) : (
          data && data.notes.length > 0 && <NoteList notes={data.notes} />
        )}
    </div>)
}