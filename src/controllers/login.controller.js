import query from './query.controller';
import errorMessage from './response.message.controller';
import generate2FAcode from './2FA.code.generator.controller';
import sendmail from "./2FA.sender.controller";
const login = async (req, res) => {
  let { username, password,uType } = req.body,table;
  try {
    let select;
    if (!uType) {
      return res.status(404).send({success: false, message: errorMessage._err_u_404})
    }
    (uType == 'staff') ? table = 'users' : table = 'patients';

    select = await query(`
    SELECT id, status, email, Full_name,role 
    FROM ${table}
    WHERE 
    (username = ? AND password = ?) OR (email = ? AND password = ?) OR (NID = ? AND password = ?) OR (id = ? AND password = ?)`, [username, password,username, password,username, password,username, password]);
    if (select.length === 0) {
      res.status(200).send({ success: false, message: errorMessage.lgIn_error_message });
      return;
    }
    [select] = select
    let user = select
    if (select.status !== 'active' && select.status !== 'unverified') {
      res.send({ success: false, message: errorMessage.uNa_error_message });
      return;
    }

    const FAcode = generate2FAcode();
        const emailResult = sendmail(user.email, {
        subject: 'UDS your 2FA one-time code',
        body: `${FAcode}`,
        },
        user.Full_name,
        'login-2-fa'
    );
    let updateResult;
    updateResult = await query(`UPDATE ${table} SET FA = ? WHERE id = ?`, [FAcode, user.id]);
    if (!updateResult) {
      res.status(500).send({success: false, message: errorMessage.is_error });
      return;
    }

    res.send({ success: true, message: errorMessage._2FA_code_message });
  } catch (error) {
    res.status(500).send({ success: false, message: errorMessage.is_error });
    console.log(error);
  }
};

export default login;
