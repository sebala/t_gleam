import pickle
def replace_colon(s):
    if s is not None:
        return s.replace(':','___')
with open('./x_var3.pkl','rb') as f:
    var3 = pickle.load(f)

with open('./x_costs.pkl','rb') as f:
    costs3 = pickle.load(f)


with open('./x_stops.pkl','rb') as f:
    stops = pickle.load(f)

from .astar import Puzzle, Action, Path


def get_tram_stops():
    a = stops[['stop_id','stop_name']]
    a['halt_lang'] = a['stop_name']
    a['halt_id'] = a['stop_id']
    return a[['halt_id','halt_lang']].to_json(orient='records')

def get_geo_loc(halt_id):
    res = stops[stops['stop_id']==halt_id]
    res['halt_id'] = res['stop_id']
    res['GPS_Latitude'] = res['stop_lat']
    res['GPS_Longitude'] = res['stop_lon']

    return res[['halt_id','GPS_Latitude', 'GPS_Longitude']][:1].to_json(orient='records')

get_coordinates = get_geo_loc
class ActionFactory:
    def __init__(self, path_dict, costs):
        self.path_dict = path_dict
        self.costs = costs
    def actions(self, path):
        result = []
        #if path.end in self.path_dict:
        for target in self.path_dict[path.end]:
            action = Action(end=target, cost=self.costs[(path.end, target)])
            result.append(action)
        return result

actions = ActionFactory(var3, costs3).actions
search_route_by = Puzzle(actions).graph_search
