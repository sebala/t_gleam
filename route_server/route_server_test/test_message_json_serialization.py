
import json
from unittest import TestCase, main
import json
#TODO Import via __init__ vs from route_server.messages...
#probably does matter much either way...
from route_server import GeoPosition, GeoPath, to_json_message
from route_server.messages import JourneyInfo, JourneyLeg
"""Check the message objects - passed from client to server
- serialize to json as expected. Fairly boring 'this
should never fail tests.'"""

#hmmm... generate json schema for the message dtos???

class GeoPositionTest(TestCase):
    def setUp(self):
        p1 = GeoPosition(1.2, 2.4)
        p2 = GeoPosition(3.4, 5.4)
        decorations = {'len' : 5.4}
        self.path = GeoPath([p1,p2], decorations)

        self.json_str =to_json_message(self.path)
        #Note: Now using the standard library to turn the json_str in
        #to a normal dict...
        self.path_as_dict = json.loads(self.json_str)

    def test_decorations(self):
        self.assertTrue('decorations' in self.path_as_dict)
        decorations = self.path_as_dict['decorations']
        self.assertTrue('len' in decorations)
        self.assertEqual(self.path.decorations['len'], decorations['len'])
        self.assertEqual(5.4, decorations['len'])

    def test_positions(self):
        self.assertTrue('positions' in self.path_as_dict)
        positions = self.path_as_dict['positions']
        self.assertEqual(2, len(positions))
        self.assertEqual(self.path.positions[0].GPS_Latitude, positions[0]['GPS_Latitude'])
        self.assertEqual(self.path.positions[0].GPS_Longitude, positions[0]['GPS_Longitude'])
        self.assertEqual(self.path.positions[1].GPS_Latitude, positions[1]['GPS_Latitude'])
        self.assertEqual(self.path.positions[1].GPS_Longitude, positions[1]['GPS_Longitude'])

class JourneyInfoTest(TestCase):
    def setUp(self):
        leg_0 = JourneyLeg(
            halt_id_0=0,
            halt_id_1=1,
            decorations={
                'weight':5,
                'name':'tram 2 leg'}
            )
        self.journey_info = JourneyInfo(jounery_legs=[leg_0])

    def test_journey_legs_simple(self):
        json_msg = to_json_message(self.journey_info)
        info_dict = json.loads(json_msg)
        self.assertTrue('jounery_legs' in info_dict)
        legs = info_dict['jounery_legs']
        self.assertEqual(1, len(legs))
        leg = legs[0]
        self.assertTrue('halt_id_0' in leg)
        self.assertTrue('halt_id_1' in leg)
        self.assertTrue('decorations' in leg)
        self.assertTrue('weight' in leg['decorations'])
        self.assertEqual(5,  leg['decorations']['weight'])
        self.assertTrue('name' in leg['decorations'])
        self.assertEqual('tram 2 leg',  leg['decorations']['name'])

    def test_journey_info_no_decorations_specified(self):
        """Ensure that if we don't specify decorations on the journey leg_0
        it still gets created; the client expects this even if it is empty"""
        leg = JourneyLeg(0,1)
        journey_info = JourneyInfo([leg])
        json_msg = to_json_message(self.journey_info)
        info_dict = json.loads(json_msg)
        self.assertTrue('decorations' in info_dict['jounery_legs'][0])
if __name__ == '__main__':
    main(exit=False)
