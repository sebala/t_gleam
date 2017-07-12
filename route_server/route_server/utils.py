import pandas as pd
locations = pd.read_csv('./data/haltepunkt.csv')

def get_coordinates(halt_id):
    loc = locations[locations['halt_id']==halt_id]
    vals = loc[['GPS_Latitude','GPS_Longitude']].values[0]
    return float(vals[0].replace(',','.')), float(vals[1].replace(',','.'))
