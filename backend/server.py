from flask import Flask, request, render_template, url_for, redirect, jsonify, Response, current_app
from flask_cors import CORS
from kmeans import kmeans
from sentenceTransformer import sentenceTransformerModel
import string
import json
app = Flask(__name__)
CORS(app)

#Members API Route
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/sentenceTransformer', methods=['POST'])
def doSentenceTransformerModel():
    description = request.json.get('userDescription')
    result = sentenceTransformerModel(description)
    return result

@app.route('/kmeans', methods=['POST'])
def doKmeans():
    bookData = request.json
    average_rating = str(bookData.get('average_rating'))
    num_pages = bookData.get('num_pages')
    ratings_count = bookData.get('ratings_count')
    text_reviews_count = bookData.get('text_reviews_count')
    genres = bookData.get('book_genres')
    result = kmeans(average_rating, num_pages, ratings_count, text_reviews_count, genres)
    print(result)
    return result
    
@app.route('/convertGenres', methods=['POST'])
def convertGenres():
    defaultGenres = ['Fantasy', 'Young Adult', 'Fiction', 'Childrens', 'Adventure', 'Classics', 'Mystery', 'Novels', 'Science Fiction', 'Humor', 'European Literature', 'History', 'Historical', 'Philosophy', 'Cultural', 'Biography', 'Literature', 'American', 'Adult', 'Romance']
    genresOfUserBook = request.json.get('input')
    genresOfUserBook = [x.translate((str.maketrans('', '', string.punctuation))) for x in genresOfUserBook]
    # capitalize first letters of genres
    genresOfUserBook = [x.title() for x in genresOfUserBook]
    defaultGenresOfUserBook = {}
    foundGenre = False
    # check if user's novel includes our default genres
    for genre in defaultGenres:
        foundGenre = False
        if genre == "Adult" or genre == "Fiction":
            if genre in genresOfUserBook:
                defaultGenresOfUserBook[genre] = 1
            else:
                defaultGenresOfUserBook[genre] = 0
        else:
            for userBookGenre in genresOfUserBook:
                if genre in userBookGenre and genre not in defaultGenresOfUserBook:
                    defaultGenresOfUserBook[genre] = 1
                    foundGenre = True
                    break
            if (foundGenre == False):
                defaultGenresOfUserBook[genre] = 0
    return defaultGenresOfUserBook
if __name__ == "__main__":
    app.run(debug=True)