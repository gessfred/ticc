const toDMS = function(time) {
	const min = Math.floor(time/60), sec = Math.floor(time % 60)
	return (time > 60 ? (min + ':') : '') + sec + '.' + 10*(time - (60*min + sec))
}

module.exports = {
	'toDMS': toDMS
}
