##### Mini App
# MongoSchema
> Simple Local User Authorization and Registration

For this mini app, I want to use Mongoose to create a collection, insert, delete, find and update documents in it. This is my first go with mongoose, I have a little experience with using `mongodb` module though.

### Goals
1. User can create a new account and login.
2. User can update their information.
3. User can delete their account.

#### Tools
I will be using express, pug, body-parser, cookie-parser and mongoose. I will use cookies to make a simple local session for the user.
1. Express (Back-End-Framework)
2. Pug (View Engine)
3. Body-Parser (To read form inputs)
4. Cookie-Parser (To control cookies! yummy!)
5. Mongoose (To connect to mongodb)

## Register
Simple form page for user to register new account.

## Login
The login page will be a simple form with a post method pointing to `/login`.

## Dashboard
Dashboard page loads current user information and lets the user update and save it.

## Logout
The user can logout of the session

## Delete Account
User can choose to remove all information from the database.
