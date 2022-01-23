# Advance  Project


### Create MERN Stack Project from your choice **MUST BE APPROVED**
#### Requirements: 
- Use Express Framework to build up the backend.
- Expose the following REST APIs 
	- [public endpoint] Register a user. Collect at least first name, last name, email. Once the user is registered, send a welcome email to the user. 
	- [public endpoint] Sign in a user. This should take in as inputs the username and password, and should return a JWT token. Once signed in, send the user a notify email that a login attempt has been made to their account. 
	- [public endpoint] User can reset its password using email address or phone number
	- [protected endpoint] Create a place. Collect at least the place name, location, and category. 
	- [protected endpoint] Get the nearest place. This should take in as inputs a location, and return the nearest place, with its details. 
- For the `database`, you will use MongoDB.
- For the frontend, use react or react-native. Both is an extra.
- For backend use Express
- **You must use third party API and you must consume it in the backend** 
### Things to consider: 
• All APIs input/output should be in JSON format. 
• Endpoints marked with protected, should be authenticated. 
• For emails, you can integrate with https://www.mailgun.com. They have a free tier that you can utilize