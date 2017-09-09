## Getting Started

Assuming you have python3 and npm installed, and the repository is cloned

#### Python Server Set up
(from the base directory of the cloned repository)

```
virtualenv -p python3 my_virtual_env  
source my_virtual_env/bin/activate
cd route_server
pip install -r requirements.txt
Getting the data?
```

Running the tests
```
nosetests
```

Starting the server
```
export FLASK_APP=./route_server/run.py
flask run
```

#### Web GUI set up
(from the base directory of the cloned repository)

```
cd t_gleam_ui
npm install
npm start
```
