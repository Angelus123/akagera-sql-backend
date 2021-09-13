const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


//Routers
const eligibiltyRouter = require('./routes/Eligibilty-router');
app.use('/eligibilty', eligibiltyRouter);
const usersRouter = require('./routes/Users-router');
app.use('/user', usersRouter);
const profilesRouter = require('./routes/Profiles-router');
app.use('/profile', profilesRouter);

//ErrorHandling
const HttpError = require('./error_handling/http-error');
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

const db = require('./models');
db.sequelize.sync().then(() => {
    app.listen(5000, () => {
        console.log("Server running || 5000");
    });
})


