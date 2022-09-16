class ApiError extends Error {
	constructor (status, message) {
		super()
		this.status = status
		this.message = message
	}

	static badRequest(message) {
		return new ApiError(404, message)
	}

	static wrongValue(message) {
		return new ApiError(409, message)
	}

	static internal(message) {
		return new ApiError(500, message)
	}

	static forbidden(message) {
		return new ApiError(403, message)
	}

	static unAuthorized(message) {
		return new ApiError(401, message)
	}
}

module.exports = ApiError