(function () {
  "use strict";

  /*--------------------------------------------------------------
  # Apply .scrolled class to the body as the page is scrolled down
  --------------------------------------------------------------*/
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);


  /*--------------------------------------------------------------
  # Mobile nav toggle
  --------------------------------------------------------------*/
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);


  /*--------------------------------------------------------------
  # Hide mobile nav on same-page/hash links
  --------------------------------------------------------------*/
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });


  /*--------------------------------------------------------------
  # Toggle mobile nav dropdowns
  --------------------------------------------------------------*/
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });


  /*--------------------------------------------------------------
  # Preloader
  --------------------------------------------------------------*/
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }


  /*--------------------------------------------------------------
  # Scroll top button
  --------------------------------------------------------------*/
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /*--------------------------------------------------------------
  # Animation on scroll function and init
  --------------------------------------------------------------*/
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /*--------------------------------------------------------------
  # Initiate glightbox
  --------------------------------------------------------------*/
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /*--------------------------------------------------------------
  # Initiate Pure Counter
  --------------------------------------------------------------*/
  new PureCounter();

  /*--------------------------------------------------------------
  # Init isotope layout and filters
  --------------------------------------------------------------*/
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /*--------------------------------------------------------------
  # Init swiper sliders
  --------------------------------------------------------------*/
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  /*---------------------------------------------------------------------------
  #  Correct scrolling position upon page load for URLs containing hash links
  ---------------------------------------------------------------------------*/

  window.addEventListener("load", initSwiper);

  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /*--------------------------------------------------------------
  # Navmenu Scrollspy
  --------------------------------------------------------------*/
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /*------------------------------------------------------------------------------
  # Footer Current Year
  ------------------------------------------------------------------------------*/
  document.getElementById("current-year").textContent = new Date().getFullYear();

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("energyCalculatorForm");
    const resultContainer = document.getElementById("resultContainer");
    const energyProfileOutput = document.getElementById("energyProfile");
    const co2EmissionsOutput = document.getElementById("co2Emissions");
    const recommendationsList = document.getElementById("recommendationsList");

    let energyChart, co2Chart, comparisonEnergyChart, comparisonCo2Chart;

    function setCookie(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
    }

    function getCookie(name) {
      let cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        let [key, value] = cookies[i].split("=");
        if (key === name) return decodeURIComponent(value);
      }
      return null;
    }

    function deleteCookie(name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    function createCharts(energyProfile, co2Emissions) {
      const ctxEnergy = document.getElementById("energyChart").getContext("2d");
      const ctxCO2 = document.getElementById("co2Chart").getContext("2d");

      if (energyChart) energyChart.destroy();
      if (co2Chart) co2Chart.destroy();

      energyChart = new Chart(ctxEnergy, {
        type: "doughnut",
        data: {
          labels: ["Efficiency", "Remaining"],
          datasets: [{
            data: [energyProfile, 100 - energyProfile],
            backgroundColor: ["#28a745", "#e0e0e0"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" }
          }
        }
      });

      co2Chart = new Chart(ctxCO2, {
        type: "bar",
        data: {
          labels: ["CO₂ Emissions"],
          datasets: [{
            label: "kg CO₂",
            data: [co2Emissions],
            backgroundColor: "#dc3545"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: co2Emissions * 1.2,
              ticks: {
                stepSize: Math.ceil(co2Emissions / 5) * 5
              }
            }
          }
        }
      });
    }

    function createComparisonCharts(energyProfile, co2Emissions) {
      const idealEnergyProfile = 95;
      const idealCo2Emissions = co2Emissions * 0.5;

      document.getElementById("currentEnergyProfile").textContent = energyProfile;
      document.getElementById("currentCo2Emissions").textContent = co2Emissions;
      document.getElementById("idealCo2Emissions").textContent = idealCo2Emissions.toFixed(1);

      const ctxComparisonEnergy = document.getElementById("comparisonEnergyChart").getContext("2d");
      const ctxComparisonCo2 = document.getElementById("comparisonCo2Chart").getContext("2d");

      if (comparisonEnergyChart) comparisonEnergyChart.destroy();
      if (comparisonCo2Chart) comparisonCo2Chart.destroy();

      comparisonEnergyChart = new Chart(ctxComparisonEnergy, {
        type: "bar",
        data: {
          labels: ["Your Score", "Ideal Score"],
          datasets: [{
            label: "Energy Efficiency",
            data: [energyProfile, idealEnergyProfile],
            backgroundColor: ["#28a745", "#007bff"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { max: 100 } }
        }
      });

      comparisonCo2Chart = new Chart(ctxComparisonCo2, {
        type: "bar",
        data: {
          labels: ["Your Emissions", "Ideal Emissions"],
          datasets: [{
            label: "CO₂ Emissions",
            data: [co2Emissions, idealCo2Emissions],
            backgroundColor: ["#dc3545", "#007bff"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const heatingType = document.getElementById("heatingType").value;
      const numAppliances = parseInt(document.getElementById("numAppliances").value);
      const lightingType = document.getElementById("lightingType").value;
      const energyUsage = parseFloat(document.getElementById("energyUsage").value);

      if (!heatingType || numAppliances <= 0 || !lightingType || energyUsage <= 0) {
        alert("Please fill all fields with valid values.");
        return;
      }

      let energyProfile = 100 - (numAppliances * 1.5 + energyUsage * 0.2);
      energyProfile = Math.max(0, Math.min(100, energyProfile));

      let co2Emissions = energyUsage * 0.5;
      if (heatingType === "gas") co2Emissions *= 1.2;
      if (heatingType === "wood") co2Emissions *= 1.5;
      if (heatingType === "solar") co2Emissions *= 0.2;

      let recommendations = [];
      if (energyProfile < 50) recommendations.push("Consider switching to LED lighting.");
      if (heatingType !== "solar") recommendations.push("Solar heating can significantly lower emissions.");
      if (numAppliances > 10) recommendations.push("Reduce standby power by unplugging unused devices.");
      if (energyUsage > 500) recommendations.push("Consider energy-efficient appliances to cut down power use.");

      energyProfileOutput.textContent = energyProfile;
      co2EmissionsOutput.textContent = co2Emissions;

      recommendationsList.innerHTML = "";
      recommendations.forEach(rec => {
        let li = document.createElement("li");
        li.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${rec}`;
        li.classList.add("recommendation-item");
        recommendationsList.appendChild(li);
      });

      resultContainer.style.display = "block";

      setCookie("heatingType", heatingType, 1);
      setCookie("numAppliances", numAppliances, 1);
      setCookie("lightingType", lightingType, 1);
      setCookie("energyUsage", energyUsage, 1);
      setCookie("energyProfile", energyProfile, 1);
      setCookie("co2Emissions", co2Emissions, 1);
      setCookie("recommendations", recommendations.join(","), 1);

      createCharts(energyProfile, co2Emissions);
      createComparisonCharts(energyProfile, co2Emissions);
    });

    const savedProfile = getCookie("energyProfile");
    const savedEmissions = getCookie("co2Emissions");
    const savedRecommendations = getCookie("recommendations");

    if (savedProfile && savedEmissions && savedRecommendations) {
      energyProfileOutput.textContent = savedProfile;
      co2EmissionsOutput.textContent = savedEmissions;

      recommendationsList.innerHTML = "";
      savedRecommendations.split(",").forEach(rec => {
        let li = document.createElement("li");
        li.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${rec}`;
        li.classList.add("recommendation-item");
        recommendationsList.appendChild(li);
      });

      resultContainer.style.display = "block";
      createCharts(parseFloat(savedProfile), parseFloat(savedEmissions));
      createComparisonCharts(parseFloat(savedProfile), parseFloat(savedEmissions));
    }
  });

  /*------------------------------------------------------------------------------
  # Email Forms Validation
  ------------------------------------------------------------------------------*/

  let forms = document.querySelectorAll('.email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      email_form_submit(thisForm, action, formData);
    });
  });


  function email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => response.text())
      .then(data => {
        console.log("Response from server:", data);

        thisForm.querySelector('.loading').classList.remove('d-block');

        if (data.trim() === 'OK') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.querySelector('.error-message').classList.remove('d-block');
          thisForm.reset();
        } else {
          displayError(thisForm, data);
        }
      })
      .catch((error) => {
        displayError(thisForm, "Error: " + error.message);
      });
  }

  function displayError(thisForm, error) {
    console.error("Form Error:", error);

    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
    thisForm.querySelector('.sent-message').classList.remove('d-block');
  }

})();