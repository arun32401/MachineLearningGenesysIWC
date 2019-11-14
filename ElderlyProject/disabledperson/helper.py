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
from _ast import Try, With, If
from copyreg import pickle
import pickle
import os
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from symbol import if_stmt


def pre_process(df):
    print("--------------------------Inside pre process ----------------------------------------")
#     print(df.head())
#     print(df.describe())
#     print(df.info())
    return df
    
def training(df):
    df = pre_process(df)
    y_parameter = df['DEYE']
    df.drop("DEYE", axis="columns", inplace=True)
    x = df
#     dummyRow = pd.DataFrame(np.zeros(len(x.columns)).reshape(1, len(x.columns)), columns = x.columns)
#     dummyRow.to_csv("dummyRow.csv", index=False)
    
    model = XGBClassifier(n_estimators=10, max_depth=4, min_child_weight=9, objective = 'binary:logistic', scale_pos_weight= .9)
    model.fit(x,y_parameter)
#     pkl_filename = "pickle_model.pkl"
#     with open(pkl_filename, 'wb') as file:
#         pickle.dump(model, file)
    
    print("--------------------------training Score: ----------------------------------------")
    print(model.score(x,y_parameter))
    yp = model.predict(x)
    cm=confusion_matrix(y_parameter, yp)
    print("--------------------------Confussion matrix: ----------------------------------------")
    print(cm)
    
def pred(ob):
    print("--------------------------Inside predict method----------------------------------------")
    d1=ob.to_dict()
    df = pd.DataFrame(d1, index=[0])
    #     df.drop("DEYE", axis="columns", inplace=True)
    df = pre_process(df)
    dummrrow_filename = "./dummyRow.csv"
    dummrrow_filename= os.path.dirname(__file__)+"/"+dummrrow_filename
    df2 = pd.read_csv(dummrrow_filename)
    for c1 in df.columns:
        df2[c1]= df[c1]
    pkl_filename = "pickle_model.pkl" 
    pkl_filename= os.path.dirname(__file__)+"/"+pkl_filename   
    with open(pkl_filename, 'rb') as file:
        model = pickle.load(file)
    print(df2)
    df2 = df2.astype(convert_dict)
    pred = model.predict(df2) 
    return pred   

convert_dict = {'PUMA': int, 
                'ST': int,
                'AGEP': int,
                'SEX': int
               }
    
if __name__  =="__main__":
    print("--------------------------Inside main method ----------------------------------------")
#     df = pd.read_excel("MLTest.xlsx")
#     df = pd.read_csv("MLTest.csv")
#     df1 = pd.read_csv("ss13pusa.csv")
    df1 = pd.read_csv("ss13pusb.csv")
#     df_all_rows = pd.concat([df1, df2])
#     print(df_all_rows.head())
#     print(df_all_rows.describe())
#     print(df_all_rows.info())
    dict ={'PUMA' : df1['PUMA'],
            'ST' : df1['ST'],
            'AGEP' : df1['AGEP'],
            'SEX' : df1['SEX'],
            'DEYE' : df1['DEYE']
            }
    df = pd.DataFrame(dict)
    df.to_csv('Data2.csv')
#     df = pd.read_csv("Data2.csv")
    print(df.head())
    print(df.describe())
    print(df.info())
    print("END")
#     training(df)