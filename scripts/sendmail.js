var nodemailer = require('nodemailer');


function SendMail(req, res, user) {

	var transporter = nodemailer.createTransport("SMTP",{
		service: 'Gmail',
		auth: {
			user: 'fornodejs@gmail.com',
			pass: 'bumerang01'
		}
	});
	var md5HashHex = user.hex;
	var mess = 'Для подтверждения регистрации перейдите по ссылке http://localhost:3001/#/toConfirm/'+ md5HashHex;
	transporter.sendMail({
		//from: 'ponachen@mail.ru',
		to: user.email,
		subject: 'hello',
		text: mess
	},function(error, response){
		if(error){
		console.log(error);
		res.end("error");
		}else{
		console.log("Message sent: " + response.message);
				
			user.mess = mess;
			console.log('aded 11'+ mess)
			res.json({
				type: true,
				data: user,
				//token: user.token
			});
		
		//res.end("sent");
		}
	}
	
	);
	console.log(user.email+'пошел1122'+mess);
}

//http://localhost:3001/#/toConfirm/fdgfdhgfdh
//подтверждение регистрации
function ConfirmHex(req, res) {
	var hex = req.params.hex;
	var User = require('../models/Userseq');
	console.log('hex'+hex);	
	   User.find({where: {hex: hex}})
	   .then(function(user){
					if(user){
						//меняем ему флаг
						//User.update({foto: id_user+'.'+fn},{where: {id: id_user}})
						//User.update({confirmed: 1},{where: {hex: hex}})
						user.update({confirmed: 1})
						.then(function(user){
							res.json({
							type: true,
							data: "Регистрация подтверждена"
							});
						})
							
							.catch(function(err) {
								res.json({
									type: false,
									data: "ошибка " + err
								});
							});
							
					/*res.json({
						type: true,
						data: user*/
						console.log('Ok HERE-12');	
					}else{
						res.json({
							type: true,
							data: "Такого пользователя нет"
						});						
					}
                    console.log('Ok HERE-17');
					//console.log('sssssssssssss');
                }).catch(function(e) {
                    res.json({
						type: false,
						data: "ошибка " + err
					});
                    console.log('ошибка ConfirmHex');
					//console.log("Project update failederewrewrew !");
                });
}


module.exports.sendMail = SendMail;
module.exports.ConfirmHex = ConfirmHex;