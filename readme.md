# Dcoumentation for server

## API endpoints:

**`/create`**

*access method: GET with query params*

username: username

password: password in plaintext form

*returns:* JSON Object with success key set to 0/1 for failure/success, eg.
`{ success: 1, info: "created user" }`

<br>

**`/login`**

*access method: GET with query params*

username: username

password: password in plaintext form

*returns:* JSON Object with success key set to 0/1 for failure/success

<br>

**`/create_circle`**

*access method: GET with query params*

*info: This endpoint creates a circle with the current user as the only member, with full admin privs*

username: username

password: password in plaintext form

circleName: name of the circle

circleVis: visibility of the circle (currently unused)

*returns:* JSON Object with success key set to 0/1 for failure/success

<br>

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

`{ success: 0 }` for all failures (unauth, no flairs, no flairs allowed to be assigned etc)

<br>

**`/create_flair`**

*access method: GET with query params*

username: username

password: password in plaintext form

circleName: name of the circle

flairName: name of the flair user is intending to create

flairPower: power of the flair. Must be larger power then the user's power found from `/create_flair_info`

flairAssign: 0/1. If the user is found to be able to assign flairs from `/create_flair_info` (eg. `allowAssignFlairs: 1`), this value for the target flair can be set to 0/1, corresponding to dis/allow. Conversely, if the user is unable to assign flairs, he can only create roles that cannot assign flairs (eg. `flairAssign: 0`)

flairCreate: 0/1. Same concept as flairAssign.

flairAccept: 0/1. Same concept as flairAssign.

Returns: JSON Object with success key set to 0/1 for failure/success

<br>

### Explanation of power:

How "power" works for the flairs is that 0 is the person with most abilities, and you can only un/assign other members flairs that correspond to a higher power than yours (I know this idea of lower power being better is kinda unintuitive). Comparison of the absolute value or magnitude of the power will use "larger/smaller", eg. 5 is larger than 3. Comparison of the meaning of the power will use "stronger/weaker", eg. 3 is stronger than 5.

<br>

### Example implementation with fetch:

*host: https://flyyee-brainhackserver.herokuapp.com/*

`fetch('https://flyyee-brainhackserver.herokuapp.com/create?username=bob&password=harambe');`