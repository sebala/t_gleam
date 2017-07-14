# TODO - Add timing monitoring/logging to the calls...
# TODO - would be amazing to provide json type information on the calls
from flask import json, Flask, jsonify,abort, request
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from flask_cors import CORS, cross_origin
from  .tram_stops import configure
#from  .preloaded import get_tram_stops, get_geo_loc, search_route_by
from .messages import to_json_message, JourneyLeg, JourneyInfo


app = Flask(__name__)
app.config['DEBUG'] = True
get_tram_stops, get_geo_loc, search_route_by, get_leg_counts, get_geo_locs = configure()

CORS(app)

import logging
from logging.handlers import RotatingFileHandler
handler = RotatingFileHandler('foo.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.DEBUG)
app.logger.addHandler(handler)

@app.route('/soll_ist')
def soll_ist():
    data = get_tram_stops()
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/geo_loc/<int:halt_id>')
def geo_loc(halt_id):
    data = get_geo_loc(halt_id)
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/geo_locs')
def geo_locs():
    data = get_geo_locs()
    response = app.response_class(
        response=to_json_message(data),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/line_stats/<int:linie_id>')
def tram_line_stats(linie_id):
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
def search_route(from_halt_id, to_halt_id):
    route = search_route_by(from_halt_id, to_halt_id)
    stop_ids = [x[0] for x in route.extract_path()]
    #geos ='[' + ',\n'.join(map(get_geo_loc, stop_ids)) + ']'
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
def search_route_post():
    if request.method=='POST':
        val = request.get_json(silent=True)
        from_halt_id, to_halt_id = val['from_halt_id'], val['to_halt_id']
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
            #response=data,
            status=200,
            mimetype='application/json'
        )
