import { getTest } from "../controllers/credentials.verifier.controller";
import errorMessage from "../controllers/response.message.controller";
import authenticateToken from "../controllers/token.verifier.controller";

export const checkTest = async (req,res,next) =>{
    try {
        let { token,test } = req.body
        if (!test) {
            return res.status(401).send({ message: errorMessage._err_forbidden, success: false });
        }
        const decoded = authenticateToken(token);
        let id = decoded.token.id
        let testinfo = await getTest(test.id)
        if (!testinfo) {
            return res.status(500).send({ message: errorMessage.is_error, success: false }); 
        }
        if (testinfo.length == 0) {
            return res.status(404).send({ message: errorMessage._err_test_404, success: false });
        }
        testinfo = testinfo[0]
        if (testinfo.type == 'quick test') {
            return next()
        }
        res.status(500).send({ message: errorMessage.is_error, success: false });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: errorMessage.is_error, success: false });
    }
}