import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const crm = createClient("https://dglthsfxatckgtwdedir.supabase.co","sb_publishable_rFbxDp-FGKrdN7AmiDF4Ug_FpXUFNN5");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "×" : "☰";
  });
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
  }));
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

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
      budget: String(data.get("budget") || "").trim() || null,
      timeline: String(data.get("timeline") || "").trim() || null,
      source: "website"
    };
    try {
      const [formspreeResult, crmResult] = await Promise.all([
        fetch(inquiryForm.action, { method: "POST", body: data, headers: { "Accept": "application/json" } }),
        crm.from("leads").insert(submission)
      ]);
      if (!formspreeResult.ok) {
        const errorBody = await formspreeResult.json().catch(() => ({}));
        throw new Error(errorBody.errors?.map(x => x.message).join(", ") || "The form could not be sent. Please try again.");
      }
      if (crmResult.error) {
        console.error("CRM sync failed:", crmResult.error);
        status.textContent = "Your inquiry was sent successfully. The studio tracker could not sync this time, but your email notification was still sent.";
        button.disabled = false;
        button.textContent = "TRY AGAIN";
        return;
      }
      window.location.href = "success.html";
    } catch (error) {
      status.textContent = error.message || "Something went wrong. Please email me directly.";
      button.disabled = false;
      button.textContent = "TRY AGAIN ↗";
    }
  });
}