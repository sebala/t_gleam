# t_gleam

#Getting Started

Assuming you have python3 and npm installed, and the repository is cloned

##Python Server Set up
(from the base directory of the cloned repository)
virtualenv -p python3 py3_tgleam
source py3_tgleam/bin/activate
cd route_server
pip install -r requirements.txt
#Getting the data?
nosetests

export FLASK_APP=./route_server/run.py
flask run


##Web GUI set up
(from the base directory of the cloned repository)
cd t_gleam_ui
npm install
npm start
