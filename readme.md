# API endpoints:

**`/create`**

*access method: GET with query params*

username: username

password: password in plaintext form

*returns:* JSON Object with success key set to 0/1 for failure/success, eg.
`{ success: 1, info: "created user" }`\

**`/login`**

*access method: GET with query params*

username: username

password: password in plaintext form

*returns:* JSON Object with success key set to 0/1 for failure/success\

**`/create_circle`**

*access method: GET with query params*

*info: This endpoint creates a circle with the current user as the only member, with full admin privs*

username: username

password: password in plaintext form

circleName: name of the circle

circleVis: visibility of the circle (currently unused)

*returns:* JSON Object with success key set to 0/1 for failure/success\

**`/create_flair_info`**

*access method: GET with query params*

username: username

password: password in plaintext form

circleName: name of the circle

returns: where power is an integer >= 0

`{
	success: 1,
	power: 0-9,
	allowAssignFlairs: 0/1,
	allowCreateFlairs: 0/1,
	allowAcceptMembers: 0/1
}` OR 

`{ success: 0 }` for all failures (unauth, no flairs, no flairs allowed to be assigned etc)\

## example implementation with fetch:

### host: https://flyyee-brainhackserver.herokuapp.com/

`fetch('https://flyyee-brainhackserver.herokuapp.com/create?username=bob&password=harambe');`