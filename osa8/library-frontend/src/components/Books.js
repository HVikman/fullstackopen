import { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'

const BOOKS = gql`
  query GetBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
    }
  }
`

const ALL_GENRES = gql`
  query GetAllGenres {
    allBooks {
      genres
    }
  }
`


const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])

  const booksResult = useQuery(BOOKS, {
    variables: { genre: selectedGenre },
  })

  const genresResult = useQuery(ALL_GENRES)

  useEffect(() => {
    if (genresResult.data && genresResult.data.allBooks) {
      const allGenres = genresResult.data.allBooks
        .flatMap((book) => book.genres)
        .filter((genre, index, self) => self.indexOf(genre) === index)
      setGenres(allGenres)
    }
  }, [genresResult.data])

  useEffect(() => {
    if (selectedGenre !== '') {
      booksResult.refetch({ genre: selectedGenre })
    }
  }, [selectedGenre, booksResult])



  if (!props.show) {
    return null
  }

  if (booksResult.loading) {
    return <p>Loading</p>
  }

  return (
    <div>
      <h2>books</h2>

      <select value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksResult.data.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
