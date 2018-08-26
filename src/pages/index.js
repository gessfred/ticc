import React from 'react';
import './index.css';
import RoadMap from '../components/roadmap.js'
import Face from '../components/face.js'
import {toDMS} from '../util/util.js'

const n = 'n'
const user = 'localuser'
const breaks = [0, 5, 10, 30, 60, 120]

var drill = (name, duration, pause) => {
	return {
		name: name,
		duration: duration,
		pause: pause
	}
}

class Drill {
	constructor(name, duration, pause) {
		this.name = name
		this.duration = duration
		this.pause = pause
	}
}

const Pick = (props) => (
	<button onClick={() => props.dpick()} className={props.on === 'y' ? 'picked' : 'pick'}>{props.t ? props.t : 'None'}</button>
)

const Picker = function(props) {
	return (
		<div className='picker'>
			{breaks.map((x, i) => <Pick on={i == props.pick ? 'y' : null} t={x > 0 ? toDMS(x) : null} dpick={() => props.dpick(i)}/>)}
		</div>
	)
}

class KeyBoard extends React.Component {
	edit(e) {
		if(e.keyCode == 13) {
			this.props.callback(drill(this.refs.sb.value, this.props.time(),  breaks[this.props.pauseTime()]))
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
				className='keyboard'
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
			menu: true,
			pause: 0
		}
	}

	componentDidMount() {
		console.log('didmount')
		this.setState({saved: this.get() || {}})
	}

	componentDidUpdate() {
		console.log('mount')
		if(this.callstack) {
			console.log(this.get())
			this.callstack()
			this.callstack = null
		}
	}

	dump() {
		var keys = []
		for(var key in this.state.saved)
			keys.push(key)
		return keys
	}

	save(name, content) {
		console.log(this.state.saved)
		console.log({})
		const saved = Object.assign(this.state.saved, {})
		saved[name] = content
		this.setState({saved: saved})
		localStorage.setItem('localuser', JSON.stringify(this.state.saved))
		//this.setState({saved: }) //unefficient
	}

	get() {
		const tmp = JSON.parse(localStorage.getItem('localuser'))
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
		return <input value={x} className='link' type='button' onClick={(e) => this.map.init(this.state.saved[x])}/>
	}

	stop() {
		this.setState({playing: false})
	}
/*
{this.state.savedNames.map((x) => <input value={x} type='button' onClick={(e) => {
	console.log(this.state.saved[0])
	this.map.init(this.state.saved[0])
}}/>)}

*/
	//should local storage be part of the state?
  render() {
    return (
			<div className='app'>
				<div className={this.state.menu ? 'sidebar' : 'sidebar-closed'}>
					{this.dump().map((x) => this.workoutLink(x))}
				</div>
				<div className={this.state.menu ? 'main' : 'main-closed'}>
					<input className='menu' type='button' value={this.state.menu ? 'x' : 'menu'} onClick={(e) => this.setState({menu: !this.state.menu})}/>
					<Face ref={(face) => this.face = face} time={300} size={400}/>
					<Picker dpick={(i) => this.setState({pause: i})} pick={this.state.pause}/>
					<RoadMap ref={(map) => this.map = map} stop={() => this.stop()}start={(t, c) => this.face.start(t, c)} width={500} height={50}/>
					<div>
						<KeyBoard
							callback={(drill) => this.map.add(drill)}
							time={() => this.face.timeSelected()}
							pauseTime={() => this.state.pause}
							disabled={this.state.playing}
						/>
					</div>
						<div className='controls'>
							<input type='button'
								onClick={(e) => {
									this.callstack = () => this.save(prompt('Workout name', 'untitled'), this.map.state.drills)
									this.forceUpdate() //instead use shouldComponentUpdate
								}}
								value='★'
								disabled={this.state.playing}
								className='control'
							/>
							<input
								ref='play'
								type='button'
								onClick={() => this.toggle()}
								value={this.state.playing ? '◽' : '▶'}
								display='none'
								className='control'
							/>
						</div>
				</div>
			</div>
    );
  }
}
export default App
