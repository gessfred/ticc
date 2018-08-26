const toDMS = function(time) {
	const min = Math.floor(time/60), sec = Math.floor(time % 60)
	console.log(min + ':' + time)
	return (time > 60 ? (min + ':') : '') + sec
}

module.exports = {
	'toDMS': toDMS
}
