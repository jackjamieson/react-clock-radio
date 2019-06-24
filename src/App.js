import React from 'react';
import './App.css';
import Moment from 'react-moment';

function Clock(props) {
  // conditional rendering
  if (props.hasPower) {
    return (
      <div className="clock power-shadow">
        <div className='clock-display has-power'><Moment interval="{60000}" format="hh:mm:ss"></Moment></div>
      </div>
    )
  }

  return (
    <div className="clock">
      <div className='clock-display no-power'>00:00:00</div>
    </div>
  )
}

function PowerButton(props) {
  // use the onClick provided by the parent
  return <button className="power-button" onClick={props.onClick}>Power</button>
}

function AlarmButton(props) {
  return (
    <span>
      <button className="lower-button" onClick={props.onClick}>SET ALARM</button>
    </span>
  )
}

function ChangeStationButton(props) {
  return (
    <span>
      <button className="lower-button " onClick={props.onClick}>SET STATION</button>
    </span>
  )
}

function GenericInput(props) {

  let placeHolder = '00:00';
  let display = 'none';

  // whether or not to show at all
  if (props.shouldShow) {
    display = 'inline';
  }
  else {
    display = 'none';
  }

  // show different info/placeholder based on what button was pressed
  if (props.currentFunction === 'alarm') {
    placeHolder = '00:00';
  }

  if (props.currentFunction === 'radio') {
    placeHolder = 'not yet implemented'
  }

  // display info bassedon on current function
  return (
    <div style={{ display: display }}>
      <div className="input-info">
        {props.currentFunction === 'alarm' ? 'Set an alarm to go off at the specified time.  Remember to keep the clock powered on!' : null}</div>
      <div style={{ textAlign: 'center' }}><input type="text" className="generic-input" placeholder={placeHolder}></input>
        <button className="lower-button" onClick={props.handleNewInput}>SET</button>
      </div>
    </div >
  )
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

    let tunerParentClass = !this.props.hasPower ? 'tuner' : 'tuner power-shadow';
    let tunerClass = !this.props.hasPower ? 'tuner-bar' : 'tuner-bar tuner-on';


    return (
      <div className={tunerParentClass}>
        <div className={tunerClass}>
          {stationItems}
        </div >
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
      alarm: null,
      canInputData: false,
      currentFunction: null
    }
  }

  handlePowerButtonClick() {
    this.setState({
      hasPower: !this.state.hasPower
    });
  }

  handleAlarmButtonClick() {
    this.setState({
      canInputData: true,
      currentFunction: 'alarm'
    });
  }

  handleSetStationClick() {
    this.setState({
      canInputData: true,
      currentFunction: 'radio'

    });
  }

  handleNewInput(input) {
    this.setState({
      canInputData: false,
      currentFunction: null
    });
  }

  render() {
    return (
      <div>
        <div className="alarm-container">
          <PowerButton onClick={() => this.handlePowerButtonClick()} />
          <div className="alarm-box">
            <Clock hasPower={this.state.hasPower} />
            <Tuner hasPower={this.state.hasPower} />
            <AlarmButton onClick={() => this.handleAlarmButtonClick()} />
            <ChangeStationButton onClick={() => this.handleSetStationClick()} />

          </div>
          <div className="foot left-foot"></div>
          <div className="foot right-foot"></div>
          <GenericInput currentFunction={this.state.currentFunction} shouldShow={this.state.canInputData} handleNewInput={() => this.handleNewInput()} />

        </div >
      </div>



    )
  }
}


export default AlarmBox;