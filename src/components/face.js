import React from 'react'
import '../pages/index.css'

function resolution(time) {
	if(time <= 60) {return {_1: 1, _2: 5}}
	if(time <= 1800) {return {_1: 30, _2: 150}}
	return {_1: 300, _2: 1500}//use multiplication
}

class Face extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentTime: 10,
			time: props.time,
			editable: true,
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

	y() {
		return this.state.size/3
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
			const y = this.y()
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

	toDMS(time) {
		const min = Math.floor(time/60), sec = Math.floor(time % 60)
		return (time > 60 ? (min + ':') : '') + sec + '.' + 10*(time - (60*min + sec))
	}

	drawTime(drawer) {
		const current = this.state.currentTime
		drawer.fillStyle = 'white'
		drawer.font = "bold 22pt Calibri,Geneva,Arial"
		drawer.textAlign = 'center'
		const contextTime = current < 0 ? this.state.time : current
		drawer.fillText(this.toDMS(contextTime), 0, 25 - this.state.size / 2)
	}

	drawTicks(drawer) {
		const time = this.state.time
		const res = resolution(time), y = this.y()
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

	timeToAngle(time) {
		return time / this.state.time * Math.PI * 2
	}

	drawTimeSelect(drawer) {
		if(this.state.currentTime >= 0) {
			drawer.fillStyle = 'orange'
			this.drawSelection(drawer, this.timeToAngle(this.state.currentTime))
		}
	}

	drawHoverSelect(drawer) {
		if(this.state.timeHover >= 0) {
			drawer.fillStyle = 'rgba(100, 100, 100, 0.5)'
			this.drawSelection(drawer, this.timeToAngle(this.state.timeHover))
		}
	}

	drawSelection(drawer, angle) {
		const offset = -Math.PI/2
		drawer.beginPath()
		drawer.arc(0,0,100,0 + offset,angle + offset, false)
		drawer.arc(0,0,0,angle + offset,0 + offset, true)
		drawer.fill()
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
		if(this.state.editable) {
			this.drawTimeSelect(drawer)
			this.drawHoverSelect(drawer)
		}
		else this.drawNeedle(drawer)
		drawer.restore()

	}

	start(time, callback) {
		console.log('time' + time)
		this.setState({time: time})
		this.execute(time, callback)
	}

	execute(time, callback) {
		this.setState({currentTime: this.state.time - time})
		if(time >= 0 && !this.state.aborted) setTimeout((t) => this.execute(t, callback), 50, time - 0.05)
		else {
			this.setState({currentTime: -1, aborted:false, time:this.props.time})
			callback()
		}
	}

	isEditable(editable) {
		this.setState({editable: editable})
	}

	abort() {
		this.setState({aborted:true, editable: true, time: this.props.time})
	}

	timeSelected() {
		return this.state.currentTime
	}

	time() {
		return this.state.time
	}

	toTime(e) {
		const r = this.state.size/2
		const dx = (e.pageX - this.refs.canvas.offsetLeft - r)
		const dy = (e.pageY - this.refs.canvas.offsetTop - r)
		const y = this.y()
		if(Math.abs(dx) > y || Math.abs(dy) > y) return -1
		const angle = Math.atan(dy / dx) + Math.PI/2 + (dx < 0 ? Math.PI : 0)
		return angle / (Math.PI*2) * this.state.time
	}

	selectedAngle(e) {
		this.setState({timeHover: this.toTime(e)})
	}

	render() {
		return (
			<div>
					<canvas
						ref='canvas'
						width={this.state.size}
						height={this.state.size}
						onMouseMove={(e) => this.selectedAngle(e)}
						onClick={(e) => this.setState({currentTime: Math.round(this.state.timeHover*2)/2})}
						onMouseLeave={(e) => this.setState({timeHover: -1})}
						autoFocus
					/>
			</div>
		)
	}
}

export default Face