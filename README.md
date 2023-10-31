# Setting up project for local development

1. git clone https://gitlab.com/pvd232/my-weight-pal.git
2. # Creating local Postgres DB instance
   - 1. type into terminal "psql -U postgres"
   - 2. type into terminal "create database myweightpaldb"
   - 3. verify database connected with \l to view all databases
   - 4. /c myweightpaldb to query data
3. run main.py
4. go to "frontend-react-app" directory in terminal and enter "npm start"

# Login information for testing

1. Navigate to test.myweightpal.dev/login,
2. Enter "patardriscoll@gmail.com" for the username
3. Enter "a" for the password
4. Click the login button

# Setting up Mail Service

1. go to mailgun and add the desired email domain -> info.myweightpal.dev
2. add the txt, cname, and mx records supplied there to the DNS records
3. click domain settings on left side panel
4. navigate to SMTP credentials tab on the top of the screen
5. click "reset password"
6. copy the username and newly generated password
7. add username and password to EmailService in service.py

# How to initialize GCP and add a Custom Domain

1. Create project on GCP App Engine. Do not download gcloud sdk. Just press "setup later" and continue
2. Go to GOOGLE DOMAINS and purchase a custom domain (much easier than purchasing from another host and authenticating the domain on the domain host ie., Namecheap)
3. If you buy it through namecheap look at the saved bookmarks in chrome in the SSL folder

# How to push to 2 remote repositories

1. git remote set-url --add --push origin <https://new_repository_url>
2. git remote set-url --add --push origin <https://original_repository_url>
3. push to the new repo

# How to setup GCP

1. enable Cloud SQL API and create a new Postgres SQL 14 instance
2. update all DB_STRING variable references with the new Cloud SQL connection name
3. enable Google Cloud App Engine Admin API here https://console.developers.google.com/apis/api/appengine.googleapis.com/overview?project=56009585707
4. enable Cloud Run API
5. The default Cloud Build service account does not allow access to deploy App Engine. You need to enable the Cloud Build service account to perform actions such as deploy.
   - Go to the Google Cloud Console -> IAM & admin -> IAM.
   - Locate the service account and click the pencil icon.
   - Add the role "App Engine Deployer" to the service account.

# Integrating React with Flask

1. create-react-app frontend-react-app
2. create templates folder and copy index.html from /public into it
3. create static/react folder for react to populate content into
4. extensive build configurations located in cloudbuild.yaml to run 2 bash files
5. the first bash file is setup_sed.sh to eject the react app while automating the reply to the "are you sure" react prompt
6. the second bash file is sed.sh, which is used to directly modify react config files in accordance with this tutorial to change the host for the react app to flask https://blog.learningdollars.com/2019/11/29/how-to-serve-a-reactapp-with-a-flask-server/

# React Testing

1. click Stripe icon on left toolbar
2. under "events" click forward events to your local machine
3. enter your local wifi IP address
4. trigger a new default event

# PostgreSQL and Ancilaries Setup

1. for PGAdmin add your public ipv4 address to the Cloud SQL connections
2. add the Cloud SQL IP Address as a new sever in PGAdmin
3. pip install gunicorn and pip freeze > requirements.txt
4. pip install eventlet and pip freeze > requirements.txt

# GCP Commands

gcloud config set project nourish-351123
gcloud sql connect nourishdb1 --user=postgres --quiet

# React Boiler Plate Instructions

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# WeightPalApp
