const nodemailer = require("nodemailer");
const { pugEngine } = require("nodemailer-pug-engine");
require('dotenv').config();

module.exports = async (email, subject, template, context) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		transporter.use('compile', pugEngine({
			templateDir: './utils/emailTemplates',
			pretty: true
		}));

		const mailOptions = {
			from: process.env.USER,
			to: email,
			subject: subject,
			template: template,
			ctx: context
		};

		await transporter.sendMail(mailOptions);
		
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};

