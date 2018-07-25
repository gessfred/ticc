import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Draggable from 'draggable'
import RoadMap from './roadmap.js'
import Face from './face.js'

class Drill {
	constructor(name, duration) {
		this.name = name
		this.duration = duration
	}
}

class KeyBoard extends React.Component {
	constructor(props) {
		super(props)
	}

	edit(e) {
		if(e.keyCode == 13) {
			this.props.callback(new Drill(this.refs.sb.value, this.props.time()))
		}
	}

	render() {
		return (
			<input
				id='location'
				ref='sb'
				type='text'
				onKeyUp={(e) => this.edit(e)}
				placeholder='Add drill...'
			/>
		)
	}
}

class App extends React.Component {
	//use state instead
	togglePlay() {
		if(this.refs.play.value == 'Play' && !this.map.isEmpty()){
			this.map.launch(0)
			this.refs.play.value = 'Stop'
		}
		else {
			//Find better solution
			this.map.abort()
			this.face.abort()
			this.refs.play.value = 'Play'
		}
		//hide search bar
		//turn start to abort
	}

  render() {
    return (
			<div className='watch'>
				<Face ref={(face) => this.face = face} time={60} size={500}/>
				<RoadMap ref={(map) => this.map = map} start={(t, c) => this.face.start(t, c)} width={500} height={50}/>
				<div className='navbar'>
					<KeyBoard callback={(drill) => this.map.add(drill)} time={() => this.face.time()}/>
					<input
						ref='play'
						type='button'
						onClick={() => this.togglePlay()}
						value='Play'
						display='none'
					/>
				</div>
			</div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
