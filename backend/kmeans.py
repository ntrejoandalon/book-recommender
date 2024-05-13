import pickle 
import pandas as pd
import numpy as np

from sklearn import preprocessing
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

def kmeans(average_rating, num_pages, ratings_count, text_reviews_count, genres):
    rawBookDataset, datasetWithUserBook = createDataset(average_rating, num_pages, ratings_count, text_reviews_count, genres)
    normalizedDataset = normalizeData(datasetWithUserBook)
    pcaData = pca(normalizedDataset)
    predictions = callKmeansModel(pcaData)
    print(predictions)
    # section out user book's pca points and cluster
    userBookPCA = pcaData.iloc[0]
    userBookCluster = predictions[0]
    pcaData = pcaData.drop(0, axis=0, inplace=False)
    pcaData.index = range(len(pcaData))
    del predictions[0]

    updatedFullBookData = updateFullBookData(rawBookDataset, pcaData, predictions)
    # print(updatedFullBookData)
    clusterBooks = getBooksInCluster(userBookCluster, updatedFullBookData)
    print(userBookCluster)
    print(len(clusterBooks))
    bookRecc, distance, point = findClosestPoint(clusterBooks, userBookPCA)
    print(bookRecc)
    print(distance)
    print(point)

def createDataset(average_rating, num_pages, ratings_count, text_reviews_count, genres):
    bookDataset = pd.read_csv('modelData/recleanedData(4-23).csv')
    bookDatasetFiltered = bookDataset.drop(['Title', 'Author', 'Id'], axis=1)
    # gotta loop through genres list to make them seperate ints in the dataframe
    parameterList = {'average_rating':average_rating, 'num_pages':num_pages, 'ratings_count':ratings_count, 'text_reviews_count':text_reviews_count}
    for genre, value in genres.items():
        parameterList[genre] = value
    userBookRow = pd.DataFrame(parameterList, index=[0])
    fullDataset = pd.concat([userBookRow, bookDatasetFiltered], ignore_index = True)
    return bookDataset, fullDataset

def normalizeData(dataset):
    bookDataNormalized = preprocessing.normalize(dataset)
    return bookDataNormalized
    # print(fullDataset.head())

    # bookData = pd.DataFrame(parameterList)
    # bookDataforPCA = [parameterList, parameterList, parameterList]

    # bookDataNormalized = preprocessing.normalize(bookDataforPCA)
    # print("normal")
    # print(bookDataNormalized)
    # userBookPCAData = pca(bookDataNormalized)
    # print(userBookPCAData.head())
    # thing(userBookPCAData)

    # return userBookPCAData.values.tolist()

def pca(normalizedData):
    pca = PCA(3)
    userBookPCA = pd.DataFrame(pca.fit_transform(normalizedData))
    return userBookPCA

def callKmeansModel(pcaData):
    idealNumOfClusters = 5
    kmeans = KMeans(n_clusters=idealNumOfClusters, random_state=0, n_init="auto").fit(pcaData)
    predictions = kmeans.labels_.tolist()
    return predictions

def updateFullBookData(rawBookDataset, pcaData, predictions):
    # save PCA points to book dataset
    pcaColumn1 = []
    pcaColumn2 = []
    pcaColumn3 = []
    for index, row in pcaData.iterrows():
        pcaColumn1.append(row[0])
        pcaColumn2.append(row[1])
        pcaColumn3.append(row[2])

    rawBookDataset['cluster_number'] = predictions
    rawBookDataset['pca1'] = pcaColumn1
    rawBookDataset['pca2'] = pcaColumn2
    rawBookDataset['pca3'] = pcaColumn3
    
    return rawBookDataset

def getBooksInCluster(clusterNumber, updatedFullBookData):
    clusterBooks = []
    for index, book in updatedFullBookData.iterrows():
        if book['cluster_number'] == clusterNumber:
            clusterBooks.append(book)
    return clusterBooks

# calculate distance between user pca book points and the books in its cluster to see which book is most similar
def calculateDistance(point1, point2):
  return np.sqrt(np.sum((np.array(point2) - np.array(point1)) ** 2))

def findClosestPoint(clusterBooks, userBookPoint):
  minDistance = float('inf')
  closestBook = None
  minPoint = None

  for book in clusterBooks:
    point = [float(book['pca1']), float(book['pca2']), float(book['pca3'])]
    distance = calculateDistance(point, userBookPoint)
    if distance < minDistance:
      minDistance = distance
      closestBook = book
      minPoint = point
  return closestBook, minDistance, minPoint

# def thing(bookDataNormalized): 
#     with open('modelData/kMeansModel.pkl', 'rb') as f:
#         kmeans = pickle.load(f)
#         prediction = kmeans.predict(bookDataNormalized)
#         print("MODEL ------\n")
#         print(prediction)
        
#     print("HA")

