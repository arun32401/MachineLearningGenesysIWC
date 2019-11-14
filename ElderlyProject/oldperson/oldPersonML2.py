'''
Created on 06-Nov-2019

@author: achauhan
'''
import pandas as pd
import numpy as np
# from sklearn.metrics import train_test_split
from xgboost import XGBClassifier
from unittest.mock import inplace
from pyexpat import model
# from sklearn.metrics import accuracy_score
# from sklearn.metrics import confusion_matrix


def pre_process(df):
    df = pd.read_excel("MLTest.xlsx")
    print(df.head())
    print(df.describe())
    
    
def training():
    df = pd.read_excel("MLTest.xlsx")
    df = pre_process(df)
    y = df["DEYE"]
    df.drop("DEYE", axis="columns", inplace=True)
    x = df
    model = XGBClassifier()
#     x_train, x_test, y_train, y_test = tra
    model.fit(x,y)
    print(model.score(x,y))
    yp = model.predict(x)
#     cm=confusion_matrix(y, yp)
    
def pred():
    pass
    
    
    