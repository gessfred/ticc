import React from 'react'
import './index.css'

function resolution(time) {
	if(time <= 60) {return {_1: 1, _2: 5}}
	if(time <= 1800) {return {_1: 30, _2: 150}}
	return {_1: 300, _2: 1500}//use multiplication
}

class Face extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentTime: -1,
			time: props.time,
			edited: false,
			size: props.size,
			aborted: false
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
		if(time >= 0 && !this.state.aborted) setTimeout((t) => this.start(t, callback), 50, time - 0.05)
		else {
			this.setState({currentTime: -1, aborted:false})
			callback()
		}
	}

	abort() {
		this.setState({aborted:true})
	}

	time() {
		return this.state.time
	}

	render() {
		return (
		//	<div className="watch" onScroll={(e) => console.log('ok')}>
				<canvas
					ref='canvas'
					width={this.state.size}
					height={this.state.size}
					onKeyUp={(e) => console.log('ok')}
					onScroll={(e) => console.log(e)}
					autoFocus
				/>
		//	</div>
		)
	}
}

export default Face
