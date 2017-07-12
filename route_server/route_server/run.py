# hello_world.py

from flask import Flask, jsonify
app = Flask(__name__)

from flask import json
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from flask_cors import CORS, cross_origin
from  .tram_stops import configure
#from  .preloaded import get_tram_stops, get_geo_loc, search_route_by

get_tram_stops, get_geo_loc, search_route_by = configure()

CORS(app)

import logging
from logging.handlers import RotatingFileHandler
handler = RotatingFileHandler('foo.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.DEBUG)
app.logger.addHandler(handler)

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


@app.route('/soll_ist')
@crossdomain(origin='*')
def soll_ist():
    data = get_tram_stops()
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/geo_loc/<int:halt_id>')
@crossdomain(origin='*')
def geo_loc(halt_id):
    data = get_geo_loc(halt_id)
    response = app.response_class(
        response=data,
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/search_route/<int:from_halt_id>/<int:to_halt_id>', methods=['GET'])
@crossdomain(origin='*')
def search_route(from_halt_id, to_halt_id):
    route = search_route_by(from_halt_id, to_halt_id)
    stop_ids = [x[0] for x in route.extract_path()]
    geos ='[' + ',\n'.join(map(get_geo_loc, stop_ids)) + ']'

    response = app.response_class(
        response=geos,
        status=200,
        mimetype='application/json'
    )
    return response

from flask import abort, request
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
        return search_route_by(val['from_halt_id'], val['to_halt_id'])
    else:
        return app.response_class(
            status=200,
            mimetype='application/json'
        )
#@app.route('/foo/geo_loc', methods=['GET','POST', 'OPTIONS'])
#@crossdomain(origin='*')
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
