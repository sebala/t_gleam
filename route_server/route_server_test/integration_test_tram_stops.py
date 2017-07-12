
#!/usr/bin/env
# -*- coding: utf-8 -*-

from unittest import TestCase, main
from route_server import DataGateway
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
            bad_halt_ids = (2300, 3010)
            )
class TestDataGateway(TestCase):
    def test_bad_halt_ids_excluded(self):
        should_be_empty_json_list = dg.get_tramstop(2300)
        empty = json.loads(should_be_empty_json_list)
        self.assertEqual(0, len(empty))
        self.assertEqual(list, type(empty))

    def test_bad_halt_ids_excluded_geo_loc(self):
        should_be_empty_json_list = dg.get_geo_loc(2300)
        empty = json.loads(should_be_empty_json_list)
        self.assertEqual(0, len(empty))
        self.assertEqual(list, type(empty))

    def test_geo_loc_returns_returns_first_match(self):
        list_len_one = dg.get_geo_loc(143)
        geo_loc = json.loads(list_len_one)[0]
        self.assertEqual(47.360017, geo_loc['GPS_Latitude'])
        self.assertEqual(8.456337, geo_loc['GPS_Longitude'])

    def test_get_lines(self):
        lines = dg.get_lines()
        #Just three tram lines in the test file...
        known_lines =  {2, 3, 4}
        res = set(lines)
        self.assertEqual(known_lines, res)

    def test_get_route_items(self):
        #get the route for line number 3...
        route_3_stops = dg.get_route_items(3)
        #might be worth adding a some more fakes to the test data rather than
        #having this mess...
        expected = {1541, 1938, 2582, 1305, 2713, 1306, 2870, 2871, 2248, 2250,
                    2251, 2640, 2641, 2262, 1502, 2256, 1905, 1906, 2810, 1531,
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
        expected = [
            {'from_halt_id' : 0, 'to_halt_id' : 1, 'count' : 1}
        ]

        expected = pd.read_csv('./data/test_data/results_ten_thou_test_get_leg_counts.csv')
        print(expected.columns) 

if __name__ == '__main__':
    main(exit=False)
