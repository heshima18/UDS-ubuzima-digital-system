import query from './query.controller';
import errorMessage from './response.message.controller';
import generate2FAcode from './2FA.code.generator.controller';
import sendmail from "./2FA.sender.controller";
const login = async (req, res) => {
  let { username, password } = req.body;
  try {
    let select;
    select = await query(`
    SELECT id, status, email, Full_name,role 
    FROM patients
    WHERE 
    (username = ? AND password = ?) OR (email = ? AND password = ?) OR (NID = ? AND password = ?) OR (id = ? AND password = ?)`, [username, password,username, password,username, password,username, password]);
    
    if (select.length === 0) {
      select = await query(`SELECT id, status, email, Full_name,role FROM users WHERE (username = ? AND password = ?) OR (email = ? AND password = ?) OR (NID = ? AND password = ?) OR (id = ? AND password = ?)`, [username, password,username, password, username, password, username, password]);
    }

    if (select.length === 0) {
      res.status(200).send({ success: false, message: errorMessage.lgIn_error_message });
      return;
    }

    const user = select[0];
    if (user.status !== 'active' && user.status !== 'unverified') {
      res.send({ success: false, message: errorMessage.uNa_error_message });
      return;
    }

    // const FAcode = generate2FAcode();
    const FAcode = 123456;
        const emailResult = sendmail(user.email, {
        subject: 'UDS your 2FA one-time code',
        body: `${FAcode}`,
        },
        user.Full_name,
        'login-2-fa'
    );
    let updateResult;
    user.role == 'patient' || user.role == 'householder' ? updateResult = await query(`UPDATE patients SET FA = ? WHERE id = ?`, [FAcode, user.id]):
     updateResult = await query(`UPDATE users SET FA = ? WHERE id = ?`, [FAcode, user.id]);

    if (!updateResult) {
      res.status(500).send({ success: false, message: errorMessage.is_error });
      return;
    }

    res.send({ success: true, message: errorMessage._2FA_code_message });
  } catch (error) {
    res.status(500).send({ success: false, message: errorMessage.is_error });
    console.log(error);
  }
};

export default login;
