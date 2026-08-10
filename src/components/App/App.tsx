import { useQuery} from '@tanstack/react-query'
import { useState, type ComponentType } from 'react'


import css from './App.module.css'
import NoteList from '../NoteList/NoteList'
import SearchBox from '../SearchBox/SearchBox'
import { fetchNotes, type FetchNotesResponse } from '../../services/noteServise'
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
// import { useDebounce } from 'use-debounce'

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

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
    console.log('Search value:', value);
  };

  return (
    <div className={css.App}>
      <header className={css.toolbar}>
        {<SearchBox value={search} onSearch={handleSearch} />}
        {isSuccess && totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => { setPage(selected + 1); }}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel=">"
            previousLabel="<"
          />
        )}
        {/*create note button*/}
      </header>
      <NoteList notes={data?.notes || []} />
    </div>)
}