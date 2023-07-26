import { gql, useQuery } from '@apollo/client'

const RECOMMENDED_BOOKS = gql`
  query GetRecommendedBooks($favoriteGenre: String) {
    allBooks(genre: $favoriteGenre) {
      title
      author {
        name
      }
    }
  }
`

const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

const Recommended = (props) => {
  const { loading: meLoading, data: meData } = useQuery(ME)

  const favoriteGenre = meData && meData.me ? meData.me.favoriteGenre : ''
  const { loading, data } = useQuery(RECOMMENDED_BOOKS, {
    variables: { favoriteGenre },
  })

  if (!props.show) {
    return null
  }

  if (meLoading || loading) {
    return <p>Loading</p>
  }

  return (
    <div>
      <h2>recommended books</h2>
      <p>Books in you favorite genre: <b>{favoriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((book) => (
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

export default Recommended
