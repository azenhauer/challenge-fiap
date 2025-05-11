import emailjs from 'emailjs-com';

function sendSignatureEmail(recipientEmail, recipientName, documentLink) {
  const serviceID = 'service_9p65t4l';
  const templateID = 'template_fdtzfaq';
  const userID = 'FdwakeCMO13WCJaVh'; 

  const templateParams = {
    to_email: recipientEmail,
    to_name: recipientName,
    document_link: documentLink
  };

  emailjs.send(serviceID, templateID, templateParams, userID)
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      alert('Email enviado com sucesso!');
    }, (err) => {
      console.error('FAILED...', err);
      alert('Erro ao enviar email.');
    });
}
export default sendSignatureEmail;
