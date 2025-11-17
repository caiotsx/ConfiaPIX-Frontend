constAPI_BASE_URL = 'https://confiapix.onrender.com';
//constAPI_BASE_URL = 'http://localhost:8081';


// ===== Tema escuro / claro =====
const themeBtn = document.getElementById('themeBtn');
const currentTheme = localStorage.getItem('confiaPIX_theme');

if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('confiaPIX_theme', isDark ? 'dark' : 'light');
});

// ===== Atualizar nome e foto do usuário =====
    window.addEventListener('DOMContentLoaded', () => {
      const storedUser = localStorage.getItem('confiaPIX_user');
      const userPhoto = document.getElementById('userPhoto');
      const userName = document.getElementById('userName');

      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.username) {
          userName.innerHTML = `Olá, <b>${user.username}</b>!`;
        }
        if (user.photo) {
          userPhoto.src = user.photo;
        }
      } else {
        // Se não estiver logado, redireciona para login
        window.location.href = 'login.html';
      }
    });

    // ===== Lógica de upload e validação =====
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const preview = document.getElementById('preview');
    const imagePreview = document.getElementById('imagePreview');
    const pdfPreview = document.getElementById('pdfPreview');
    const fileName = document.getElementById('fileName');
    const removeBtn = document.getElementById('removeBtn');
    const validateBtn = document.getElementById('validateBtn');
    const statusBox = document.getElementById('status');

    selectFileBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      const fileURL = URL.createObjectURL(file);
      preview.style.display = 'block';
      fileName.textContent = file.name;

      if (file.type === 'application/pdf') {
        pdfPreview.src = fileURL;
        pdfPreview.style.display = 'block';
        imagePreview.style.display = 'none';
      } else if (file.type.startsWith('image/')) {
        imagePreview.src = fileURL;
        imagePreview.style.display = 'block';
        pdfPreview.style.display = 'none';
      }
    });

    removeBtn.addEventListener('click', () => {
      fileInput.value = '';
      preview.style.display = 'none';
      imagePreview.src = '';
      pdfPreview.src = '';
      fileName.textContent = '';
      statusBox.style.display = 'none';
    });

    validateBtn.addEventListener('click', async () => {
      const file = fileInput.files[0];
      if (!file) {
        alert("Por favor, selecione um comprovante antes de validar.");
        return;
      }

      statusBox.style.display = 'block';
      statusBox.style.background = '#fff8e1';
      statusBox.style.color = '#444';
      statusBox.textContent = 'Validando comprovante...';

      const formData = new FormData();
      formData.append('arquivo', file);

      try {
        const response = await fetch(constAPI_BASE_URL + '/api/comprovantes/validar',  {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
    console.log(result);

    const valido = result.resultadoValidacao?.valido;
    const motivo = result.resultadoValidacao?.motivo;

    if (valido === true) {
        statusBox.style.background = '#e0f2f1';
        statusBox.style.color = '#00796b';
        statusBox.textContent = `✅ Comprovante válido!`;
    } 
    else if (valido === false) {
        statusBox.style.background = '#ffebee';
        statusBox.style.color = '#c62828';
        statusBox.textContent = `❌ Comprovante falso: ${motivo}`;
    } 
    else {
        statusBox.style.background = '#fff3e0';
        statusBox.style.color = '#ef6c00';
        statusBox.textContent = `⚠️ Não foi possível validar o comprovante.`;
    }
    } catch (error) {
        statusBox.style.background = '#ffebee';
        statusBox.style.color = '#c62828';
        statusBox.textContent = 'Erro ao validar o comprovante. Tente novamente.';
    }
});