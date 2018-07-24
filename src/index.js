import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function resolution(time) {
	if(time <= 60) {return {_1: 1, _2: 5}}
	if(time <= 1800) {return {_1: 30, _2: 150}}
	return {_1: 300, _2: 1500}//use multiplication
}

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
			<input ref='sb' type='search' onKeyUp={(e) => this.edit(e)}/>
		)
	}
}

class RoadMap extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			drills: [],
			selected: -1
		}
	}

	add(drill) {
		var updated = this.state.drills.slice()
		updated.push(drill)
		this.setState({drills: updated})
	}

	draw() {
		const drills = this.state.drills
		const width = this.props.width, offset = 2
		const w = width / drills.length - offset
		const drawer = this.refs.map.getContext('2d')
		drawer.save()
		drawer.clearRect(0, 0, width, this.props.height)
		drawer.fillStyle='white'
		drills.forEach((x, i) => drawer.fillRect(i * (w + offset), 0, w, 45))
		drawer.restore()
	}

	launch(i) {
		if(i < this.state.drills.length) {
			this.props.start(this.state.drills[i].duration, () => this.launch(i + 1))
			this.setState({selected: i})
		}
	}

	componentDidMount() {
		this.draw()
	}

	componentDidUpdate() {
		this.draw()
	}

	toString() {
		const l = this.state.drills.length, s = this.state.selected
		if(l == 0 || s < 0) return ''
		const drill = this.state.drills[s]
		return drill.name + ':' + drill.duration
	}

	render() {
		return (
			<div>
				<canvas ref='map' width={this.props.width} height={this.props.height}/>
				<p>{this.toString()}</p>
			</div>

		)
	}
}

class Face extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentTime: -1,
			time: props.time,
			edited: false,
			size: props.size
		}
	}

	componentDidMount() {
		this.draw()
	}

	componentDidUpdate() {
		this.draw()
	}

	draw() {
		const time = this.state.time, current = this.state.currentTime
		const res = resolution(time)
		const drawer = this.refs.canvas.getContext('2d')
		const radius = this.state.size / 2
		const offset = 10
		const wide=3
		const height = 40
		drawer.save()
		drawer.clearRect(0, 0, this.state.size, this.state.size)
		drawer.translate(radius, radius)
		drawer.fillStyle = 'white'
		drawer.font = "bold 22pt Calibri,Geneva,Arial"
		drawer.textAlign = 'center'
		drawer.fillText(current < 0 ? time : Math.floor(current), 0, 25 - radius)
		drawer.fillStyle = "gray"
		const y = radius * 4/6//3 / 5
		for(var i=0, c=false, width=2; i < time; ++i) {
			width = (c = i % res._2 == 0) ? 2 : ((c = i % res._1 == 0) ? 0.5 : -1)
			if(c) {
				drawer.fillStyle = (width == 2) ? 'white' : 'gray'
				const adjust = (width == 2 ? offset : 0)
				drawer.fillRect(0, y - adjust, width, 20 + adjust)
				drawer.rotate(res._1 * (2 * Math.PI)/time)
			}
		}
		if(current >= 0) {
			drawer.rotate((2 * current * Math.PI)/time)
			drawer.fillStyle = 'orange'
			drawer.fillRect(0 - wide/2,  - y - height/2, wide, height)
			drawer.strokeStyle = 'orange'
			drawer.lineWidth = 2
			drawer.beginPath()
			drawer.ellipse(0, -y - height/2, 4, 4, 0, 0, 2 * Math.PI)
			drawer.stroke()
		}
		drawer.restore()

	}

	start(time, callback) {
		this.setState({currentTime: this.state.time - time})
		if(time >= 0) setTimeout((t) => this.start(t, callback), 50, time - 0.05)
		else {
			this.setState({currentTime: -1})
			callback()
		}

	}

	time() {
		return this.state.time
	}

	render() {
		return (
		//	<div className="watch" onScroll={(e) => console.log('ok')}>
				<canvas ref='canvas' width={this.state.size} height={this.state.size}/>
		//	</div>
		)
	}
}

//export default Face

class App extends React.Component {
	launch() {
		this.map.launch(0)
		//hide search bar
		//turn start to abort
	}

  render() {
    return (
			<div className='watch'>
				<Face ref={(face) => this.face = face} time={60} size={500}/>
				<RoadMap ref={(map) => this.map = map} start={(t, c) => this.face.start(t, c)} width={500} height={50}/>
				<KeyBoard className='kb' callback={(drill) => this.map.add(drill)} time={() => this.face.time()}/>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
				<button className='play' onClick={() => this.launch()}>
					<i class="fa fa-play"/>
				</button>
			</div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
