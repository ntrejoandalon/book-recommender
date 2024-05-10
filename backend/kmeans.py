import pickle 
def thing(): 
    with open('modelData/kMeansModel.pkl', 'rb') as f:
        kmeans = pickle.load(f)
        
    print("HA")
    
def createDataset(average_rating, num_pages, ratings_count, text_reviews_count, genres):
    print('bahhhas')