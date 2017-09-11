## Getting Started

Assuming you have python3, virtualenv, and npm installed...

#### Python Server Set up
(from the base directory of the cloned repository)

```
virtualenv -p python3 my_virtual_env  
source my_virtual_env/bin/activate
cd t_gleam/route_server
pip install -r requirements.txt

```

Running the tests

```
nosetests
```

Getting data - only needed for starting the server; warning 500mb download
```
source get_data.sh
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
