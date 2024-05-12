from flask import Flask, request, render_template, url_for, redirect, jsonify, Response, current_app
from flask_cors import CORS
import kmeans
import string

app = Flask(__name__)
CORS(app)
    
#Members API Route
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# @app.route('/kmeans')
# def doKmeans():
#     kmeans.thing()
#     return "ha"

@app.route('/kmeans', methods=['POST'])
def doKmeans(): 
    genres = request.json.get('input')
    return "ha"

    
@app.route('/convertGenres', methods=['POST'])
def convertGenres(): 
    defaultGenres = ['Fantasy', 'Young Adult', 'Fiction', 'Childrens', 'Adventure', 'Classics', 'Mystery', 'Novels', 'Science Fiction', 'Humor', 'European Literature', 'History', 'Historical', 'Philosophy', 'Cultural', 'Biography', 'Literature', 'American', 'Adult', 'Romance']
    genresOfUserBook = request.json.get('input')
    genresOfUserBook = [x.translate((str.maketrans('', '', string.punctuation))) for x in genresOfUserBook]
    # capitalize first letters of genres
    genresOfUserBook = [x.title() for x in genresOfUserBook]

    defaultGenresOfUserBook = []
    # check if user's novel includes our default genres
    for genre in defaultGenres:
        if genre == "Adult" or genre == "Fiction":
            if genre in genresOfUserBook:
                defaultGenresOfUserBook.append(genre)
        else:
            for userBookGenre in genresOfUserBook:
                if genre in userBookGenre and genre not in defaultGenresOfUserBook:
                    defaultGenresOfUserBook.append(genre)
                    break
        

    print(genresOfUserBook)
    # return ['Fantasy', 'Young Adult', 'Fiction']
    return str(defaultGenresOfUserBook) + str(genresOfUserBook)

if __name__ == "__main__":
    app.run(debug=True)