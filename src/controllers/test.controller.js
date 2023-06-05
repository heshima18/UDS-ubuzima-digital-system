let test = (req,res)=>{
    res.status(200).send({success: true, message: 'message from the server'})
}
export default test
