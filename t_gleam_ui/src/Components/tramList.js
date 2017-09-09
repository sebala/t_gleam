import React from 'react'
import { connect } from 'react-redux'
import {Button} from 'semantic-ui-react'
import { loadTramLineStats } from '../actions/actions'
import ShowMarkersToggle from './ShowMarkersToggle'
const Tramlist = ({ dispatch, trams }) => {
  const call_load_stats = (linie) => {
    loadTramLineStats(dispatch, linie);
  }
  let tram_items = [
  {"linie" : 2, color : "#D8232A"},
{"linie" : 3, "color" : "#009F4A"},
{"linie" : 4, "color" : "#3E4085"},
{"linie" : 5, "color" : "#855B37"},
{"linie" : 6, "color" : "#DA9F4F"},
{"linie" : 7, "color" : "#DA9F4F"},
{"linie" : 8, "color" : "#DA9F4F"},
{"linie" : 9, "color" : "#DA9F4F"},
{"linie" : 10, "color" : "#DA9F4F"},
{"linie" : 11, "color" : "#DA9F4F"},
{"linie" : 12, "color" : "#DA9F4F"},
{"linie" : 13, "color" : "#DA9F4F"},
{"linie" : 14, "color" : "#DA9F4F"},
{"linie" : 15, "color" : "#DA9F4F"},
{"linie" : 17, "color" : "#DA9F4F"},

  ];

//https://en.wikipedia.org/wiki/Trams_in_Z%C3%BCrich
/*"line" : "7", "color" : "#191919"
8 #86CD16
"line" : "9", "color" : "#3E4085"
"line" : "10", "color" : "#DA3987"
"line" : "11", "color" : "#009F4A"
12 #7ACAD4
13 #FBD01F
"line" : "14", "color" : "#00A4DB"
"line" : "15", "color" : "#D8232A"
"line" : "17", "color" : "#8E224D"*/
  //(<div className="w3-container w3-center">
  //className="w3-button w3-green"
  //<img src="img_avatar3.png" alt="Avatar" style="width:80%"/>
  //background-color:{tram.color}
  const list_items = tram_items.map((tram) =>{
      return <Button content={tram.linie} key={tram.linie} onClick={() => call_load_stats(tram.linie)}/>

      //<div key={tram.linie} className="w3-container  w3-center cont">
    //            <button className={"w3-button tram_" +tram.linie}  >tram: {tram.linie}</button>
      //        </div>
  });
  return <div>
    <div>
      <ShowMarkersToggle/>
    </div>
    <div>
    {list_items}
    </div>
    </div>
}

export default connect()(Tramlist);
