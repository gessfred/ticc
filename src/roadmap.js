import React from 'react';
import './index.css'

Array.prototype.max = function() {
  return Math.max.apply(null, this);
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
			aborted: false
		}
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
			drawer.fillStyle = i == sel ? 'white' : (i == hov ? 'darkgray' : 'gray')
			const l=h*x.duration / timescale + 10
			console.log((h - l)/2)
			drawer.fillRect(this.toX(i), (h - l)/2 + 5, this.w, l)
		})
		drawer.restore()
	}

	launch(i) {
		if(!this.state.aborted && i < this.state.drills.length) {
			this.props.start(this.state.drills[i].duration, () => this.launch(i + 1))
			this.setState({selected: i})
		}
		else this.setState({aborted:false})
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
			return '--'
		}
		const drill = this.state.drills[s]
		return drill.name
	}

	isEmpty() {
		return this.state.drills.length <= 0
	}

	render() {
		return (
			<div>
				<canvas
					ref='map' width={this.props.width}
					height={this.props.height}
					onClick={(e) => this.select(e)}
					onMouseMove={(e) => this.hovered(e)}
				/>
				<h1 className='mapDrill' ref='title'>{this.toString()}</h1>
			</div>

		)
	}
}

export default RoadMap
