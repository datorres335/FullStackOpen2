import {useState, useEffect, useMemo} from "react"
import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client";

const Recommendations = ({ show, user }) => {
  //console.log("user data:", user);
  
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const { data, loading } = useQuery(ALL_BOOKS);
  const books = useMemo(() => data?.allBooks || [], [data]);

  useEffect(() => {
    if (user && books) {
      const userFavoriteGenre = user.favoriteGenre.toLowerCase()
      const filteredBooks = books.filter(book => 
        book.genres.some(genre => genre.toLowerCase() === userFavoriteGenre)
      );
      setRecommendedBooks(filteredBooks);
    }
  }, [user, books]);
  
  if (!show) {
    //console.log("returning null - wrong page");
    return null;
  }

  if (!user) {
    //console.log("returning null - no user");
    return null;
  }

  if (loading) {
    //console.log("returning loading");
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre: <strong>{user.favoriteGenre}</strong></p>
      <ul>
        {recommendedBooks.map((book, index) => (
          <li key={index}>{book.title} by {book.author.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;