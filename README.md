# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup MongoDb uri in .env file with a key: `MONGODB_URI`
3. Run `npm start:dev` command
4. If you want to use the lite express server (endpoint `POST: /`) 

    then comment these lines in `src/index`:

``
    main()
       .then(() => {})
       .catch((e) => {console.error(e)})
``
