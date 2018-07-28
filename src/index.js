import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RoadMap from './roadmap.js'
import Face from './face.js'

class Drill {
	constructor(name, duration) {
		this.name = name
		this.duration = duration
	}
}

class KeyBoard extends React.Component {
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
				disabled={this.props.disabled}
			/>
		)
	}
}

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			playing: false
		}
	}
	//use state instead
	toggle() {
		if(!this.state.playing){
			if(!this.map.isEmpty()) {
				this.map.launch(0)
				this.face.isEditable(false)
			}
		}
		else {
			//Find better solution
			this.map.abort()
			this.face.abort()
		}
		this.setState({playing: !this.state.playing})
		//hide search bar
		//turn start to abort
	}

  render() {
    return (
			<div className='watch'>
				<Face ref={(face) => this.face = face} time={600} size={500}/>
				<RoadMap ref={(map) => this.map = map} start={(t, c) => this.face.start(t, c)} width={500} height={50}/>
				<div className='navbar'>
					<KeyBoard callback={(drill) => this.map.add(drill)} time={() => this.face.timeSelected()} disabled={this.state.playing}/>
					<input
						ref='play'
						type='button'
						onClick={() => this.toggle()}
						value={this.state.playing ? 'Stop' : 'Play'}
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
