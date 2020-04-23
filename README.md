# TDDD27_2020_karso527

# Functional Specification

The aim of the project is to build a website that allows a person to register and login to their own personal movie space. In this space, a user has a default collection of their five favorite movies to choose which will then be visible on their personal page. Users can then create their own lists and collections of movies which can be structured and themed any way they want to. These collections will become visible on the personal pages upon creation and all of them can be edited whenever. Users who know each other can then share collections between eachother and highlight anothers users collection on their own page should they want to. 

# Technical Specification

To create a web server that hosts a REST API, I will use the Javalin framework. Thus, the server will be written in Java. The database will be hosted on a PostgreSQL server and the PostgreSQL jdbc connector will be the interface between the web server and the database. I have chosen this approach since Javalin seems like a simple but robust framework for creating a web server with a REST API. I chose PostgreSQL based on previous positive experiences with this particular database.

To easily be able to search and access a vast library of movies, I will use the OMDb API: http://www.omdbapi.com/

The front-end will be made using React. The reason I am choosing React is because it is a very popular framework for front-end development and something I would very much like to learn more about. Its popularity also speaks to the fact that it is most likely a good framework for front-end development which makes me hopeful that it will be suitable for creating the page I want to create.