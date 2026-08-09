import { useQuery} from '@tanstack/react-query'
import { useState, type ComponentType } from 'react'

import css from './App.module.css'
import NoteList from '../NoteList/NoteList'
import SearchBox from '../SearchBox/SearchBox'
import { fetchNotes, type FetchNotesResponse } from '../../services/noteServise'
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";



type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

export default function App() {
  const [page, setPage] = useState(1);
  const { data, isSuccess } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page],
    queryFn: () => fetchNotes({ page, perPage: 12 })
    // placeholderData: keepPreviousData
  });

  const totalPages = data?.totalPages ?? 0;
  return (
    <div className={css.App}>
      <header className={css.toolbar}>
        {<SearchBox />}
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