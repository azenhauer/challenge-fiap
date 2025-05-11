document.addEventListener('DOMContentLoaded', function() {
    
    const triggerFileBtn = document.getElementById('triggerFile');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const filePreview = document.getElementById('filePreview');
    
    const nextToSignaturesBtn = document.getElementById('nextToSignatures');
    const backToInfoBtn = document.getElementById('backToInfo');
    const nextToReviewBtn = document.getElementById('nextToReview');
    const backToSignaturesBtn = document.getElementById('backToSignatures');
    const finishProcessBtn = document.getElementById('finishProcess');
    
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    const stepperItems = document.querySelectorAll('.stepper-item');
    
    const addSignerBtn = document.getElementById('addSigner');
    
    const signersList = document.getElementById('signersList');
   
    const docName = document.getElementById('docName');
    const docGroups = document.getElementById('docGroups');
    const docCategories = document.getElementById('docCategories');
    
    const signerName = document.getElementById('signerName');
    const signerEmail = document.getElementById('signerEmail');
    const docDelivery = document.getElementById('docDelivery');
    const signAs = document.getElementById('signAs');
    const signerCPF = document.getElementById('signerCPF');
    const dob = document.getElementById('dob');
    const signMethod = document.getElementById('signMethod');
    
    const reviewDocName = document.getElementById('reviewDocName');
    const reviewDocGroups = document.getElementById('reviewDocGroups');
    const reviewDocCategories = document.getElementById('reviewDocCategories');
    const reviewSignersList = document.getElementById('reviewSignersList');
    
    let currentStep = 1;
    let signers = [];
    let uploadedFile = null;
    
    // Load data from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('nomeDocumento') && docName) {
        docName.value = urlParams.get('nomeDocumento');
    }
    if (urlParams.has('grupos') && docGroups) {
        docGroups.value = urlParams.get('grupos');
    }
    if (urlParams.has('categorias') && docCategories) {
        docCategories.value = urlParams.get('categorias');
    }
    
    // If nothing from URL, check sessionStorage (for navbar button navigation)
    if (docName && !docName.value && sessionStorage.getItem('nomeDocumento')) {
        docName.value = sessionStorage.getItem('nomeDocumento');
        // Clear after use
        sessionStorage.removeItem('nomeDocumento');
    }
    
    if (docGroups && !docGroups.value && sessionStorage.getItem('grupos')) {
        docGroups.value = sessionStorage.getItem('grupos');
        sessionStorage.removeItem('grupos');
    }
    
    if (docCategories && !docCategories.value && sessionStorage.getItem('categorias')) {
        docCategories.value = sessionStorage.getItem('categorias');
        sessionStorage.removeItem('categorias');
    }
    
    // Handle "Adicione um documento" button on infodoc.html
    if (triggerFileBtn && fileInput) {
        triggerFileBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    if (fileInput && fileName && filePreview) {
        fileInput.addEventListener('change', function(e) {
            const selectedFile = e.target.files[0];
            if (!selectedFile) return;
        
            let renamedFile = selectedFile;
            console.log(docName.value)
            if (docName && docName.value) {
                
                try {
                    renamedFile = new File([selectedFile], docName.value, {type: selectedFile.type});
                } catch (err) {
                    console.error("Error renaming file:", err);
                    renamedFile = selectedFile;
                }
            }

            if (selectedFile) {
                uploadedFile = selectedFile; 
                fileName.textContent = renamedFile.name; 
                console.log("File Type:", uploadedFile.type);
                
                if (uploadedFile.type.includes('pdf')) {
                    filePreview.innerHTML = '<img src="/imgs/PDF.png" alt="PDF Preview" class="img-preview">';
                } 
             
            } else {
                uploadedFile = null;
                fileName.textContent = 'Nenhum arquivo selecionado';
                filePreview.innerHTML = '';
            }
        });
    }
    
    function goToStep(stepNumber) {
        if (!step1 || !step2 || !step3) return;
        
        step1.classList.add('d-none');
        step2.classList.add('d-none');
        step3.classList.add('d-none');
        
        stepperItems.forEach(item => {
            item.classList.remove('active');
            item.classList.remove('completed');
        });
        
        if (stepNumber === 1) {
            step1.classList.remove('d-none');
        } else if (stepNumber === 2) {
            step2.classList.remove('d-none');
        } else if (stepNumber === 3) {
            step3.classList.remove('d-none');
            updateReviewPage();
        }
        
        for (let i = 0; i < stepNumber; i++) {
            if (i === stepNumber - 1) {
                stepperItems[i].classList.add('active');
            } else {
                stepperItems[i].classList.add('completed');
            }
        }
        
        currentStep = stepNumber;
    }
    
    function updateReviewPage() {
        if (!reviewDocName || !reviewDocGroups || !reviewDocCategories || !reviewSignersList) return;
        
        reviewDocName.textContent = docName.value || 'Não especificado';
        reviewDocGroups.textContent = docGroups.value || 'Não especificado';
        reviewDocCategories.textContent = docCategories.value || 'Não especificado';
        
        reviewSignersList.innerHTML = '';
        if (signers.length === 0) {
            reviewSignersList.innerHTML = '<li>Nenhum assinante adicionado</li>';
        } else {
            signers.forEach(signer => {
                const li = document.createElement('li');
                li.classList.add('signer-item');
                li.textContent = signer;
                reviewSignersList.appendChild(li);
            });
        }
    }
    
    if (nextToSignaturesBtn && docName) {
        nextToSignaturesBtn.addEventListener('click', function() {
            if (docName.value.trim() === '') {
                alert('Por favor, preencha o nome do documento.');
                return;
            }
            goToStep(2);
        });
    }
    
    if (backToInfoBtn) {
        backToInfoBtn.addEventListener('click', function() {
            goToStep(1);
        });
    }
    
    if (nextToReviewBtn) {
        nextToReviewBtn.addEventListener('click', function() {
            goToStep(3);
        });
    }
    
    if (backToSignaturesBtn) {
        backToSignaturesBtn.addEventListener('click', function() {
            goToStep(2);
        });
    }
    
    if (finishProcessBtn) {
        finishProcessBtn.addEventListener('click', function() {
            alert('Documento processado com sucesso!');
            window.location.href = 'finalpage.html';
        });
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    if (addSignerBtn && signerEmail) {
        addSignerBtn.addEventListener('click', function() {
            const name = signerName.value.trim();
            const email = signerEmail.value.trim();
            const role = signAs.value.trim(); 
            const sCPF = signerCPF.value;
            const signerDOB = dob.value;
            
            if (email && validateEmail(email)) {
                addSigner(name, email, role, sCPF, signerDOB);
                signerEmail.value = '';
                signerName.value = '';
                signerCPF.value = '';
                dob.value = '';
            } else {
                alert('Por favor, insira um email válido.');
            }
        });
    }
    
    function addSigner(name, email, role, sCPF, signerDOB) {
        if (!signersList) return;
        
        if (!signers.includes(email)) {
            signers.push(email);
    
            const newRow = document.createElement('tr');
            newRow.dataset.email = email;
            
            newRow.innerHTML = `
                <td>${name}</td>
                <td>${email}</td>
                <td>${role}</td>
                <td>${sCPF}</td>
                <td>${signerDOB}</td>
                <td><img src="/imgs/Close.png" alt="Remove" class="remove-signer"></td>
            `;
    
            signersList.appendChild(newRow);
            
            const removeButton = newRow.querySelector('.remove-signer');
            if (removeButton) {
                removeButton.addEventListener('click', function() {
                    removeSigner(email, newRow);
                });
            }
        }
    }
    
    function removeSigner(email, element) {
        signers = signers.filter(s => s !== email);
    
        if (element && element.parentNode) {
            element.remove();
        }
    }
    
    // Initialize
    if (step1 && step2 && step3) {
        goToStep(1);
    }
    
    // Check for filename from sessionStorage
    const initialFileName = sessionStorage.getItem('selectedFileName');
    if (initialFileName && fileName) {
        fileName.textContent = initialFileName;
        // Clear it now as it's just informational
        sessionStorage.removeItem('selectedFileName');
    }
});