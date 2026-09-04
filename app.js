(function contactFormModule() {
  const form = document.getElementById("contact-form");
  if (!form) return; 

  const phoneInput = document.getElementById("contact-phone");
  const phoneError = document.getElementById("phone-error"); 
  const successBanner = document.getElementById("contact-success"); 

  const PH_PHONE_REGEX = /^(?:\+63|0)9\d{9}$/;

  function isValidPhone(value) {
    const cleaned = value.replace(/[\s-]/g, "");
    return PH_PHONE_REGEX.test(cleaned);
  }

  phoneInput.addEventListener("input", () => {
    const valid = isValidPhone(phoneInput.value);
    phoneError.hidden = valid || phoneInput.value === "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault(); 

    const nameValid = form.name.value.trim() !== "";
    const emailValid = form.email.checkValidity(); 
    const phoneValid = isValidPhone(phoneInput.value);
    const messageValid = form.message.value.trim() !== "";

    phoneError.hidden = phoneValid;

    if (!nameValid || !emailValid || !phoneValid || !messageValid) {
      successBanner.hidden = true;
      return;
    }

    successBanner.hidden = false;
    form.reset();
  });
})();


(function projectsGalleryModule() {
  const gallery = document.getElementById("project-gallery");
  if (!gallery) return; 


  const GITHUB_USERNAME = "octocat"; 
  const REPOS_PER_PAGE = 6;

  const spinner = document.getElementById("loading-spinner");
  const errorBox = document.getElementById("fetch-error");
  const noResultsMsg = document.getElementById("no-results");
  const searchInput = document.getElementById("project-search");
  const prevBtn = document.getElementById("prev-page-btn");
  const nextBtn = document.getElementById("next-page-btn");
  const pageInfo = document.getElementById("page-info");

  let allRepos = []; 
  let currentPage = 1; 

  async function fetchRepos() {
    spinner.hidden = false;
    errorBox.hidden = true;
    
    const url = `https://api.github.com/users/MiniiWinnie/repos?per_page=100&sort=updated`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      const data = await response.json();
      allRepos = data;
      renderGallery();
    } catch (error) {
      console.error("Failed to fetch repos:", error);
      errorBox.textContent =
        "Couldn't load projects right now. Please check your connection and try again.";
      errorBox.hidden = false;
    } finally {
      spinner.hidden = true; 
    }
  }

  function getFilteredRepos() {
    const keyword = searchInput.value.trim().toLowerCase(); 
    return allRepos.filter(({ name }) => name.toLowerCase().includes(keyword));
  }

  function createProjectCard(repo) {
    const { name, description, html_url, language } = repo;

    const card = document.createElement("article");
    card.className = "project-card";

    const title = document.createElement("h3");
    title.textContent = name;
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = description ? description : "No description provided.";
    card.appendChild(desc);

    const footer = document.createElement("div");
    footer.className = "project-card-footer";

    const meta = document.createElement("span");
    meta.textContent = language ?? "N/A";
    footer.appendChild(meta);
    card.appendChild(footer);

    const link = document.createElement("a");
    link.href = html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View repository";
    card.appendChild(link);

    return card;
  }

  function renderGallery() {
    const filtered = getFilteredRepos();
    const totalPages = Math.max(1, Math.ceil(filtered.length / REPOS_PER_PAGE));

    if (currentPage > totalPages) currentPage = totalPages; 

    const start = (currentPage - 1) * REPOS_PER_PAGE;
    const pageItems = filtered.slice(start, start + REPOS_PER_PAGE);

    gallery.innerHTML = ""; 
    noResultsMsg.hidden = filtered.length !== 0;

    pageItems.forEach((repo) => {
      gallery.appendChild(createProjectCard(repo));
    });

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  searchInput.addEventListener("input", () => {
    currentPage = 1; 
    renderGallery();
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderGallery();
    }
  });

  nextBtn.addEventListener("click", () => {
    currentPage += 1; 
    renderGallery();
  });

  fetchRepos();
})();