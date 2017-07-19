
#!/usr/bin/env
# -*- coding: utf-8 -*-

from unittest import TestCase, main
from route_server import DataGateway, to_json_message
import json
import pandas as pd

"""
Testing data access is notoriously difficult; rather than mocking the
data, these tests use a known data in ./data/test_data.

The test assertion results were created by opening the csv files
in *everyones* favorite spreadsheet using pivot tables...

Note: the data is only loaded once for all test cases; each load takes around
.07 seconds so sacrificing a bit of "philosophical purity" for a bit
performance. *As long as the tests don't mutate the DataGateway all will
be fine* *mwa-ha-ha*"""

dg = DataGateway(haltestelle_path = './data/haltestelle.csv',
            haltepunkt_path = './data/haltepunkt.csv',
            soll_ist_path = './data/test_data/ten_thou.csv',
            bad_halt_ids = (2300, 3010, 2251)
            )
class TestDataGateway(TestCase):
    def test_bad_halt_ids_excluded(self):
        should_be_empty_json_list = dg.get_tramstop(2300)
        empty = json.loads(should_be_empty_json_list)
        self.assertEqual(0, len(empty))
        self.assertEqual(list, type(empty))


    def test_bad_halt_ids_excluded_geo_loc(self):
        locs = dg.get_geo_locs()
        my_locs = {loc.halt_id : loc for loc in locs}
        self.assertTrue(2300 not in my_locs)

    def test_geo_loc_returns_returns_first_match(self):
        locs = dg.get_geo_locs()
        my_locs = {loc.halt_id : loc for loc in locs}
        geo_loc = my_locs[143]
        self.assertEqual(47.360035, geo_loc.GPS_Latitude)
        self.assertEqual(8.456297, geo_loc.GPS_Longitude)

    def test_get_lines(self):
        lines = dg.get_lines()
        #Just three tram lines in the test file...
        known_lines =  {2, 3, 4}
        res = set(lines)
        self.assertEqual(known_lines, res)

    def test_get_leg_counts_should_exclude_baddies(self):
        route = dg.get_leg_counts(linie=2)
        #Seems that #2 includes tramstop 2251 in its route

        legs = route.jounery_legs
        halt_0 = set((leg.halt_id_0 for leg in legs))
        halt_1 = set((leg.halt_id_1 for leg in legs))
        all_stops = halt_0.union(halt_1)


        self.assertFalse(2251 in all_stops)


    def test_get_route_items(self):
        #get the route for line number 3...
        route_3_stops = dg.get_route_items(3)
        #might be worth adding a some more fakes to the test data rather than
        #having this mess...
        expected = {1541, 1938, 2582, 1305, 2713, 1306, 2870, 2871, 2248, 2250,
                    2640, 2641, 2262, 1502, 2256, 1905, 1906, 2810, 1531,
                    1406, 1535}
        self.assertEqual(expected, route_3_stops)


    def test_search(self):
        search_route_by = dg.create_searcher()
        #in this test, deliberately choose 2 stations next to eachother
        #on the same line; we're really testing that everything is wired
        #up correctly; see test_astar for tests of the algorithm
        route = search_route_by(2613, 2536)
        stop_ids = {x[0] for x in route.extract_path()}
        self.assertEqual({2613, 2536}, stop_ids)


    def test_get_leg_counts(self):
        #Structure - expected = {'halt_id_0' : 0, 'halt_id_1' : 1, 'frequncy' : 1}
        #First load the expected values, and store each pair (halt_id_0, halt_id_1)
        #in a dictionary. This will be used to compare against the actual values
        expected = pd.read_csv('./data/test_data/results_ten_thou_test_get_leg_counts.csv',
            sep='\t')
        count_dict = dict()
        for halt_id_0, halt_id_1, count in expected.values:
            _min = min(halt_id_0, halt_id_1)
            _max = max(halt_id_0, halt_id_1)
            count_dict[(_min, _max)] = count

        #Do the real call, and then compare the results against the expected
        legcounts = dg.get_leg_counts(linie=2)
        self.assertEqual(len(count_dict.keys()), len(legcounts.jounery_legs))
        for realcount in legcounts.jounery_legs:

            _min = realcount.halt_id_0
            _max = realcount.halt_id_1
            freq = realcount.decorations['frequency']
            self.assertEqual(count_dict[_min, _max], freq)


    def test_set_primary_stop(self):
        """Check that each halt_id has a primary stop set correctly
        for it.
        Take a look in to the test data spreadsheet to get the expected data
        See DataGateway._set_primary_stop"""
        locs = dg.get_geo_locs()
        my_locs = {loc.halt_id : loc for loc in locs}
        self.assertEqual(13469, my_locs[143].halt_punkt_id)

    def test_nearest_stop(self):
        """Given a lat and long, return the nearest stop"""
        from scipy.spatial import distance
        #halt_id = dg.nearest_stop(180.0,0.0)
        halt_id = dg.nearest_stop(47.3928,8.6206)
        self.assertEqual(2027, halt_id)
if __name__ == '__main__':
    main(exit=False)
