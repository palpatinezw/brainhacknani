# Documentation for server

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

**`/assign_flair_info`**

*access method: GET with query params*

username: username

password: password in plaintext form

circleName: name of the circle

Returns:

```
{
	success: 0/1,
	availableFlairs: [
		{
			name: "sample Flair",
			id: 1, // unique id on server
			active: 0/1, // whether flair should be shown to user or hidden
			power: 3, // integer >= 0
			allowAssignFlair: 0/1,
			allowCreateFlair: 0/1,
			allowAcceptMembers: 0/1
		}
	]
}
```

<br>

**`/assign_flair_info`**

*access method: GET with query params*

username: username

password: password in plaintext form

circleName: name of the circle

flairNames: one string that represents the name of the flairs to be applied to each of the users. The string should follow this format: `"a,b0c,d"` where a and b are the flairs to be applied to the first user, and c and d are the flairs to be applied to the user (eg. 0 is used as a primary separator and , is used as the secondary separator). The clientside implementation from a 2D array is as follows. Alternate usage: pass only one string that represents the name of the one flair to be applied to each of the users (eg. `"a"`).

```
x = [["a", "b"], ["c", "d"]]
res = ""
for (let y of x) {
	res += y.toString() + "0"
}
res = res.slice(0, -1)
```

targetUsernames: stringified list of usernames corresponding to the 2D flair list (eg. `"tom,bob"`). The clientside implementation is `usernames = ["tom", "bob"]; return usernames.toString()`.

Returns: JSON Object with success key set to 0/1 for failure/success. 1 only indicates that *at least one* flair was successfully applied to one user. However, most of the times you don't have to worry about this and you can just take it to indicate complete success.

<br>

**`/get_members`**

*access method: GET with query params*

username: username

password: password in plaintext form

circleName: name of the circle

Returns: (the value of members is another object, with member usernames as keys, and members' flairs as values)

```
{
	success: 0/1,
	members: {
		bob: ["Owner"]
	}
}
```

<br>

### Explanation of power:

How "power" works for the flairs is that 0 is the person with most abilities, and you can only un/assign other members flairs that correspond to a higher power than yours (I know this idea of lower power being better is kinda unintuitive). Comparison of the absolute value or magnitude of the power will use "larger/smaller", eg. 5 is larger than 3. Comparison of the meaning of the power will use "stronger/weaker", eg. 3 is stronger than 5.

<br>

### Example implementation with fetch:

*host: https://flyyee-brainhackserver.herokuapp.com/*

`fetch('https://flyyee-brainhackserver.herokuapp.com/create?username=${username}&password=${password}')
.then(response => response.json())
.then(data => if (data.success == 1) { console.log("good") } );`

