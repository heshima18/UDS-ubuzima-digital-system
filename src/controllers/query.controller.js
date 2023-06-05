import connection from "../../app";
async function query(query,params) {
    try {
      const res = await new Promise((resolve, reject) => {
        connection.query(query,params, (err, res) => {
          if (err) console.log(err);
          resolve(res);
        });
      });
      return JSON.parse(JSON.stringify(res));
    } catch (error) {
      console.error(error);
    }
}
export default query