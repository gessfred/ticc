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
			editable: false,
			size: props.size,
			aborted: false,
			timeHover: -1,
			editing: false
		}
		//*********Make Constant
		this.offset = 10
		this.wide=3
		this.height = 40
		//eventListeners
		//eventually this.timer
	}

	componentDidMount() {
		this.draw()
	}

	componentDidUpdate() {
		this.draw()
	}

	drawNeedle(drawer) {
		const current = this.state.currentTime
		if(current >= 0) {
			const y = this.state.size/3
			drawer.rotate((2 * current * Math.PI)/this.state.time)
			drawer.fillStyle = 'orange'
			drawer.fillRect(0 - this.wide/2,  - y - this.height/2, this.wide, this.height)
			drawer.strokeStyle = 'orange'
			drawer.lineWidth = 2
			drawer.beginPath()
			drawer.ellipse(0, -y - this.height/2, 4, 4, 0, 0, 2 * Math.PI)
			drawer.stroke()
		}
	}

	drawTime(drawer) {
		const current = this.state.currentTime
		drawer.fillStyle = 'white'
		drawer.font = "bold 22pt Calibri,Geneva,Arial"
		drawer.textAlign = 'center'
		drawer.fillText(current < 0 ? this.state.time : Math.floor(current), 0, 25 - this.state.size / 2)
	}

	drawTicks(drawer) {
		const time = this.state.time
		const res = resolution(time), y = this.state.size /3
		for(var i=0, c=false, width=2; i < time; ++i) {
			width = (c = i % res._2 == 0) ? 2 : ((c = i % res._1 == 0) ? 0.5 : -1)
			if(c) {
				drawer.fillStyle = (width == 2) ? 'white' : 'gray'
				const adjust = (width == 2 ? this.offset : 0)
				drawer.fillRect(0, y - adjust, width, 20 + adjust)
				drawer.rotate(res._1 * (2 * Math.PI)/time)
			}
		}
	}

	draw() {
		const time = this.state.time, current = this.state.currentTime
		const drawer = this.refs.canvas.getContext('2d')
		const radius = this.state.size / 2
		drawer.save()
		drawer.clearRect(0, 0, this.state.size, this.state.size)
		drawer.translate(radius, radius)
		this.drawTime(drawer)
		drawer.fillStyle = "gray"
		//3 / 5
		this.drawTicks(drawer)
		this.drawNeedle(drawer)
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

	isEditable(editable) {
		this.setState({editable: editable})
	}

	abort() {
		this.setState({aborted:true, editable: true})
	}

	time() {
		return this.state.time
	}

	render() {
		return (
			<div>
					<canvas
						ref='canvas'
						width={this.state.size}
						height={this.state.size}
						onKeyUp={(e) => console.log('ok')}
						onScroll={(e) => console.log(e)}
						autoFocus
					/>
			</div>
		)
	}
}

export default Face
