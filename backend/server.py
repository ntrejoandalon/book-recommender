from flask import Flask, request, render_template, url_for, redirect
from flask_cors import CORS
import kmeans

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
    genres = request.json.get('input')
    return ['Fantasy', 'Young Adult', 'Fiction']

if __name__ == "__main__":
    app.run(debug=True)