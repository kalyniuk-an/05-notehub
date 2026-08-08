import { useQuery} from '@tanstack/react-query'

import css from './App.module.css'
import NoteList from '../NoteList/NoteList'
import SearchBox from '../SearchBox/SearchBox'
import {fetchNotes, type FetchNotesResponse } from '../../services/noteServise'

export default function App() {
  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ['notes'],
    queryFn: () => fetchNotes({ page: 1, perPage: 12 })
    // placeholderData: keepPreviousData
  });

  return (
    <div className={css.App}>
      <header className={css.toolbar}>
        {<SearchBox />}
        {/*pagination*/}
        {/*create note button*/}
      </header>
      <NoteList notes={data?.notes || []} />
    </div>)
}