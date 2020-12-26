# TennisPlayers

Welcome to My TennisPlayers App.

This App was built with Node JS Express on the backend, and with React on the frontend. The Database I'm using is MongoDB.

With this App you can signup and log in, and then post your own tennis players with information about them, including an image. 
<b>NOTE: You must register first in the Authentiate page to be able to add new players, edit or delete existing players!</b>
These tennis players will be displayed in the main page, and will be ranked by the points you assign them.

In addition, you can click on a table row to visit a specific player profile page.

To run the project run npm install in the root of the frontend directory, as well as in the root of the backend directory.

Then, edit the nodemon.json file in the Backend directory and add your own Mongo DB Atlas credentials so that the app correctly connects to a remote mongo db database,and also add a JWT secret string of your choice.

Finally, run npm start on both root directories.

