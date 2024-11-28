/*
 * Web Palette Lab - A web tool for generating color palettes
 * Copyright (C) 2024 Sylvie Canongia
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

// src/js/components/helpGuide.js

import { guideContent } from "../utils/guideContent.js";

/**
 * Renders different types of content sections
 */
const renderHelpers = {
  renderFormats: (formats) => `
    <div class="format-list">
      <h4>${formats.title}</h4>
      <ul class="color-formats" role="list">
        ${formats.formats
          .map(
            (format) => `
          <li>
            <span class="format-type">${format.type} :</span>
            <code>${format.example}</code>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `,

  renderVariations: (variations) => `
    <div class="variations-list">
      <h4>${variations.title}</h4>
      <ul role="list">
        ${variations.variations
          .map(
            (v) => `
          <li>
            <strong>${v.type} :</strong> ${v.description}
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `,

  renderFeatures: (features) => `
    <div class="features-list">
      <h4>${features.title}</h4>
      <ul role="list">
        ${features.features
          .map(
            (f) => `
          <li>
            <strong>${f.action} :</strong> ${f.description}
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `,

  renderGuidelines: (guidelines) => `
    <div class="guidelines-list">
      <h4>${guidelines.title}</h4>
      <ul role="list">
        ${guidelines.guidelines
          .map(
            (g) => `
          <li>
            <strong>${g.rule} :</strong> ${g.value}
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `,
};

/**
 * Renders a single section of the help guide
 * @param {Object} section - Section data object
 * @returns {string} HTML string
 */
const renderSection = (section) => {
  const renderContentItem = (item) => {
    if (typeof item === "string") return `<p>${item}</p>`;
    if (item.title && item.description) {
      return `
        <div class="content-item">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      `;
    }
    if (item.formats) return renderHelpers.renderFormats(item);
    if (typeof item === "string") return `<p>${item}</p>`;
    if (item.formats) return renderHelpers.renderFormats(item);
    if (item.variations) return renderHelpers.renderVariations(item);
    if (item.features) return renderHelpers.renderFeatures(item);
    if (item.guidelines) return renderHelpers.renderGuidelines(item);
    return "";
  };
  return `
    <section class="help-section" aria-labelledby="section-${section.title.toLowerCase().replace(/\s+/g, "-")}">
      <h3 id="section-${section.title.toLowerCase().replace(/\s+/g, "-")}">${section.title}</h3>
      <div class="help-content">
        ${section.content.map(renderContentItem).join("")}
      </div>
    </section>
  `;
};

/**
 * Initializes the help guide functionality
 */
export const initHelpGuide = () => {
  // Cache DOM elements
  const elements = {
    dialog: document.getElementById("helpDialog"),
    helpButton: document.getElementById("helpButton"),
    closeButton: document.querySelector("#helpDialog .close-button"),
    tabButtons: document.querySelectorAll('#helpDialog [role="tab"]'),
    dialogBody: document.querySelector("#helpDialog .dialog-body"),
  };

  // Current language state
  let currentLang = "fr";

  /**
   * Renders content for the selected language
   * @param {string} lang - Language code ('fr' or 'en')
   */
  const renderContent = (lang) => {
    const content = guideContent[lang];
    elements.dialogBody.innerHTML = content.sections.map(renderSection).join("");
  };

  // Event handlers
  const handlers = {
    openDialog: () => {
      elements.dialog.showModal();
      renderContent(currentLang);
    },

    closeDialog: () => elements.dialog.close(),

    handleOutsideClick: (e) => {
      if (e.target === elements.dialog) elements.dialog.close();
    },

    switchLanguage: (e) => {
      const lang = e.target.textContent.toLowerCase();
      if (lang === currentLang) return;

      elements.tabButtons.forEach((btn) => {
        btn.setAttribute("aria-selected", btn === e.target);
      });

      currentLang = lang;
      renderContent(lang);
    },
  };

  // Event Listeners
  elements.helpButton.addEventListener("click", handlers.openDialog);
  elements.closeButton.addEventListener("click", handlers.closeDialog);
  elements.dialog.addEventListener("click", handlers.handleOutsideClick);
  elements.tabButtons.forEach((btn) => btn.addEventListener("click", handlers.switchLanguage));
  elements.dialog.addEventListener("keydown", (e) => e.key === "Escape" && handlers.closeDialog());
};
