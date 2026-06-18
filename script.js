document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Menu Toggler ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // --- 2. Header Scrolled Class ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 3. Scroll Entrance Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Active Navigation Links on Scroll ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // --- 5. Pricing Plan Switcher & Pre-filled WhatsApp Links ---
  const billingMonthly = document.getElementById('billing-monthly');
  const billingQuarterly = document.getElementById('billing-quarterly');
  
  const priceDigital = document.getElementById('price-digital');
  const priceCoaching = document.getElementById('price-coaching');
  const priceElite = document.getElementById('price-elite');

  const btnPlanDigital = document.getElementById('btn-plan-digital');
  const btnPlanCoaching = document.getElementById('btn-plan-coaching');
  const btnPlanElite = document.getElementById('btn-plan-elite');

  const waPhone = '5493517048406'; // Target WhatsApp number

  // Price definitions
  const prices = {
    monthly: { digital: '30.000', coaching: '40.000', elite: '50.000' },
    quarterly: { digital: '25.500', coaching: '34.000', elite: '42.500' } // Approx 15% discount
  };

  function updatePricing(billingMode) {
    // UI Classes
    if (billingMode === 'monthly') {
      billingMonthly.classList.add('active');
      billingQuarterly.classList.remove('active');
    } else {
      billingQuarterly.classList.add('active');
      billingMonthly.classList.remove('active');
    }

    // Animate and set prices
    const updateVal = (el, val) => {
      el.style.transform = 'scale(0.85)';
      el.style.opacity = '0.3';
      setTimeout(() => {
        el.textContent = val;
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
      }, 150);
    };

    updateVal(priceDigital, prices[billingMode].digital);
    updateVal(priceCoaching, prices[billingMode].coaching);
    updateVal(priceElite, prices[billingMode].elite);

    // Update WhatsApp links
    const billingLabel = billingMode === 'monthly' ? 'Mensual' : 'Trimestral';
    
    const msgDigital = `Hola Abel, me interesa el plan de Asesoramiento Online (${billingLabel} - $${prices[billingMode].digital}/mes). ¿Cómo empezamos?`;
    const msgCoaching = `Hola Abel, me interesa el plan Presencial 2x Semanal en Manantiales (${billingLabel} - $${prices[billingMode].coaching}/mes). ¿Cuáles son los horarios de Martes y Jueves?`;
    const msgElite = `Hola Abel, me interesa el plan Presencial 3x Semanal en Manantiales (${billingLabel} - $${prices[billingMode].elite}/mes). ¿Cómo reservo mi lugar para sumar los viernes?`;

    btnPlanDigital.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgDigital)}`;
    btnPlanCoaching.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgCoaching)}`;
    btnPlanElite.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgElite)}`;
  }

  // Bind Switch Event Listeners
  if (billingMonthly && billingQuarterly) {
    billingMonthly.addEventListener('click', () => updatePricing('monthly'));
    billingQuarterly.addEventListener('click', () => updatePricing('quarterly'));
  }

  // Initialize links on load
  updatePricing('monthly');

  // --- 7. Theme Color Switcher ---
  const themeBtnGreen = document.getElementById('theme-btn-green');
  const themeBtnYellow = document.getElementById('theme-btn-yellow');

  function setTheme(theme) {
    if (theme === 'yellow') {
      document.body.classList.add('theme-yellow');
      if (themeBtnGreen && themeBtnYellow) {
        themeBtnGreen.classList.remove('active');
        themeBtnYellow.classList.add('active');
      }
      localStorage.setItem('abel-fitness-theme', 'yellow');
    } else {
      document.body.classList.remove('theme-yellow');
      if (themeBtnGreen && themeBtnYellow) {
        themeBtnGreen.classList.add('active');
        themeBtnYellow.classList.remove('active');
      }
      localStorage.setItem('abel-fitness-theme', 'green');
    }
  }

  if (themeBtnGreen && themeBtnYellow) {
    themeBtnGreen.addEventListener('click', () => setTheme('green'));
    themeBtnYellow.addEventListener('click', () => setTheme('yellow'));

    // Load saved preference
    const savedTheme = localStorage.getItem('abel-fitness-theme');
    if (savedTheme === 'yellow') {
      setTheme('yellow');
    }
  }

  // --- 8. Student/Admin Portal Logic ---
  const tabStudent = document.getElementById('tab-student');
  const tabAdmin = document.getElementById('tab-admin');
  const formLoginStudent = document.getElementById('form-login-student');
  const formLoginAdmin = document.getElementById('form-login-admin');
  const portalLoginBox = document.getElementById('portal-login-box');
  const portalHeaderPublic = document.getElementById('portal-header-public');
  
  const portalStudentDashboard = document.getElementById('portal-student-dashboard');
  const portalAdminDashboard = document.getElementById('portal-admin-dashboard');

  const studentWelcomeEmail = document.getElementById('student-welcome-email');
  
  const btnStudentLogout = document.getElementById('btn-student-logout');
  const btnAdminLogout = document.getElementById('btn-admin-logout');

  const formCreateStudent = document.getElementById('form-create-student');
  const studentsList = document.getElementById('students-list');
  const noStudentsMessage = document.getElementById('no-students-message');

  // Tab switching
  if (tabStudent && tabAdmin) {
    tabStudent.addEventListener('click', () => {
      tabStudent.classList.add('active');
      tabAdmin.classList.remove('active');
      formLoginStudent.classList.add('active');
      formLoginAdmin.classList.remove('active');
      document.getElementById('student-login-error').style.display = 'none';
      document.getElementById('admin-login-error').style.display = 'none';
    });

    tabAdmin.addEventListener('click', () => {
      tabAdmin.classList.add('active');
      tabStudent.classList.remove('active');
      formLoginAdmin.classList.add('active');
      formLoginStudent.classList.remove('active');
      document.getElementById('student-login-error').style.display = 'none';
      document.getElementById('admin-login-error').style.display = 'none';
    });
  }

  // Admin Credentials Helper Functions
  function getAdminCredentials() {
    const data = localStorage.getItem('abel-fitness-admin');
    if (!data) {
      return { user: 'Abel', pass: 'abel123' };
    }
    return JSON.parse(data);
  }

  function saveAdminCredentials(creds) {
    localStorage.setItem('abel-fitness-admin', JSON.stringify(creds));
  }

  // Student Database Helper Functions
  function getStudents() {
    const data = localStorage.getItem('abel-fitness-students');
    return data ? JSON.parse(data) : [];
  }

  function saveStudents(list) {
    localStorage.setItem('abel-fitness-students', JSON.stringify(list));
  }

  function renderStudents() {
    if (!studentsList) return;
    studentsList.innerHTML = '';
    const list = getStudents();

    if (list.length === 0) {
      noStudentsMessage.style.display = 'block';
    } else {
      noStudentsMessage.style.display = 'none';
      list.forEach((student, index) => {
        const li = document.createElement('li');
        li.className = 'student-item';
        li.innerHTML = `
          <span class="student-info-email">${student.email}</span>
          <button class="btn-delete-student" data-index="${index}" aria-label="Eliminar alumno">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        `;
        studentsList.appendChild(li);
      });

      // Bind delete events
      const deleteButtons = studentsList.querySelectorAll('.btn-delete-student');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(btn.getAttribute('data-index'));
          deleteStudent(index);
        });
      });
    }
  }

  function deleteStudent(index) {
    const list = getStudents();
    list.splice(index, 1);
    saveStudents(list);
    renderStudents();
  }

  // Admin Login Handle
  if (formLoginAdmin) {
    formLoginAdmin.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-user').value.trim();
      const pass = document.getElementById('admin-password').value;
      const errEl = document.getElementById('admin-login-error');
      
      const adminCreds = getAdminCredentials();

      if (user === adminCreds.user && pass === adminCreds.pass) {
        errEl.style.display = 'none';
        formLoginAdmin.reset();
        
        // Show Admin Dashboard
        portalHeaderPublic.style.display = 'none';
        portalLoginBox.style.display = 'none';
        portalAdminDashboard.style.display = 'block';
        
        // Pre-fill credentials in the change form
        const changeUserEl = document.getElementById('change-admin-user');
        const changePassEl = document.getElementById('change-admin-password');
        if (changeUserEl) changeUserEl.value = adminCreds.user;
        if (changePassEl) changePassEl.value = adminCreds.pass;
        
        // Update Admin badge
        const adminBadge = document.querySelector('.user-badge.admin');
        if (adminBadge) {
          adminBadge.textContent = `${adminCreds.user} (Entrenador)`;
        }

        renderStudents();
      } else {
        errEl.textContent = 'Usuario o contraseña de administración incorrectos.';
        errEl.style.display = 'block';
      }
    });
  }

  // Student Login Handle
  if (formLoginStudent) {
    formLoginStudent.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('student-email').value.trim().toLowerCase();
      const pass = document.getElementById('student-password').value;
      const errEl = document.getElementById('student-login-error');
      
      const list = getStudents();
      const matchedUser = list.find(student => student.email.toLowerCase() === email && student.password === pass);

      if (matchedUser) {
        errEl.style.display = 'none';
        formLoginStudent.reset();

        // Show Student Dashboard
        portalHeaderPublic.style.display = 'none';
        portalLoginBox.style.display = 'none';
        portalStudentDashboard.style.display = 'block';
        studentWelcomeEmail.textContent = email;
      } else {
        errEl.textContent = 'Correo electrónico o contraseña incorrectos.';
        errEl.style.display = 'block';
      }
    });
  }

  // Create Student Handle
  if (formCreateStudent) {
    formCreateStudent.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('new-student-email');
      const passInput = document.getElementById('new-student-password');
      const email = emailInput.value.trim().toLowerCase();
      const password = passInput.value;

      const successEl = document.getElementById('create-student-success');
      const errorEl = document.getElementById('create-student-error');

      successEl.style.display = 'none';
      errorEl.style.display = 'none';

      const list = getStudents();
      const exists = list.some(student => student.email.toLowerCase() === email);

      if (exists) {
        errorEl.textContent = 'Este alumno ya está registrado.';
        errorEl.style.display = 'block';
      } else {
        list.push({ email, password });
        saveStudents(list);
        renderStudents();
        
        emailInput.value = '';
        passInput.value = '';
        successEl.textContent = '¡Alumno registrado con éxito!';
        successEl.style.display = 'block';

        setTimeout(() => {
          successEl.style.display = 'none';
        }, 3000);
      }
    });
  }

  // Change Admin Credentials Handle
  const formChangeAdmin = document.getElementById('form-change-admin');
  if (formChangeAdmin) {
    formChangeAdmin.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUser = document.getElementById('change-admin-user').value.trim();
      const newPass = document.getElementById('change-admin-password').value;
      const successEl = document.getElementById('change-admin-success');
      const errorEl = document.getElementById('change-admin-error');

      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';

      if (!newUser || !newPass) {
        if (errorEl) {
          errorEl.textContent = 'El usuario y la contraseña no pueden estar vacíos.';
          errorEl.style.display = 'block';
        }
        return;
      }

      saveAdminCredentials({ user: newUser, pass: newPass });
      
      // Update badge
      const adminBadge = document.querySelector('.user-badge.admin');
      if (adminBadge) {
        adminBadge.textContent = `${newUser} (Entrenador)`;
      }

      if (successEl) {
        successEl.textContent = '¡Credenciales actualizadas con éxito!';
        successEl.style.display = 'block';

        setTimeout(() => {
          successEl.style.display = 'none';
        }, 3000);
      }
    });
  }

  // Logout Handlers
  function logout() {
    portalStudentDashboard.style.display = 'none';
    portalAdminDashboard.style.display = 'none';
    
    portalHeaderPublic.style.display = 'block';
    portalLoginBox.style.display = 'block';
    
    if (formLoginStudent) formLoginStudent.reset();
    if (formLoginAdmin) formLoginAdmin.reset();
    if (formCreateStudent) formCreateStudent.reset();
    if (formChangeAdmin) formChangeAdmin.reset();

    const studentLoginError = document.getElementById('student-login-error');
    if (studentLoginError) studentLoginError.style.display = 'none';
    const adminLoginError = document.getElementById('admin-login-error');
    if (adminLoginError) adminLoginError.style.display = 'none';
    const changeAdminError = document.getElementById('change-admin-error');
    if (changeAdminError) changeAdminError.style.display = 'none';
    const changeAdminSuccess = document.getElementById('change-admin-success');
    if (changeAdminSuccess) changeAdminSuccess.style.display = 'none';
  }

  if (btnStudentLogout) {
    btnStudentLogout.addEventListener('click', logout);
  }
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', logout);
  }
});
