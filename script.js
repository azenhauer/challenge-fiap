const navBtn = document.querySelector('.nav-btn');

const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('dragArea');
const saveBtn = document.querySelector('.custom-save-btn');
const uploadText = uploadArea.querySelector('p.upload-text'); 

const processFiles = (files) => {
    if (!files || files.length === 0) {
        if (uploadText) {
            uploadText.textContent = 'Arraste e solte o documento ou clique aqui';
        }
        sessionStorage.removeItem('selectedFileName');
        console.log("No files selected or processing cleared.");
        return;
    }

    const file = files[0];
    const url = URL.createObjectURL(file);
    sessionStorage.setItem('selectedFileUrl', url);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Por favor, selecione apenas arquivos PDF.');
        console.warn('Non-PDF file rejected:', file.name);
        return;
    }

    if (uploadText) {
        uploadText.textContent = `Arquivo selecionado: ${file.name}`;
    } else {
        console.error('Elemento <p class="upload-text"> não encontrado dentro do uploadArea.');
    }

    sessionStorage.setItem('selectedFileName', file.name);
    console.log("Processed file:", file.name);
};


if (navBtn) {
    navBtn.addEventListener('click', () => {
        fileInput.value = null; 
        fileInput.click();
    });
}

if (uploadArea) {
    uploadArea.addEventListener('click', () => {
        fileInput.value = null; 
        fileInput.click();
    });
}

if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault(); 

        const selectedFileName = sessionStorage.getItem('selectedFileName');

        if (!selectedFileName) {
            alert('Por favor adicione um documento (via clique ou arrastando).');
            return;
        }

        console.log(`Proceeding to next page with file: ${selectedFileName}`);
        const form = document.getElementById('mainForm'); 
   
        const nomeDocumento = form.querySelector('input[name="nomeDocumento"]')?.value; 
        const grupos = form.querySelector('input[name="grupos"]')?.value;
        const categorias = form.querySelector('input[name="categorias"]')?.value;

        if (nomeDocumento) sessionStorage.setItem('nomeDocumento', nomeDocumento);
        if (grupos) sessionStorage.setItem('grupos', grupos);
        if (categorias) sessionStorage.setItem('categorias', categorias);
   
    const params = new URLSearchParams();
        params.append('nomeDocumento', nomeDocumento);
        params.append('grupos', grupos);
        params.append('categorias', categorias);
    
        const targetUrl = `infodoc.html?${params.toString()}`;
    window.location.href = targetUrl;
     
    });
}


if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        processFiles(e.target.files); 
    });
}




const setupDragAndDrop = () => {
    if (!uploadArea) {
        console.error("Drag area element not found.");
        return;
    }

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const highlight = () => uploadArea.classList.add('change-border');
    const unhighlight = () => uploadArea.classList.remove('change-border');


    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            preventDefaults(e);
            highlight();
        }, false);
    });


    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            preventDefaults(e);
            unhighlight();
        }, false);
    });


    uploadArea.addEventListener('drop', (e) => {
       
        const dt = e.dataTransfer;
        const files = dt.files;

        console.log("Files dropped:", files);
        processFiles(files); 
    
    }, false);
};


document.addEventListener('DOMContentLoaded', setupDragAndDrop);


document.addEventListener('DOMContentLoaded', () => {
    sessionStorage.clear();
     if (uploadText) {
        
         const existingFile = sessionStorage.getItem('selectedFileName');
         if(existingFile) {
             uploadText.textContent = `Arquivo selecionado: ${existingFile}`;
         } else {
            uploadText.textContent = 'Arraste e solte o documento ou clique aqui'; 
         }
    }
});