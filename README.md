# CS50W - Final Project - Crejo System

This repository contain the entirely code to my final project to the CS50w. My project consist in a WebApplication to create 
purchases orders based in a CSV price table. In many situations we need digit a request basing in a product catalog, make it using this application is vary easy because we need just give the price table in CSV. The application have been builded with Django, JavaScript, HTML and CSS.

[![Page Final Project](https://i.ibb.co/zFbqZ1M/Dja-1.png)](https://crejo.pythonanywhere.com)

## Project Page

The project have been uploaded in [Python Any Where](https://crejo.pythonanywhere.com).

## Youtube Vídeo

A shortely video to demonstrate the project was uploaded in [Youtube](https://youtu.be/sHvjsMn_toI).

## Distinctiveness and Complexity

According with the specifications, this project is entirely different from all other projects that we have made along to the course. From my point of view, achieve the requirement because:

1. There is one model to login and logout in application;
2. The appearance is professional and mobile responsive;
3. It's a tool possible to use in some contexts in professional area, to make orders;
4. Uses the Tailwind CSS framework to make beautiful pages;
5. Uses a route in Django to response one CSV file to the user.

Beyond this, my application use a bunch of JavaScript functions to update the User Interface and make the application more dynamic.

## Files and Directories

* `mostruario` - main application directory.
    * `static/mostruario` contains all static content
        * `mostruariotable.js` - all the scripts to manipulate the user interface and build a table.
        * `tailwindconfig.js` - script to configure the Tailwind CSS.
    * `templates/mostruario` contains all application templates.
        * `layout.html` - base template to the application.
        * `login.html` - template to login.
        * `register.html` - tamplate to create one account.
        * `index.html` - interface when a user login, that will be manipulated by the JavaScript.
    * `models.py` contains a model to register users.
    * `urls.py` contains all the URLs.
    * `views.py` contains all application views.
* `crejosis` - project directory.
* `requirements.txt` - packages required in order for the application to run successfully.
* `price.csv` - one CSV file to use by example.
* `docker-compose.yaml` - docker file to build a image and container.

## How to run the Application

### Option 1:

If do you have a Docker, just clone the repository and run `docker-compose up` in the directory. Last, visit `127.0.0.1:8000` to see the application.

### Option 2:

* Clone the repository to your system.
* Install all project dependencies running `pip install -r requirement.txt`.
* Start the Django web server using `python manage.py runserver`.
* Go to website address and register an account.

## Conclusion

Thanks for everyone that make CS50's Web Programming with Python and JavaScript course possible, your are fantastic people ;D.
