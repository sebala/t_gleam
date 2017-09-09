import pandas as pd
import numpy as np
from route_server import Puzzle
from .messages import GeoPath, GeoPosition, to_json_message
def parseFloat(s):
    if type(s)==str:
        return float(s.replace(',','.'))
    if type(s)==float:
        return s


#TODO Not sure if it should return json strings, or real python objects; lists et c.
#At the moment, this is a mix of both; deciding on a serialization strategy
#for the layers is defered. E.g. Should the services themselves expose a
#schema for the results...

class DataGateway:
    def _filter_badies(
        self,
        baddies):
        """Remove junk data from the set:
        i.e. The baddies listed below are all "technical tram stops"
        such as maintainance garages, or sheds."""


        df = self.df
        von_excludes = df['halt_id_von'].isin(baddies)
        nach_excludes = df['halt_id_nach'].isin(baddies)
        self.df = df[~(von_excludes|nach_excludes)]

        hp = self.halte_punkt
        self.halte_punkt = hp[~(hp['halt_id'].isin(baddies))]

        hs = self.soll_ist_stops
        self.soll_ist_stops = hs[~(hs['halt_id'].isin(baddies))]

    def _set_primary_stop(self):
        """Each haltepunkt (stop) has multiple entries for
        each halt_id. In order to collapse this down on a single
        halt_id, define two criteria for setting "primary"
        - if the stop is active ('halt_punkt_ist_aktiv')
        - use the minimum halt_punkt_id for each halt_id
        After this call, each halt_id should have a unique 'is_primary'
        set"""
        self.halte_punkt = self.halte_punkt[self.halte_punkt['halt_punkt_ist_aktiv']]
        self.halte_punkt['is_primary'] = 0
        hp = self.halte_punkt

        idx = hp.groupby(['halt_id'])['halt_punkt_id'].transform(min)==hp['halt_punkt_id']

        self.halte_punkt.loc[idx, 'is_primary'] = 1

    def __init__(self,
            haltestelle_path = './data/haltestelle.csv',
            haltepunkt_path = './data/haltepunkt.csv',
            soll_ist_path = './data/fahrzeitensollist2017010120170107.csv',
            bad_halt_ids = (2300, 3010, 2514, 1736, 3102, 2023, 2251, 2299, 2081, 2144, 2301)

        ):
        self.soll_ist_stops = pd.read_csv(haltestelle_path)
        self.halte_punkt = pd.read_csv(haltepunkt_path)
        self.halte_punkt = self.halte_punkt.dropna()
        self.halte_punkt['GPS_Longitude'] = self.halte_punkt['GPS_Longitude'].apply(parseFloat)
        self.halte_punkt['GPS_Latitude'] = self.halte_punkt['GPS_Latitude'].apply(parseFloat)
        self._set_primary_stop()
        self.df = pd.read_csv(soll_ist_path)
        #TODO - This will likely have nasty effects...
        self.df = self.df.dropna()
        #When analysing journey times for from/to halts, order  should not be taken in to account
        #Therefore, set up tw columns min(halt_id_von, halt_id_nach),
        #and max(halt_id_von, halt_id_nach) to remove this ordering
        self.df['halt_id_0'] = self.df[['halt_id_von','halt_id_nach']].min(axis=1)
        self.df['halt_id_1'] = self.df[['halt_id_von','halt_id_nach']].max(axis=1)
        self._filter_badies(bad_halt_ids)

    def get_tram_stops(self):
        a = self.soll_ist_stops[['halt_id','halt_diva', 'halt_kurz', 'halt_lang', 'halt_ist_aktiv']]
        return a.to_json(orient='records')

    def get_tramstop(self, halt_id):
        hp = self.soll_ist_stops
        return hp[hp['halt_id']==halt_id].to_json(orient='records')

    def get_lines(self):
        return self.df['linie'].unique()

    def get_leg_counts(self, linie):
        """Return the count of each from/to halte_id pair. Ese the unordered
        (halt_id_0, halt_id_1) for countings the pairs.
        Result will be a list of json with the structure:
        [{'halt_id_0' : int, 'halt_id_1' : int, 'frequency' : int}]"""
        tmp = self.df[self.df['linie']==linie]
        #frequencies = tmp.groupby(['halt_id_0','halt_id_1']).size().reset_index(name='frequency')
        frequencies = tmp.groupby(['halt_id_0','halt_id_1']).agg(
            [
                np.size,
                np.mean,
                np.var]
            ).reset_index()
        from .messages import JourneyLeg, JourneyInfo
        def to_JourneyLeg(row):
            return JourneyLeg(
                int(row[0]),
                int(row[1]),
                decorations={
                    'frequency' : int(row[2]),
                    'mean' : float(row[3])}
            )

        legs = list(map(to_JourneyLeg, frequencies.values))
        journey = JourneyInfo(legs)
        return journey

    def get_route_items(self, linie):
        route_filtered =self.df[self.df['linie']==linie]
        von = route_filtered['halt_id_von'].unique()
        nach = route_filtered['halt_id_nach'].unique()
        return set(np.union1d(von,nach))

    def get_geo_locs(self):
        hp = self.halte_punkt
        cond2 = hp['is_primary']==True
        def to_GeoPosition(row):
            return GeoPosition(
                row['GPS_Latitude'],
                row['GPS_Longitude'],
                row['halt_id'],
                row['halt_punkt_id'],
                row['is_primary']
            )
        return hp[cond2].apply(to_GeoPosition, axis=1).tolist()

    def get_geo_loc(self, halt_id):
        hp = self.halte_punkt
        res = hp[hp['halt_id']==halt_id]
        return res[['halt_id','GPS_Latitude', 'GPS_Longitude']][:1].to_json(orient='records')

    def create_searcher(self):
        df = self.df
        df['journey_time'] =df['ist_an_nach1']-df['ist_an_von']
        FOUR_HOURS = 60*60*4
        filtered = df[(df['journey_time']< FOUR_HOURS) & df['journey_time']> 0]
        mean_journey_times = filtered.groupby(['halt_id_von', 'halt_id_nach'])['journey_time'].mean()
        from collections import defaultdict
        from route_server import Action

        from_to = defaultdict(list)
        cost_dict = dict()
        for (halt_id_von, halt_id_nach), cost in mean_journey_times.items():
            from_to[halt_id_von].append(halt_id_nach)
            cost_dict[(halt_id_von, halt_id_nach)] = cost

        class ActionFactory:
            def __init__(self, path_dict, costs):
                """path_dict contains successors for a halt_id
                costs contains the journey time in seconds for a leg, keyed by (from_halt_id, to_halt_id)"""
                self.path_dict = path_dict
                self.costs = costs

            def actions(self, path):
                """Return all valid paths, and costs, for the from_halt_id"""
                result = []
                for target in self.path_dict[path.end]:
                    #action = Action(end=target, cost=self.costs[(path.end, target)])
                    action = Action(end=target, cost=1.0)
                    result.append(action)
                return result

        Actions = ActionFactory(from_to,cost_dict).actions
        search = Puzzle(Actions).graph_search
        return search


def configure():
    gateway = DataGateway()

    ##EXPORTS
    get_tram_stops = gateway.get_tram_stops
    get_geo_loc = gateway.get_geo_loc
    search_route_by = gateway.create_searcher()
    get_leg_counts = gateway.get_leg_counts
    get_geo_locs = gateway.get_geo_locs
    return get_tram_stops, \
            get_geo_loc, \
            search_route_by, \
            get_leg_counts, \
            gateway.get_geo_locs
