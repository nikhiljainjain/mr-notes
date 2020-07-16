# Mr-Notes

[![Build Status](https://travis-ci.org/nikhiljainjain/mr-notes.png?branch=master)](https://travis-ci.org/nikhiljainjain/mr-notes)

This project was bootstrapped with [Expressjs Generator](https://expressjs.com/en/starter/generator.html).

Live project available on [Mr Notes](https://www.mrnotes.me).

### Gitpod
This project is Gitpod ready. You can run this project.

### Setup Environment Value
- Make copy of .envexample as .env .
- Enter mongodb link in MONGODB_URL if you want to run this project for production,<br />
    otherwise enter url in TESTDB_URL.
- Default Node environment is development you can change it by replacing NODE_ENV value to PRODUCTION.

## Technology Use

### Backend Part
- Nodejs (Programming language)
- Expressjs (Framework)
- Mongoosejs (Database)

### Frontend Part
- HTML with EJS
- Materialized CSS
- jQuery
- Google Fonts & Icons

### Test Script
- Chai & Mocha
- Supertest
- Mockgoose
- Postman

## Available Scripts

In the project directory, you can run:

### `npm install`

Install all the dependecies required for this project.

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

Runs the app in the production mode.<br />
Open [Deployed Site](https://mrnotes.me) to view it in the browser.

## Pending development work

### Backend code

- [x] Email verification process
- [ ] Forget password
- [ ] Test script for every json responser
- [ ] Data format validation 
- [ ] Cross check of Notes belonging to respective person
- [ ] List assignment to a person (team dashboard)
- [ ] Card transfer from one list to another list
- [ ] Person adding new team member should be team creater
- [ ] User profile updation
- [ ] Google Oauth
- [ ] Facebook Oauth
- [ ] Linkedin Oauth

### Frontend page

- [ ] Email verification
- [ ] Forget password
- [ ] Adding loader on every page
- [ ] Password strength indicator on signup
- [ ] Recaptcha on Login & signup
- [ ] Card drag & drop to other list
- [ ] List assignment to a person (team dashboard)
- [ ] Profile editor