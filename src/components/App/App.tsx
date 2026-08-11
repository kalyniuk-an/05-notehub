import { useQuery} from '@tanstack/react-query'
import { useState } from 'react'


import css from './App.module.css'
import NoteList from '../NoteList/NoteList'
import SearchBox from '../SearchBox/SearchBox'
import { fetchNotes, type FetchNotesResponse } from '../../services/noteServise'
import Pagination from '../Pagination/Pagination'

// import { useDebounce } from 'use-debounce'

const PER_PAGE = 12;

export default function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // const [debouncedSearch] = useDebounce(search, 500);
  const { data, isSuccess } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, PER_PAGE, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    // placeholderData: keepPreviousData
  });

  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (value: string) => {
    setSearch(value);
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
        {<button className={css.button}>Create note +</button>}
      </header>
      <NoteList notes={data?.notes || []} />
    </div>)
}