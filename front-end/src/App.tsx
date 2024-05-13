import React, { ChangeEvent, useState } from 'react';
import './App.css';
import axios from "axios"
function App() {
  const [bookTitle, setBookTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    doKMeans();
    alert('An essay was submitted: ' + bookTitle);

    e.preventDefault();
  }

  const getBookInformation = async (searchTerm: string) => {
    const baseQuery = 'https://openlibrary.org/search.json?title=' + searchTerm
    let numPages: any = 0;
    let result: BookInformation | null = null;

    await fetch(baseQuery)
      .then(response => response.json())
      .then(async (data) => {
        let firstResult = data.docs[0]
        let workId = firstResult.key

        const editionCall = 'https://openlibrary.org' + workId + '/editions.json'
        await fetch(editionCall)
          .then(response => response.json())
          .then((data) => {
            let editionEntries = data.entries
            let i = 0

            while (numPages == 0 && i < editionEntries.length) {
              let attemptedGrab = editionEntries[i].number_of_pages
              if (attemptedGrab) {
                numPages = attemptedGrab
              }
              i += 1
            }
          })

        result = {
          title: firstResult.title_suggest,
          author: firstResult.author_name,
          numInteractions: firstResult.readinglog_count,
          averageRating: firstResult.ratings_average,
          numRatings: firstResult.ratings_count,
          description: firstResult.first_sentence,
          numPages: numPages,
          subjects: firstResult.subject
        }
      })

    return result
  }
  interface BookInformation {
    title: string,
    author: string[],
    numInteractions: number,
    averageRating: number,
    numRatings: number,
    description: string,
    numPages: number,
    subjects: string[]
  }

  const doKMeans = async () => {
    if (bookTitle != '') {
      let bookInformation = await getBookInformation(bookTitle) as unknown as BookInformation
      let genres : string[] = []
      let recommendation = ''
      
      //get the converted genres
      const config = {
        headers: { 'Access-Control-Allow-Origin': '*' }
      };
      await axios
        .post("http://127.0.0.1:5000/convertGenres", {
          input: bookInformation.subjects,
        }, config)
        .then((response) => {
          // console.log(response)
          genres = response.data
        })
        .catch((er) => {
          console.log(er);
        });

      console.log(genres)
      //call the actual kmeans maker function
      // "http://localhost:5000/kmeans"
      axios
        .post("http://127.0.0.1:5000/kmeans", {
          book_genres: genres,
          num_pages: bookInformation.numPages,
          ratings_count: bookInformation.numRatings,
          average_rating: bookInformation.averageRating,
          text_reviews_count: bookInformation.numInteractions
        }, config)
        .then((response) => {
          recommendation = response.data
          console.log(recommendation)
        })
        .catch((er) => {
          console.log(er);
        });
      axios
      .post("http://127.0.0.1:5000/sentenceTransformer", {
        userDescription: description
      }, config)
      .then((response) => {
        recommendation = response.data
        console.log(recommendation)
      })
      .catch((er) => {
        console.log(er);
      });
    }
    // axios({
    //   method: "GET",
    //   url: "/kmeans",
    // })
    //   .then((response) => {
    //     const res = response.data
    //     setBookTitle(res)
    //     alert("BOO")
    //   }).catch((error) => {
    //     if (error.response) {
    //       console.log(error.response)
    //       console.log(error.response.status)
    //       console.log(error.response.headers)
    //     }
    //   })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Book Recommender!
        </h1>
        <p>Insert the title of a book you like and/or a description of what you want to see.</p>
        <p>Wait and see the recommendations from it!</p>

        {bookTitle}
        <button onClick={doKMeans}>Click me</button>


        <form onSubmit={handleSubmit}>
          <h2>Input Your Information Below</h2>
          <label>
            Book Title
            <input type="text" id="query" name="q" onChange={(e: any) => setBookTitle(e.target.value)} />
          </label>
          <div></div>
          <label>
            Book Description
            <input type="text" id="query" name="q" onChange={(e: any) => setDescription(e.target.value)} />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
}

export default App;
