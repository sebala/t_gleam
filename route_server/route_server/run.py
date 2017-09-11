# TODO - Add timing monitoring/logging to the calls...
# TODO - would be amazing to provide json type information on the calls
from flask import json, Flask, jsonify,abort, request
import requests
from datetime import timedelta, datetime
from flask import make_response, request, current_app
from functools import update_wrapper
from flask_cors import CORS, cross_origin
from  .tram_stops import configure
import uuid
from .messages import to_json_message, JourneyLeg, JourneyInfo
from functools import wraps

"""Contains main entry points for REST services"""

app = Flask(__name__)
app.config['DEBUG'] = True
get_tram_stops, get_geo_loc, search_route_by, get_leg_counts, get_geo_locs = configure()

CORS(app)

import logging
from logging.handlers import RotatingFileHandler
handler = RotatingFileHandler('foo.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.DEBUG)
app.logger.addHandler(handler)

logging.basicConfig(filename="./log/user_activity.log", level=logging.DEBUG)
user_activity_log = logging.getLogger('user_activity')
user_activity_handler = RotatingFileHandler('./log/user_activity.log', maxBytes=10000, backupCount=1)
user_activity_handler.setLevel(logging.DEBUG)
user_activity_log.addHandler(user_activity_handler)


def log_user_activity(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        #TODO Better formatting for the logs... json?
        start = datetime.now()
        debug_strings = []
        debug_strings.append('User activity....')
        debug_strings.append(str(start))
        debug_strings.append('Request headers:\n{headers}'.format(headers=str(request.headers)))
        result = func(*args, **kwargs)
        delta = datetime.now() - start
        debug_strings.append('End:{delta} ms'.format(delta=delta.microseconds/1000))
        user_activity_log.debug('\n'.join(debug_strings))
        return result
    return decorated_function

@app.route('/soll_ist')
@log_user_activity
def soll_ist():
    """Return a collection of info about the tram stops"""
    data = get_tram_stops()
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/geo_loc/<int:halt_id>')
@log_user_activity
def geo_loc(halt_id):
    """Given a tram stop id, return the longitude, latitude et c.
    See GeoPosition"""
    data = get_geo_loc(halt_id)
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/geo_locs')
@log_user_activity
def geo_locs():
    """See geo_loc; this returns information for all tram stops"""
    data = get_geo_locs()
    response = app.response_class(
        response=to_json_message(data),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/line_stats/<int:linie_id>')
@log_user_activity
def tram_line_stats(linie_id):
    """Return all the tram stops for given tram number"""
    app.logger.debug('tram_line_stats' + str(linie_id))
    result = get_leg_counts(linie_id)
    json_result = to_json_message(result)
    app.logger.debug('result::'+ json_result)
    response = app.response_class(
        response=json_result,
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/search_route/<int:from_halt_id>/<int:to_halt_id>', methods=['GET'])
@log_user_activity
def search_route(from_halt_id, to_halt_id):
    route = search_route_by(from_halt_id, to_halt_id)
    stop_ids = [x[0] for x in route.extract_path()]
    paths = []
    for s1, s2 in zip(stop_ids,stop_ids[1:]):
        paths.append(JourneyLeg(s1, s2))

    journey_info = JourneyInfo(paths)

    response = app.response_class(
        response=to_json_message(journey_info),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/foo/search_route', methods=['POST', 'OPTIONS'])
@log_user_activity
def search_route_post():
    if request.method=='POST':
        json = request.get_json(silent=True)

        from_halt_id = json['from_halt_id']
        to_halt_id = json['to_halt_id']

        app.logger.info(', '.join((from_halt_id, to_halt_id)))
        route = search_route_by(from_halt_id, to_halt_id)
        app.logger.info(str(route))

        stop_ids = [x[0] for x in route.extract_path()]
        geos ='[' + ',\n'.join(map(get_geo_loc, stop_ids)) + ']'

        response = app.response_class(
            response=geos,
            status=200,
            mimetype='application/json'
        )
        return response
    else:
        return app.response_class(
            status=200,
            mimetype='application/json'
        )

@app.route('/foo/get_loc', methods=['POST', 'OPTIONS'])
@log_user_activity
def geo_loc_post():
    if request.method=='POST':
        val = request.get_json(silent=True)
        data = get_geo_loc(val['halt_id'])
        response = app.response_class(
            response=data,
            status=200,
            mimetype='application/json'
        )
        return response
    else:
        return app.response_class(
            status=200,
            mimetype='application/json'
        )
