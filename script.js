(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const form = document.querySelector('#pilot-form');
  const status = document.querySelector('#form-status');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelector('#year').textContent = new Date().getFullYear();

  const setStatus = (message, success = false) => {
    status.textContent = message;
    status.classList.toggle('is-success', success);
  };

  const value = (name) => form.elements[name].value.trim();

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const agencyName = value('agencyName');
      const contactName = value('contactName');
      const email = value('email');
      const siteUrl = value('siteUrl');
      const scopeNote = value('scopeNote');
      const dataCheck = form.elements.dataCheck.checked;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!agencyName || !contactName || !email || !siteUrl) {
        setStatus('Заполните обязательные поля, чтобы подготовить письмо.');
        return;
      }

      let parsedUrl;
      try {
        parsedUrl = new URL(siteUrl);
      } catch {
        setStatus('Укажите полную публичную или разрешённую preview-ссылку, включая https://.');
        return;
      }

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        setStatus('Используйте ссылку с http или https.');
        return;
      }

      if (!emailPattern.test(email)) {
        setStatus('Укажите корректный рабочий email.');
        return;
      }

      if (!dataCheck) {
        setStatus('Подтвердите, что заявка не содержит паролей и данных клиентов.');
        return;
      }

      const subject = `Заявка на QA-проверку VEYLCORE — ${agencyName}`;
      const body = [
        'Здравствуйте, VEYLCORE!',
        '',
        'Хочу обсудить проверку сайта перед запуском за 48 часов.',
        '',
        `Студия: ${agencyName}`,
        `Контакт: ${contactName}`,
        `Рабочая почта: ${email}`,
        `Публичная или разрешённая ссылка: ${parsedUrl.href}`,
        `До пяти страниц / дата запуска: ${scopeNote || 'Не указано'}`,
        '',
        'Подтверждаю, что письмо не содержит паролей, данных клиентов, закрытых материалов и файлов.',
        '',
        'Пожалуйста, подтвердите объём, срок и порядок оплаты через ЮKassa до начала проверки.'
      ].join('\n');

      setStatus('Открываем почтовую программу с готовым письмом. На сайт ничего не загружалось и не сохранялось.', true);
      window.location.href = `mailto:holyhall912@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();
