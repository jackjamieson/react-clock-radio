import React from 'react';
import './App.css';
import Moment from 'react-moment';

function Clock(props) {
  // conditional rendering
  if (props.hasPower) {
    return <div className='clock-display has-power'><Moment interval="{60000}" format="hh:mm:ss"></Moment></div>
  }

  return <div className='clock-display no-power'>00:00:00</div>
}

function PowerButton(props) {
  // use the onClick provided by the parent
  return <div className="power-button" onClick={props.onClick}>Power</div>
}

class Tuner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfStations: 5,
      stations: []
    }
  }

  // when the component has rendered, update the station list with some random stations
  componentDidMount() {
    this.populateStations();
  }

  populateStations() {
    const newStations = this.state.stations.slice();
    for (let i = 0; i < this.state.numberOfStations; i++) {
      newStations[i] = {
        stationNumber: (Math.random() * (105 - 90) + 90).toFixed(1), // random num max - min + min = 90 to 105
        stationKey: i
      };
    }

    // sort the stations so they appear as you would expect on a tuner
    newStations.sort((a, b) => {
      if (Number(a.stationNumber) > Number(b.stationNumber)) {
        return 1;
      }
      else if (Number(a.stationNumber) < Number(b.stationNumber)) {
        return -1;
      }
      else {
        return 0;
      }
    });

    this.setState({
      stations: newStations
    });
  }

  render() {
    const stationItems = this.state.stations.map(station => {
      return (
        // keys must be unique so give the array index
        // this is okay if we aren't moving them around or adding/deleting
        <div key={station.stationKey} className="station">{station.stationNumber}</div>
      )
    });

    return (
      <div className="tuner-bar">
        {stationItems}
      </div>
    )
  }

}

class AlarmBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasPower: false,
      currentStation: null,
    }
  }

  togglePower() {
    this.setState({
      hasPower: !this.state.hasPower
    });
  }

  render() {
    return (
      <div className="alarm-container">
        <PowerButton onClick={() => this.togglePower()} />
        <div className="alarm-box">
          <div className="clock">
            <Clock hasPower={this.state.hasPower} />
          </div>
          <div className="tuner">
            <Tuner />
          </div>
        </div>
        <div className="foot left-foot"></div>
        <div className="foot right-foot"></div>
      </div>
    )
  }
}


export default AlarmBox;