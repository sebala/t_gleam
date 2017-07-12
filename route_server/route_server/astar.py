#!/usr/bin/env
# -*- coding: utf-8 -*-

from collections import defaultdict
from heapq import heappush, heappop


class Action(object):
    """
    Models an action whic can be executed
    """
    def __init__(self, end, cost, estimated_cost=0):
        self.end = end
        self.cost = cost
        self.estimated_cost = estimated_cost

    def result(self, path):
        """Return the node when applying this action to the path"""
        return self.end

def build_verticies(list_of_tuples):
    """Given a list of tuples ((from_node_id, to_node_id), distance)
        return a dictionary keyed by node_id, containing a list of actions
        possible for the node.
        Note: We assume that the from to relationship is bidirectional
        i.e. for each tuple, two entries will be added to the dictionary
    """
    result = defaultdict(list)
    for (from_node, to_node), cost in list_of_tuples:
        from_action = Action(to_node, cost)
        result[from_node].append(from_action)
        to_action = Action(from_node, cost)
        result[to_node].append(to_action)

    return result

def build_actions(list_of_tuples):
    """Return ACTIONS function; each action returns a node given a path"""
    node_dict = build_verticies(list_of_tuples)
    ACTIONS = lambda path: node_dict[path.end]
    return ACTIONS

def build_verticies_with_estimates(list_of_tuples):
    """Given a list of tuples ((from_node_id, to_node_id), distance)
        return a dictionary keyed by node_id, containing a list of actions
        possible for the node.
        Note: We assume that the from to relationship is bidirectional
        i.e. for each tuple, two entries will be added to the dictionary
    """
    result = defaultdict(list)
    for (from_node, to_node), cost, estimate in list_of_tuples:
        from_action = Action(to_node, cost, estimate)
        result[from_node].append(from_action)
        to_action = Action(from_node, cost, estimate)
        result[to_node].append(to_action)
    return result

import itertools
c = itertools.count()

from functools import total_ordering

@total_ordering
class Path(object):
    """
    Path represents a path through the search space
    """
    def __init__(self, end, path_cost, parent = None):
        self.end = end
        self.path_cost = path_cost
        self.parent = parent

        self.id = next(c)
        self.extracted_path = None
        self.extracted_path = self.extract_path()

    def extend_path(self, end, path_cost):
        """Extend the current path and return a new path, with parent
        pointing to the current

        Note The Path does not change as part of this operation; rather a
        new Path element is constructed having parent == self
        """
        return self.combine(Action(end, path_cost))

    def combine(self, action):
        """Extend the current path and return a new path, with parent
        pointing to the current

        Note The Path does not change as part of this operation; rather a
        new Path element is constructed having parent == self
        """
        next_node = Path(action.end, self.path_cost + action.cost, parent=self)
        return next_node

    def extract_path(self):
        """Flattens self to a list of tuples containing
        (node, path_cost) pairs
        The first element will be the start of the path"""
        if self.extracted_path is not None:
            return self.extracted_path
        current = self
        path = []
        while current:
            path.append([current.end, current.path_cost])
            current = current.parent
        return list(reversed(path))

    def __eq__(self, other):
        if False:
            return hash(self)==hash(other)
        path1 = self.extract_path()
        path2 = other.extract_path()
        if len(path1) != len(path2):
            return False
        for (p1_node, p1_cost), \
            (p2_node, p2_cost) in zip(path1, path2):
            if p1_node != p2_node:
                return False
            if p1_cost != p2_cost:
                return False
        return True
    def __lt__(self, other):
        if self == other:
            return False
        else:
            return self.id<other.id

    def __str__(self):
        return str(self.extract_path())

    def __ne__(self, other):
        return not self == other

    def __hash__(self):

        if True:

            path1 = self.extract_path()
            h = 0
            for end, cost in path1:
                h+= hash(end)+hash(cost) % 4343814758193556821
            return h
        return 0


class PathPriorityQueue(object):
    """
    Combines a priority queue and a set implementation
    """
    def __init__(self, initial=None):
        if initial is None:
            initial = []
        self.paths = set()
        self.priority_queue = []
        for item in initial:
            self.push(item)

    def is_empty(self):
        """Return True is there's the queue is empty and False otherwise"""
        return len(self.priority_queue) == 0

    def push(self, path):
        """
        Push the path on to the queue, providing it isn't already in
        the queue
        """
        if path not in self.paths:
            self.paths.add(path)
            heappush(self.priority_queue, (path.path_cost, path))

    def pop(self):
        """
        Pop the lowest cost path from the queue
        """
        return heappop(self.priority_queue)[1]

    add = push


class Puzzle(object):
    """
    Implements A* algorithm
    """
    def __init__(self, ACTIONS):
        self.ACTIONS = ACTIONS

    def graph_search(self, initial_path, goal):
        """Breadth first search

        Pseudo-code
        function graph_search(problem):
        frontier = {initial}
        explored = {}
        loop:
            if frontier is empty: return FAIL
            path = remove_choice(frontier)
            s = path.end
            add_member(s, explored)
            if s is goal: return goal
            for a in actions:
                res = result(s,a)
                if res not in explored:
                    add[frontier, path+a -> result(s,a)]    """
        nodes_considered = 0
        frontier = PathPriorityQueue([Path(initial_path, 0)])
        explored = set()
        while True:
            if frontier.is_empty():
                return "FAIL"
            path = frontier.pop()
            node = path.end
            explored.add(node)
            print('Adding node:' + str(node))
            if node == goal:
                #print(nodes_considered)
                return path
            for action in self.ACTIONS(path):
                print(str(action))
                res = action.result(path)
                if res not in explored:
                    new_path = path.combine(action)
                    frontier.add(new_path)
                    nodes_considered+=1



def construct_path(edge_dict, node_list):
    """
    Given an edge_dict, and a node_list ['Start', '1','2','3'],
    construct a Path object having order of the node_list
    Note: node_list must
    Util method for test cases
    """
    previous = None
    for item in node_list:
        if previous is None:
            previous = Path(item, 0)
            previous_item = item
        else:
            actions = edge_dict[previous_item]
            # assume that the actions are uniquely represented
            action_dict = {action.end: action for action in actions}
            correct_action = action_dict[item]
            previous_item = item
            previous = previous.extend_path(
                correct_action.end, correct_action.cost)
    return previous
