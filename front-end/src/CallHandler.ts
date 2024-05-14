import axios from "axios"

export interface BookInformation {
    title: string,
    author: string[],
    numInteractions: number,
    averageRating: number,
    numRatings: number,
    description: string,
    numPages: number,
    subjects: string[]
  }

const config = {
    headers: { 'Access-Control-Allow-Origin': '*' }
};

export async function getBookInformation(searchTerm: string) {
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

function callConvertGenres(genreList: string[]){

}
