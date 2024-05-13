from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np

def sentenceTransformerModel(userDescription):
    model = SentenceTransformer('bert-base-nli-mean-tokens')
    userDescriptionEmbedding = model.encode(userDescription)
    fullDatasetBookEmbeddings = np.load('modelData/savedEmbeddings2.npy')

    maxScoreIndex = findClosestScore(userDescriptionEmbedding, fullDatasetBookEmbeddings)

    mostSimilarBook = getMostSimilarBook(maxScoreIndex)
    result = "Your next recommendation is " + mostSimilarBook[1] + " written by " + mostSimilarBook[4] + ". Here is the description: " + mostSimilarBook[0]
    return result

def findClosestScore(userDescriptionEmbedding, fullDatasetBookEmbeddings):
    similarity_scores = cosine_similarity([userDescriptionEmbedding], fullDatasetBookEmbeddings)
    # maxScore = similarity_scores.max()
    maxScoreIndex = np.argmax(similarity_scores)
    return maxScoreIndex

def getMostSimilarBook(maxScoreIndex):
    bookDesc1 = pd.read_csv('modelData/desc_data1.csv')
    bookDesc2 = pd.read_csv('modelData/desc_data2.csv')

    books = bookDesc1.values.tolist()
    books.extend(bookDesc2.values.tolist())

    return books[maxScoreIndex]