import pandas as pd
import numpy as np
import random
import sys
from sklearn import cluster as Kcluster, metrics as SK_Metrics
from sklearn.decomposition import PCA
from sklearn.manifold import Isomap,MDS
from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import Normalizer
import math

# Path to data
data_path = "C:/EasyPHP-12.1/www/Lab2/data_sampled/"

# Random Sampling, this will take just random samples from the dataset
# data_frame is the panda dataframe which is made from csv and fraction is the fraction of data to be sampled

def random_sampling(data_frame_orig, fraction):
	print("Here")
	rows = np.random.choice(data_frame_orig.index.values, (int)(len(data_frame_orig)*fraction)) # sample the data randomly
	return data_frame_orig.ix[rows] #indexing the data from driginal data frame
 
#Stratified Sampling, Stratified sampling refers to a type of sampling method .
#With stratified sampling, the researcher divides the population into separate groups,
#called strata. Then, a probability sample (often a simple random sample ) is drawn from each group.

#Stratified sampling has several advantages over simple random sampling.
#For example, using stratified sampling, it may be possible to reduce the
#sample size required to achieve a given precision. Or it may be possible to 
#increase the precision with the same sample size.

def stratified_sampling(data_frame_orig, no_of_clusters, fraction):
    k_means = Kcluster.KMeans(n_clusters=no_of_clusters) # Predefined function in sklearn library of python
    k_means.fit(data_frame_orig) # computes K mean clustering

    data_frame_orig['label'] = k_means.labels_ # a column named labels which will be labels of the clusters
    sampleRows = []
    # Taking fraction of rows of every cluster and appending it to the sampleRows
    for i in range(no_of_clusters):
         sampleRows.append(data_frame_orig.ix[np.random.choice(data_frame_orig[data_frame_orig['label'] == i].index.values, 
         	(int)(len(data_frame_orig[data_frame_orig['label'] == i])*fraction))])

    # This contains the straified sample     
    stratifiedSample = pd.concat(sampleRows)
    # Deleting the label coulumn which was made above
    del stratifiedSample['label']
    return stratifiedSample

# Principal component analysis (PCA) is a statistical procedure that uses an orthogonal transformation to convert
# a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables
# called principal components. In short, reduce the dimensions.
def find_pca(data_frame_orig, no_of_comp):
    pca = PCA(n_components=no_of_comp) #Number of components to keep. if n_components is not set all components are kept:
    return pd.DataFrame(pca.fit_transform(data_frame_orig))

def find_pca_eigen(data_frame_orig, max_component_count):
	index_arr = list(range(1, max_component_count + 1))
	pca = PCA(n_components=max_component_count)
	pcaSample = pd.DataFrame(pca.fit_transform(data_frame_orig))
	return pd.DataFrame({
		'index_arr': index_arr,
		'pca_variance': pca.explained_variance_
	})

def find_pca_loadings(data_frame_orig, component_count):
	pca = PCA(n_components=component_count)
	pcaSample = pd.DataFrame(pca.fit_transform(data_frame_orig))
	loadings_comp = pd.DataFrame(pca.components_)
	loadings_mat = loadings_comp.applymap(np.square)
	loadings = loadings_mat.transpose().sum(axis=1)
	return pd.DataFrame({
		'index_name': data_frame_orig.columns,
		'pca_loadings': loadings
	})

def find_top_three(data_frame, component_count):
	loadings = find_pca_loadings(data_frame, component_count)
	loadings_sorted = loadings.sort_values(by='pca_loadings', ascending=False)
	# print(loadings_sorted)
	return pd.DataFrame({
		loadings_sorted['index_name'].iloc[0]: data_frame[loadings_sorted['index_name'].iloc[0]],
		loadings_sorted['index_name'].iloc[1]: data_frame[loadings_sorted['index_name'].iloc[1]],
		loadings_sorted['index_name'].iloc[2]: data_frame[loadings_sorted['index_name'].iloc[2]]
	})


def find_elbow_kmeans(data_frame, max_cluster_count, fraction):
	sse = []
	cluster = list(range(1, max_cluster_count))
	for i in range(1,max_cluster_count):
		k_means = Kcluster.KMeans(n_clusters=i).fit(data_frame)
		sse.append(math.floor(k_means.inertia_))

	return pd.DataFrame({
		'cluster': cluster,
		'sse': sse
	})

 
# Multidimensional scaling
def find_MDS(dataframe, type):
	dis_mat = SK_Metrics.pairwise_distances(dataframe, metric = type)
	mds = MDS(n_components=2, dissimilarity='precomputed')
	return pd.DataFrame(mds.fit_transform(dis_mat))

# Creating file by joining random sample and stratified sample
def createFile(random_sample, stratified_sample, file_name):
	random_sample["type"] = pd.Series("random", index=random_sample.index)
	stratified_sample["type"] = pd.Series("stratified", index=stratified_sample.index)
	if len(random_sample.columns) == 3:
		random_sample.columns = ["x","y","type"]
		stratified_sample.columns = ["x","y","type"]
	elif len(random_sample.columns) == 4:
		random_sample.columns = ["x","y","r","type"]
		stratified_sample.columns = ["x","y","r","type"]
	sample = pd.concat([random_sample, stratified_sample])
	file_name = data_path + file_name
	sample.to_csv(file_name, sep=',', index=False)



def calculate_values(random_sample, stratified_sample, function, file_name,component_count):
	createFile(function(random_sample, component_count), function(stratified_sample,component_count), file_name + ".csv")


# Main Function
def main():
	fraction = 0.3
	num_dim = 13
	#Creating panda dataframe from the csv
	data_frame_original = pd.read_csv("data/dengue.csv")
	data_frame_original = data_frame_original.fillna(method='ffill')
	#Calling function to getrandom sampled data with faction = 0.3
	random_sampled_data = random_sampling(data_frame_original,fraction)
	#Calling function to get stratified sample data with number of clusers = 10 and fraction = 0.3
	stratified_sampled_data = stratified_sampling(data_frame_original,3,fraction)
	random_sample_normalized = (random_sampled_data - random_sampled_data.mean()) / random_sampled_data.std()
	stratified_sample_normalized = (stratified_sampled_data - stratified_sampled_data.mean()) / stratified_sampled_data.std()

	createFile(find_elbow_kmeans(random_sample_normalized, num_dim, fraction), find_elbow_kmeans(stratified_sample_normalized, num_dim, fraction), 'elbow.csv')
	calculate_values(random_sample_normalized, stratified_sample_normalized, find_pca_eigen, 'eigen', num_dim)
	calculate_values(random_sample_normalized, stratified_sample_normalized, find_pca_loadings, 'loading', 4)
	calculate_values(random_sample_normalized, stratified_sample_normalized, find_pca, 'pca', 2)
	calculate_values(random_sample_normalized, stratified_sample_normalized, find_top_three, 'three', 4)


	list_mds = ["euclidean","correlation"]
	for type_mds in list_mds:
		createFile(find_MDS(random_sampled_data,type_mds),find_MDS(stratified_sampled_data,type_mds),type_mds + ".csv")

main()



 
