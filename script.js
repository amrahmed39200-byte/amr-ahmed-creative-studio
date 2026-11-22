const SUPABASE_URL = "https://dglthsfxatckgtwdedir.supabase.co";
const SUPABASE_KEY = "sb_publishable_rFbxDp-FGKrdN7AmiDF4Ug_FpXUFNN5";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  };
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("menu-open", isOpen);
  });
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 700) closeMenu(); });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project[data-category]");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projects.forEach(project => {
      const categories = project.dataset.category.split(" ");
      project.hidden = filter !== "all" && !categories.includes(filter);
    });
  });
});

const inquiryForm = document.querySelector("#project-inquiry-form");
if (inquiryForm) {
  inquiryForm.addEventListener("submit", async event => {
    event.preventDefault();
    const button = inquiryForm.querySelector('button[type="submit"]');
    const status = document.querySelector("#form-status");
    const data = new FormData(inquiryForm);
    if (data.get("_gotcha")) return;
    button.disabled = true;
    button.textContent = "SENDING...";
    status.textContent = "";
    const submission = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: String(data.get("brand") || "").trim() || null,
      service: String(data.get("service") || "").trim() || null,
      project_details: String(data.get("details") || "").trim() || null,
      budget: null,
      timeline: String(data.get("timeline") || "").trim() || null,
      source: "website"
    };
    try {
      const emailResponse = await fetch(inquiryForm.action, {
        method: "POST", body: data, headers: { "Accept": "application/json" }
      });
      if (!emailResponse.ok) {
        const errorBody = await emailResponse.json().catch(() => ({}));
        throw new Error(errorBody.errors?.map(item => item.message).join(", ") || "The form could not be sent. Please try again.");
      }
      const crmResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(submission)
      });
      if (!crmResponse.ok) {
        const details = await crmResponse.text().catch(() => "");
        console.error("CRM sync failed:", crmResponse.status, details);
        status.textContent = "Your inquiry email was sent, but the studio tracker could not save it. Please contact me directly if you need a follow-up.";
        button.textContent = "EMAIL SENT";
        return;
      }
      window.location.href = "success.html";
    } catch (error) {
      console.error("Inquiry submission failed:", error);
      status.textContent = error.message || "Something went wrong. Please email me directly.";
      button.disabled = false;
      button.textContent = "TRY AGAIN ↗";
    }
  });
}
