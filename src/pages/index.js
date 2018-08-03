import React from 'react';
import './index.css';
import RoadMap from '../components/roadmap.js'
import Face from '../components/face.js'

var drill = (name, duration) => {
	return {
		name: name,
		duration: duration
	}
}

class Drill {
	constructor(name, duration) {
		this.name = name
		this.duration = duration
	}
}

class KeyBoard extends React.Component {
	edit(e) {
		if(e.keyCode == 13) {
			this.props.callback(drill(this.refs.sb.value, this.props.time()))
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
			playing: false,
			saved: {},
			savedNames: []
		}
	}

	componentDidUpdate() {
		console.log('mount')
		if(this.callstack) {
			this.callstack()
			this.callstack = null
		}
	}

	dump() {
		var keys = []
		for(let i = 0; i < 1; ++i)
			keys.push(localStorage.key(i))
			console.log('keys ' + keys)
		return keys
	}

	save(name, content) {
		localStorage.setItem(name, JSON.stringify(content))
		this.setState({savedNames: this.dump(), saved: this.dump().map((x) => this.get(x))}) //unefficient
	}

	get(name) {
		const tmp = JSON.parse(localStorage.getItem(name))
		return tmp
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

	workoutLink(x) {
		return <input value={x} type='button' onClick={(e) => this.map.init(this.get(x))}/>
	}

	//should local storage be part of the state?
  render() {
    return (
			<div className='watch'>
				<Face ref={(face) => this.face = face} time={600} size={500}/>
				<RoadMap ref={(map) => this.map = map} start={(t, c) => this.face.start(t, c)} width={500} height={50}/>
				<div className='navbar'>
					<div className="dropup">
				   <button className="dropbtn">Saved</button>
				   <div className="dropup-content">
				     {this.state.savedNames.map((x) => <input value={x} type='button' onClick={(e) => {
							 console.log(this.state.saved[0])
							 this.map.init(this.state.saved[0])
						 }}/>)}
				   </div>
				 </div>
					<KeyBoard
						callback={(drill) => this.map.add(drill)}
						time={() => this.face.timeSelected()}
						disabled={this.state.playing}
					/>
					<input type='button'
						onClick={(e) => {
							this.callstack = () => this.save(prompt('Workout name', 'untitled'), this.map.state.drills)
							this.forceUpdate() //instead use shouldComponentUpdate
						}}
						value='Save'
						disabled={this.state.playing}
					/>
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
export default App
