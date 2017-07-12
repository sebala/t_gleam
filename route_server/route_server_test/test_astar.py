
#!/usr/bin/env
# -*- coding: utf-8 -*-


from unittest import TestCase, main
from route_server import Path, PathPriorityQueue, build_verticies, construct_path,build_actions, Puzzle


TEST_DATA = [
    (('A', 'Z'), 75),
    (('A', 'T'), 118),
    (('Z', 'O'), 71),
    (('O', 'S'), 151),
    (('S', 'R'), 80),
    (('R', 'C'), 146),
    (('T', 'L'), 111),
    (('L', 'D'), 70),
    (('C', 'D'), 120),
    (('R', 'P'), 97),
    (('S', 'F'), 99),
    (('F', 'B'), 211),
    (('P', 'B'), 101)
]




class BasicPuzzle(TestCase):
    """Test cases of the graph search algo"""
    def setUp(self):
        self.edges = TEST_DATA
        self.edge_dict = build_verticies(self.edges)
        ACTIONS = build_actions(self.edges)
        self.puzzle = Puzzle(ACTIONS)

    def test_build_verticies(self):
        """Ensure that all keys are present when creating an edge dictionary"""
        actual_nodes = set(self.edge_dict.keys())
        expected_nodes = set('ZOASTLDCRFPB')
        self.assertEqual(actual_nodes, expected_nodes)

    def test_actions_a(self):
        """Ensure the edge_dict for 'A' returns 2 items; 'Z' and 'T'"""
        self.assertEqual(2, len(self.edge_dict['A']))
        actions_as_dict = {
            action.end: action.cost for action in self.edge_dict['A']}
        self.assertEqual(75, actions_as_dict['Z'])
        self.assertEqual(118, actions_as_dict['T'])

    def test_actions_from_t(self):
        """
        Note: Contrast this with the actions a; where the vertex
        (('A', 'T'), 118) is defined from A->T. Here check that this
        still comes out as a action T->A
        Check that:
        1.
        2.
        """
        edge_dict = build_verticies(self.edges)
        self.assertEqual(2, len(edge_dict['T']))
        actions_as_dict = {
            action.end: action.cost for action in edge_dict['T']}
        self.assertEqual(118, actions_as_dict['A'])
        self.assertEqual(111, actions_as_dict['L'])

    def test_graph_search_simple(self):
        """Test a simple directly linked path (1 vertex between the nodes)"""
        path = self.puzzle.graph_search('S', 'R')
        edge_dict = build_verticies(self.edges)
        test_path = construct_path(edge_dict, ['S', 'R'])
        self.assertEqual(test_path, path)

    def test_shortest_path(self):
        """
        Integration test case - checks a long path from A->B
        """
        path = self.puzzle.graph_search('A', 'B')
        expected_path = ['A', 'Z', 'O', 'S', 'R', 'P', 'B']
        test_path = construct_path(self.edge_dict, expected_path)
        self.assertEqual(test_path, path)

    def test_no_valid_path(self):
        """If there's no valid path, ensure graph_search returns FAIL"""
        DISCONNECTED = [
            (('A', 'B'), 75),
            (('C', 'D'), 118)
        ]
        actions = build_actions(DISCONNECTED)
        puzzle = Puzzle(actions)
        should_fail = puzzle.graph_search('A', 'D')
        self.assertEqual('FAIL', should_fail)


class PathTest(TestCase):
    def setUp(self):
        self.edge_dict = build_verticies(TEST_DATA)

    def test_simple_path(self):
        end = Path('START', 0) \
            .extend_path('1', 1) \
            .extend_path('2', 1) \
            .extend_path('3', 1)

        ids_by_position = [node_id for node_id, _ in end.extract_path()]
        self.assertEqual(4, len(ids_by_position))
        self.assertEqual('START', ids_by_position[0])
        self.assertEqual('1', ids_by_position[1])
        self.assertEqual('2', ids_by_position[2])
        self.assertEqual('3', ids_by_position[3])

        path_costs = dict()
        for node_id, total_cost in end.extract_path():
            path_costs[node_id] = total_cost

        self.assertEqual(0, path_costs['START'])
        self.assertEqual(1, path_costs['1'])
        self.assertEqual(2, path_costs['2'])
        self.assertEqual(3, path_costs['3'])

    def test_path_equality(self):
        p1 = construct_path(self.edge_dict, ['A', 'Z', 'O', 'S', 'R'])
        p2 = construct_path(self.edge_dict, ['A', 'Z', 'O', 'S', 'R'])
        self.assertEqual(p1, p2)

    def test_path_inequality(self):
        path_1 = construct_path(self.edge_dict, ['A', 'Z', 'O', 'S', 'R'])
        path_2 = construct_path(self.edge_dict, ['A', 'T', 'L', 'D', 'C', 'R'])
        self.assertNotEqual(path_1, path_2)


class TestPathPriorityQueue(TestCase):
    """A few basic tests to ensure that the PathPriorityQueue
    behaves propery"""
    def setUp(self):
        initial = Path('START', 0)  # Assume 0 cost
        self.left = initial.extend_path('left', 1)
        self.right = initial.extend_path('right', 3)

        self.priority_queue = PathPriorityQueue()
        self.priority_queue.push(self.left)
        self.priority_queue.push(self.right)

    def test_min_is_popped(self):
        should_be_left = self.priority_queue.pop()
        self.assertEqual(self.left, should_be_left)

    def test_max_remains_after_min_popped(self):
        self.priority_queue.pop()
        should_be_right = self.priority_queue.pop()
        self.assertEqual(self.right, should_be_right)

    def test_is_empty_after_all_popped(self):
        self.priority_queue.pop()
        self.priority_queue.pop()
        self.assertTrue(self.priority_queue.is_empty())
        
if __name__ == '__main__':
    main(exit=False)
