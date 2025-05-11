const fileUrl = sessionStorage.getItem('selectedFileUrl');
const fileName = sessionStorage.getItem('selectedFileName');
const pdfEmbed = document.getElementById('pdfEmbed');

if (fileUrl && pdfEmbed) {
   pdfEmbed.src = fileUrl;
}

if (fileName) {
    const iframeTitle = document.getElementById('iframeTitle');
    if (iframeTitle) {
        iframeTitle.textContent = fileName;
    }
}
