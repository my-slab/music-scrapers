const FaunaDB = require('faunadb');
const q = FaunaDB.query;

exports.handler = (event, context) => {
  console.log('Function `all-publications` invoked');
  let client = new FaunaDB.Client({
    secret: process.env.FAUNA_DB_KEY,
  });

  return client
    .query(q.Paginate(q.Match(q.Ref('indexes/allPublications'))))
    .then((response) => {
      let { data: publicationRefs } = response;
      let getAllPublications = publicationRefs.map((ref) => {
        return q.Get(ref);
      });

      return client.query(getAllPublications).then((res) => {
        console.log('Success::', JSON.stringify(res));
        return {
          statusCode: 200,
          body: JSON.stringify(res),
        };
      });
    })
    .catch((error) => {
      console.log('Failure::', error);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
