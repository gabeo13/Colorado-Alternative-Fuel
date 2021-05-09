# Import our modules
import requests
from pandas.io.json import json_normalize
import pandas as pd
import numpy as np
from flask import Flask, render_template, jsonify
import pymongo
import os

# os.getenv("mapbox_key")

# Create an instance of our Flask app.
app = Flask(__name__)

# Create connection variable
# conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
# client = pymongo.MongoClient(conn)


client = pymongo.MongoClient(
    f"mongodb+srv://power_user:{os.environ.get('mongo_pw')}@heroku-cluster.hdjnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")


# create database
db = client.charging_stationDB


@app.route("/")
def Index():
    return render_template('index.html')


@app.route("/api/v1.0/Charging_Stations")
def all_stations():
    # Store collection in a list
    Charging_Station_Records = db.charging_stations.find()

    data = []
    for item in Charging_Station_Records:
        item_dict = {}
        for k, v in item.items():
            # and (v != False) and (v.isNaN() == False):
            if (k != '_id') and (not isNaN(v)):
                item_dict[k] = v
        data.append(item_dict)
    return jsonify(data)


def isNaN(num):
    return num != num


@ app.route("/api/v1.0/City_Charging_Stations")
def city_stations():
    # Store collection in a list
    Charging_Station_Records = db.charging_stations.find()
    # Create empty list and fill with collection records
    data = []
    for item in Charging_Station_Records:
        charging_stations_dict = {}
        charging_stations_dict['fuel_type_code'] = item['fuel_type_code']
        charging_stations_dict['City'] = item['City']
        data.append(charging_stations_dict)

    data_df = pd.DataFrame(data)
    city = data_df.groupby('City').count()
    city_dict = city.to_dict()

    return jsonify(city_dict)


if __name__ == "__main__":
    app.run(debug=True)
