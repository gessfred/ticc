import React from 'react';
import '../pages/index.css'
const {toDMS} = require('../util/util')

Array.prototype.max = function() {
  return Math.max.apply(null, this);
}

function bip(sound) {
	sound.play()
	sound.addEventListener('ended', function() {
		console.log('reloading...')
		sound.load()
	})
}

class RoadMap extends React.Component {
	constructor(props) {
		super(props)
		this.w = 3
		this.offset = 2
		this.state = {
			drills: [],
			selected: -1,
			hovered: -1,
			aborted: false,
			clearable: false
		}
	}

	init(drills) {
		this.setState({drills: drills})
	}

	add(drill) {
		var updated = this.state.drills.slice()
		updated.push(drill)
		this.setState({drills: updated})
	}

	toX(i) {
		return 0.5 * this.props.width + (i - this.state.drills.length/2) * (this.w + this.offset)
	}

	toI(x) {
		const l = this.state.drills.length
		const temp = Math.floor(-l/2 + (x - 0.5*this.props.width)/(this.w + this.offset)) + l
		return temp < 0 || temp >= l ? -1 : temp
	}

	select(e) {
		const index = this.toI(e.clientX - this.refs.map.offsetLeft)
		this.setState({selected: index})
	}

	hovered(e) {
		const index = this.toI(e.clientX - this.refs.map.offsetLeft)
		this.setState({hovered: index})
	}

	draw() {
		const drawer = this.refs.map.getContext('2d')
		drawer.save()
		drawer.clearRect(0, 0, this.props.width, this.props.height)
		drawer.fillStyle='white'
		const sel = this.state.selected, hov = this.state.hovered
		const h = this.props.height - 10
		const timescale = this.state.drills.map(x => x.duration).max()
		this.state.drills.forEach((x, i) => {
			drawer.fillStyle = i == sel ? '#ca2c43' : (i == hov ? '#fffdd0' : '#d3d3d3')
			const l=h*x.duration / timescale + 10
			drawer.fillRect(this.toX(i), (h - l)/2 + 5, this.w, l)
		})
		drawer.restore()
	}

	playbeep() {
		this.a.play()
	}

	start() {
		this.countdown(3, () => this.launch(0))
	}

	launch(i) {
		if(!this.state.aborted && i < this.state.drills.length) {
			bip(this.refs.beep)
			const drill = this.state.drills[i]
			this.props.start(drill.duration, () => this.countdown(drill.pause, () => this.launch(i + 1)))
			this.setState({selected: i})
		}
		else {
			this.setState({aborted:false})
			this.props.stop()
		}
	}

	countdown(count, callback) {
		if(count > 0 && !this.state.aborted) {
			bip(this.refs.beep)
			this.props.count(count, () => this.countdown(count - 1, callback))
		}
		else callback()
	}

	abort() {
		console.log('stop')
		this.setState({selected: -1, aborted: true})
	}

	componentDidMount() {
		this.draw()
	}

	componentDidUpdate() {
		this.draw()
	}

	toString() {
		const l = this.state.drills.length, s = this.state.selected
		if(l == 0 || s < 0) {
			return (l) ? 'Total Time : ' +  toDMS(this.state.drills.map((x) => x.duration).reduce((prev, x) => prev + x)) : '--'

		}
		const drill = this.state.drills[s]
		return this.state.clearable ? 'Clear' : drill.name
	}

	isEmpty() {
		return this.state.drills.length <= 0
	}

	dump() {
		console.log(this.state.drills)
		return this.state.drills
	}

	removeSelected() {
		if(this.state.selected >= 0) {
			const removed = this.state.drills
			removed.splice(this.state.selected, 1)
			this.setState({drills: removed, selected: -1})
		}
	}

	clearable(yes) {
		this.refs.title.background = '#ca2c43'
		this.setState({clearable: yes})
	}

	render() {
		return (
			<div>
				<canvas
					ref='map' width={this.props.width}
					height={this.props.height}
					onClick={(e) => this.select(e)}
					onMouseMove={(e) => this.hovered(e)}
					className='roadmap'
				/>
				<input
					ref='title'
					type='button'
					value={this.toString()}
					onClick={(e) => this.removeSelected()}
					onMouseMove={(e) => this.clearable(true)}
					onMouseLeave={(e) => this.clearable(false)}
					className='selected'
				/>
				<audio src='https://soundbible.com/grab.php?id=1815&type=mp3' ref='beep'/>
			</div>

		)
	}
}

export default RoadMap
