document.addEventListener('DOMContentLoaded', () => {
  // Modal email
  const modalEmailContainer = document.querySelector('.modalEmail_container');
  const closeModalEmail = document.querySelector('.modalEmail_close');
  const contactBtn = document.querySelector('.main_content-socials--btn');
  const sendBtn = document.querySelector('.modalEmail_btn');
	const contactForm = document.getElementById('contactForm');

  if (modalEmailContainer) {
    contactBtn.addEventListener('click', () => {
      modalEmailContainer.style.display = 'grid';
    });
    closeModalEmail.addEventListener('click', () => {
      modalEmailContainer.style.display = 'none';
    });
    sendBtn.addEventListener('click', () => {
      modalEmailContainer.style.display = 'none';
    });
  }

	// email

  // Show more projects
  const seeMoreBtn = document.getElementById('see-more-btn');
  let hiddenProjects;

  function updateHiddenProjectsSelector() {
    if (window.innerWidth < 1055) {
      hiddenProjects = document.querySelectorAll('.projects_items-project:nth-child(n+9)');
    } else {
      hiddenProjects = document.querySelectorAll('.projects_items-project:nth-child(n+10)');
    }
  }

	if (contactForm) {
		console.log('Form found');
		contactForm.addEventListener('submit', function (event) {
				event.preventDefault();
				console.log('Form submit handler triggered');

				const subject = document.querySelector('input[name="subject"]').value;
				const message = document.querySelector('textarea[name="message"]').value;

				var data = {
						service_id: 'service_scoiklg',      // Ваш Service ID
						template_id: 'template_t30b28p',    // Ваш Template ID (должно быть другое значение!)
						user_id: 'ApUb0Ei-jtamI4fYB',      // Ваш Public Key
						template_params: {
								'subject': subject,
								'message': message
						}
				};

				$.ajax('https://api.emailjs.com/api/v1.0/email/send', {
						type: 'POST',
						data: JSON.stringify(data),
						contentType: 'application/json'
				})
				.done(function() {
						alert('Your mail is sent!');
						modalEmailContainer.style.display = 'none';
				})
				.fail(function(error) {
						console.log('Oops... ' + JSON.stringify(error));
				});
		});
	}

  if (seeMoreBtn) {
    let areProjectsVisible = false;
    seeMoreBtn.addEventListener('click', () => {
      updateHiddenProjectsSelector();
      if (!areProjectsVisible) {
        hiddenProjects.forEach(project => (project.style.display = 'block'));
        seeMoreBtn.textContent = 'Hide';
        areProjectsVisible = true;
      } else {
        hiddenProjects.forEach(project => (project.style.display = 'none'));
        seeMoreBtn.textContent = 'See more';
        areProjectsVisible = false;
      }
    });
    window.addEventListener('resize', updateHiddenProjectsSelector);
  }

  // Load projects and handle modals
  const projectsContainer = document.querySelector('.projects_items');
  fetch('projects.json')
    .then(response => response.json())
    .then(data => {
      projectsContainer.innerHTML = ''; // Очищаем контейнер
      data.forEach((project, index) => {
        const projectHTML = `
          <div class="projects_items-project">
            <img src="${project.imageSrc}" style="width: 367px; height: 322px;">
            <div class="projects_items-project--hover">
              <h3 class="projects_items-project--hover-title">${project.hoverTitle}</h3>
            </div>
            <div class="modal_container">
              <div class="projectModal">
                <div class="projectModal_close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M1 1L21.5 21.5" stroke="white" />
                    <path d="M21.5 1L0.999999 21.5" stroke="white" />
                  </svg>
                </div>
                <div class="projectModal_content">
                  <div class="projectModal_content-imgBox">
                    <div class="projects_photo-active">
                      <img src="${project.images[0]}">
                    </div>
                    <div class="projects_photo-others">
                      ${project.images.map((imgSrc, imgIndex) => `
                        <img class="projects-photo ${imgIndex === 0 ? 'current' : ''}" src="${imgSrc}">
                      `).join('')}
                    </div>
                  </div>
                  <div class="projectModal_content-text">
                    <div class="projectModal_content-text--general">
                      <h3 class="projectModal_content-text--general-title">${project.projectName}</h3>
                      <p class="projectModal_content-text--general-text">${project.generalText}</p>
                    </div>
                    <span class="border"></span>
                    <div class="projectModal_content-text--secondary">
                      <h4 class="projectModal_content-text--secondary-title">Development</h4>
                      <p class="projectModal_content-text--secondary-text">${project.developmentText}</p>
                    </div>
                    <div class="projectModal_content-text-sprites">
                      ${project.technologies.map(tech => `
                        <p class="projectModal_content-text-sprites--item">
                          <img src="./img/projects/sprite.svg"> ${tech}
                        </p>
                      `).join('')}
                    </div>
                  </div>
                </div>
                <div class="projectModal_footer">
                  <span>${String(index + 1).padStart(2, '0')}</span>
                  <div class="projectModal_footer-arrows">
                    <img src="./img/projects/arrowL.svg">
                    <img src="./img/projects/arrowR.svg">
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        projectsContainer.innerHTML += projectHTML;
      });

      // Обновляем скрытые проекты после загрузки
      updateHiddenProjectsSelector();
      const allProjects = document.querySelectorAll('.projects_items-project');
      if (allProjects.length <= 9 && seeMoreBtn) seeMoreBtn.style.display = 'none';
    })
    .catch(error => console.error('Ошибка при загрузке проектов:', error));

  // Делегирование событий для проектов
  projectsContainer.addEventListener('click', (event) => {
    const item = event.target.closest('.projects_items-project');
    if (!item) return;

    const modalContainer = item.querySelector('.modal_container');
    const closeBtn = item.querySelector('.projectModal_close');
    const arrows = item.querySelector('.projectModal_footer-arrows');

    // Закрытие модального окна
    if (event.target.closest('.projectModal_close') || event.target === closeBtn) {
      modalContainer.style.display = 'none';
      updateHiddenProjectsSelector();
      hiddenProjects.forEach(project => (project.style.display = 'none'));
      if (seeMoreBtn) seeMoreBtn.textContent = 'See more';
      return;
    }

    // Переключение изображений
    if (event.target.classList.contains('projects-photo')) {
      const activeImage = item.querySelector('.projects_photo-active img');
      activeImage.src = event.target.src;
      item.querySelector('.projects-photo.current')?.classList.remove('current');
      event.target.classList.add('current');
      return;
    }

    // Переключение проектов стрелками
    if (event.target.closest('.projectModal_footer-arrows')) {
      const projectItems = document.querySelectorAll('.projects_items-project');
      const index = Array.from(projectItems).indexOf(item);
      const direction = event.target === arrows.firstElementChild ? -1 : 1;
      const totalItems = projectItems.length;
      let nextIndex = (index + direction) % totalItems;
      if (nextIndex < 0) nextIndex = totalItems - 1;
      projectItems[nextIndex].querySelector('.modal_container').style.display = 'grid';
      modalContainer.style.display = 'none';
      return;
    }

    // Открытие модального окна при клике на проект
    modalContainer.style.display = 'grid';
    updateHiddenProjectsSelector();
    hiddenProjects.forEach(project => (project.style.display = 'block'));
    if (seeMoreBtn) seeMoreBtn.textContent = 'Hide';
  });

  // Pagination blog
  const itemsPerPage = window.innerWidth < 1055 ? 8 : 9;
  const blogItemsContainer = document.getElementById('blogItemsContainer');
  const items = blogItemsContainer?.querySelectorAll('.blog_items-item');
  const paginationItems = document.querySelectorAll('.blog_pagination-nav--list-item');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');

  if (paginationItems.length) {
    function showItems(startIndex, endIndex) {
      items?.forEach((item, index) => {
        item.classList.toggle('active', index >= startIndex && index < endIndex);
      });
    }

    function setActivePaginationItem(index) {
      paginationItems.forEach((item, i) => {
        item.classList.toggle('activePag', i === index);
      });
    }

    function handleArrowClick(direction) {
      const activeIndex = [...paginationItems].findIndex(item =>
        item.classList.contains('activePag')
      );
      const newIndex =
        direction === 'prev'
          ? Math.max(activeIndex - 1, 0)
          : Math.min(activeIndex + 1, paginationItems.length - 1);
      paginationItems[newIndex].click();
    }

    paginationItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        const startIndex = index * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        showItems(startIndex, endIndex);
        setActivePaginationItem(index);
      });
    });

    prevArrow?.addEventListener('click', () => handleArrowClick('prev'));
    nextArrow?.addEventListener('click', () => handleArrowClick('next'));

    showItems(0, itemsPerPage);
    setActivePaginationItem(0);
  }

  // Blog item navigation
  const posts = document.querySelectorAll('.post');
  const prevBtn = document.querySelector('#prevBlog');
  const nextBtn = document.querySelector('#nextBlog');
  let currentIndex = 0;

  function showPost(index) {
    posts.forEach((post, i) => {
      post.style.display = i === index ? 'block' : 'none';
    });
  }

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + posts.length) % posts.length;
    showPost(currentIndex);
    history.pushState(null, null, `/posts.html?pos=${currentIndex}`);
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % posts.length;
    showPost(currentIndex);
    history.pushState(null, null, `/posts.html?pos=${currentIndex}`);
  });

  if (posts.length) showPost(currentIndex);

  // Show tooltip
  const tooltipTriggers = document.querySelectorAll('.tooltip_trigger');
  const tooltipTexts = document.querySelectorAll('.tooltip_text');

  tooltipTriggers.forEach((trigger, index) => {
    trigger.addEventListener('mouseenter', () => {
      tooltipTexts[index].style.display = 'inline-block';
    });
    trigger.addEventListener('mouseleave', () => {
      tooltipTexts[index].style.display = 'none';
    });
  });
});