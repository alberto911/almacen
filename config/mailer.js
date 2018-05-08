var nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chapultepec156@gmail.com',
    pass: 'fuerzamexico2017'
  }
});

exports.mailOptions = {
  from: 'chapultepec156@gmail.com',
  subject: 'Productos próximos a caducar'
};
