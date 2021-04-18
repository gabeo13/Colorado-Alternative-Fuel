

# Import our modules
import requests
from pandas.io.json import json_normalize
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from flask import Flask, render_template, jsonify
import pymongo

# Create an instance of our Flask app.
app = Flask(__name__)

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# create database
db = client.charging_stationDB


@app.route("/")
def Index():
    return render_template('index.html')
# def home():
#     return (
#         f"Welcome to the Charging Stations DataBase!<br/>"
#         f"<br/>"
#         f"Below route returns all Charging Stations from database<br/>"
#         f"/api/v1.0/Charging_Stations<br/>"
#         f"<br/>"
#         f"Below route returns all Charging Stations from database<br/>"
#         f"/api/v1.0/City_Charging_Stations<br/>"
#         f"<br/>"
#     )


@app.route("/api/v1.0/Charging_Stations")
def all_stations():
    # Store collection in a list
    Charging_Station_Records = db.charging_stations.find()

    # Create empty list and fill with collection records
    # data = []

    # for item in Charging_Station_Records:
    #     charging_stations_dict = {}
    #     try:
    #         charging_stations_dict['fuel_type_code'] = item['fuel_type_code']
    #         charging_stations_dict['station_name'] = item['station_name']
    #         charging_stations_dict['street_address'] = item['street_address']
    #         charging_stations_dict['state'] = item['state']
    #         charging_stations_dict['latitude'] = item['latitude']
    #         charging_stations_dict['longitude'] = item['longitude']
    #         charging_stations_dict['station_phone'] = item['station_phone']
    #         charging_stations_dict['status_code'] = item['status_code']
    #         charging_stations_dict['groups_with_access_code'] = item['groups_with_access_code']
    #         charging_stations_dict['id'] = item['id']
    #         charging_stations_dict['owner_type_code'] = item['owner_type_code']
    #         charging_stations_dict['Zip Code'] = item['Zip Code']
    #         charging_stations_dict['City'] = item['City']
    #         charging_stations_dict['County'] = item['County']
    #         charging_stations_dict['Population'] = item['Population']
    #         charging_stations_dict['Average Household Income'] = item['Average Household Income']
    #         data.append(charging_stations_dict)
    #     except:
    #         pass

#     return jsonify({'data': data[0:2]})
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
