import React, { useState } from 'react';
import './App.css';
import axios from "axios"
import InputSection from './contentSections/InputSection';
import OutputSection, { displayedBookFields } from './contentSections/OutputSection';
import Popup from 'reactjs-popup';
import { Bounce, ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EyeButton from "./images/eye-button.png"

export enum AppState {
  Input, Loading, ModelFinished, Read1984
}

export interface BookInformation {
  title: string,
  author: string[],
  numInteractions: number,
  averageRating: number,
  numRatings: number,
  description: string,
  numPages: number,
  subjects: string[],
  isbn: string
}

function App() {
  const [bookTitle, setBookTitle] = useState("")
  const [description, setDescription] = useState("")
  const [appState, setAppState] = useState(AppState.Input)
  const [recommendations, setRecommendations] = useState<displayedBookFields[]>([])
  const notify = (field: string) => toast.error('Big Brother sees you have not filled out ' + field, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Zoom,
  });

  const handleSubmit = (e: React.FormEvent) => {
    if (description != '' && bookTitle != '') {
      recommendations.length = 0;
      setRecommendations([])
      setAppState(AppState.Loading);
      doKMeans();
      // addBookToRecommendations("Your recommendation is 1984 written by George Orwell.")
      doSentenceTransformer();

    } else {
      let unfilledField: string;
      if (description == bookTitle) {
        notify('either field.')
      } else if (description == '') {
        notify('book description.')

      } else {
        notify('book title.')

      }

    }
  }


  function handleSetBookTitle(value: string) {
    setBookTitle(value)
  }

  function handleSetDescription(value: string) {
    setDescription(value)
  }

  function handleSetState(value: AppState) {
    setAppState(value);
  }

  const addBookToRecommendations = async (description: string) => {
    // result = "Your recommendation is " + bookRecc['Title'] + " by " + bookRecc['Author'] + ". It has a rating of " + str(bookRecc['average_rating']) + " stars!"
    // result = "Your next recommendation is " + mostSimilarBook[1] + " written by " + mostSimilarBook[4] + ". Here is the description: " + mostSimilarBook[0]
    let newRec: displayedBookFields = {
      title: description.substring(description.indexOf('recommendation is ') + 18, description.indexOf(' written ')),
      author: '',
      rating: 0,
      description: description,
      imageUrl: ''
    };

    let bookInformation = await getBookInformation(newRec.title) as unknown as BookInformation
    newRec.rating = bookInformation.averageRating
    newRec.author = bookInformation.author[0]
    newRec.imageUrl = 'https://covers.openlibrary.org/b/isbn/' + bookInformation.isbn + '-M.jpg'

    recommendations.push(newRec)
    setRecommendations(recommendations)

    console.log(recommendations)
    if (recommendations.length == 2) {
      setAppState(AppState.ModelFinished);
    }
  }


  const doKMeans = async () => {
    if (bookTitle != '') {
      let bookInformation = await getBookInformation(bookTitle) as unknown as BookInformation
      let genres: string[] = []

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
          console.log(response.data)
          addBookToRecommendations(response.data)
        })
        .catch((er) => {
          console.log(er);
          addBookToRecommendations("Your recommendation is 1984 by George Orwell")

        });
    }
  }

  const doSentenceTransformer = async () => {
    //get the converted genres
    const config = {
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
    axios
      .post("http://127.0.0.1:5000/sentenceTransformer", {
        userDescription: description
      }, config)
      .then((response) => {
        console.log(response.data)
        addBookToRecommendations(response.data)

      })
      .catch((er) => {
        console.log(er);
      });
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
          subjects: firstResult.subject,
          isbn: firstResult.isbn
        }

        console.log(firstResult);
      })

    return result
  }

  function clickedEye() {
    setAppState(AppState.Read1984);

    let newRec: displayedBookFields = {
      title: '1984',
      author: 'George Orwell',
      rating: 4.67,
      description: "1984 written by George Orwell. Read it. (We are always watching)",
      imageUrl: 'https://covers.openlibrary.org/b/olid/OL22819394M-M.jpg'
    };

    recommendations.length = 0
    recommendations.push(newRec)
    setRecommendations(recommendations)
  }

  return (
    <div className='fullPage'>
      <div className='b1'>
        <div className='b2'>

          <div className="App">
            <h1>
              Book Recommender!
            </h1>
            <h2>
              Praise INGSOC!!! Read What WE Tell You To
            </h2>
            <div className='mainContent'>
              <div className="c1">
                <InputSection handleSubmit={handleSubmit} setBookTitle={handleSetBookTitle} setDescription={handleSetDescription} setAppState={handleSetState} />
                <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                  transition={Zoom}
                />
              </div>
              <div className='c2'>
                <OutputSection appState={appState} recommendations={recommendations} />
              </div>
            </div>
            <button className="eyeButton"><img className="eyeButtonImage" src={EyeButton} alt="my image" onClick={clickedEye} /></button>
            
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
