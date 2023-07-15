# Northcoders News API

This is a backend project to build an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.


Two files have been added to gitignore and must be added by you in order to successfully connect to the two databases locally.
To have access to environmental variables create a file named .env.development and .env.test. Look inside the .env-example file to get an idea of what we need inside then move to your new .env.development file and similarly type PGDATABASE=nc_news and for the other file type PGDATABASE=nc_news_test.

To run this project you will need node v20.3.0 and Postgres v14.8 or newer