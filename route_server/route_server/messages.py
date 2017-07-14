import jsonpickle
from typing import List, Dict, Text, Any
"""Object used to communicate between UI and services"""
def to_json_message(obj):
    """Pickles an object defined here to a json string...
    giving it this strange name to differentiate between the
    millions of other to_json methods..."""
    return jsonpickle.encode(obj,unpicklable=False)

class GeoPosition:
  def __init__(self, GPS_Latitude: float, GPS_Longitude: float, halt_id : int = None, halt_punkt_id: int = None, is_primary: bool = False):
    self.GPS_Latitude = GPS_Latitude
    self.GPS_Longitude = GPS_Longitude
    self.halt_id = halt_id
    self.halt_punkt_id = halt_punkt_id
    self.is_primary = is_primary

class JourneyLeg:
    def __init__(self, halt_id_0, halt_id_1, decorations = None):
        if decorations is None:
            decorations = {}
        self.halt_id_0 = halt_id_0
        self.halt_id_1 = halt_id_1
        self.decorations = decorations

class JourneyInfo:
    def __init__(self, jounery_legs):
        self.jounery_legs = jounery_legs

class GeoPath:
  def __init__(self, positions : List[GeoPosition], decorations : Dict[Text, Any]):
    self.positions = positions
    self.decorations = decorations
