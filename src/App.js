import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieList from "./components/movieList";
import SearchBox from "./components/SearchBox";
import MovieListHeading from "./components/movieListHeading";
import ScrollContainer from "react-indiana-drag-scroll";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [favourites, setFavourites] = useState([]);

  // 검색어가 바뀔때 함수 실핼
  useEffect(() => {
    if (searchValue.length > 3) getMovieRequest(searchValue);
  }, [searchValue]);

  // 검색어로 영화 데이터 요청 async/await는 쌍으로 사용
  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=4bd67921`;

    // 자바스크립트는 기본적으로 비동기므로 await를 붙여서 영화데이터를 다 받고 다음 코드 실행
    const response = await fetch(url);
    const responseJson = await response.json();

    // 검색결과가 있을때
    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  // 브라우저 저장소에서 선호작 영화들을 가져온다. 앱 시작시 1번 실행
  useEffect(() => {
    const movieFavourites = JSON.parse(localStorage.getItem("favourites"));
    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  // 브라우저에 저장하기
  const saveToLocalStorage = (items) => {
    localStorage.setItem("favourites", JSON.stringify(items));
  };

  // 선호작에 영화를 추가하기
  const addFavouriteMovie = (movie) => {
    const newList = [...favourites, movie]; // 선호작 리스트에 + 영화하나 추가
    setFavourites(newList); // 새 선호작으로 업데이트
    saveToLocalStorage(newList); // 저장하기
  };

  // 선호작을 제거하는 함수
  const removeMovie = (movie) => {
    const newList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );

    setFavourites(newList);
    saveToLocalStorage(newList);
  };

  return (
    <div className="container-fluid movie-app">
      <div className="row">
        <MovieListHeading heading="영화 검색과 선호작 등록" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      {/* 마우스 스크롤 */}
      <ScrollContainer tainer className="row scroll-container">
        <MovieList
          movies={movies}
          handleClick={addFavouriteMovie}
          addMovie={true}
        />
      </ScrollContainer>
      <div className="row">
        <MovieListHeading heading="내 선호작" />
      </div>
      <ScrollContainer tainer className="row scroll-container">
        <MovieList
          movies={favourites}
          handleClick={removeMovie}
          addMovie={false}
        />
      </ScrollContainer>
    </div>
  );
}

export default App;
