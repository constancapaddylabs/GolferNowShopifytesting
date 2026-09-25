(function () {
  function initAccordion(root) {
    if (!root || root.dataset.gnMnavReady === 'true') return;
    root.dataset.gnMnavReady = 'true';

    var toggles = root.querySelectorAll('[data-gn-mnav-toggle]');
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var panelId = toggle.getAttribute('aria-controls');
        var panel = panelId ? root.querySelector('#' + CSS.escape(panelId)) : null;
        var willOpen = toggle.getAttribute('aria-expanded') !== 'true';

        toggles.forEach(function (other) {
          var otherId = other.getAttribute('aria-controls');
          var otherPanel = otherId ? root.querySelector('#' + CSS.escape(otherId)) : null;
          other.setAttribute('aria-expanded', 'false');
          if (otherPanel) {
            otherPanel.classList.remove('is-open');
            otherPanel.hidden = true;
          }
        });

        if (willOpen && panel) {
          toggle.setAttribute('aria-expanded', 'true');
          panel.classList.add('is-open');
          panel.hidden = false;
        }
      });
    });
  }

  function focusDrawer(details) {
    var closeBtn = details.querySelector('.popup-modal__toggle');
    var dialog = details.querySelector('[role="dialog"]');
    if (!closeBtn) return;
    setTimeout(function () {
      if (typeof trapFocus === 'function') {
        trapFocus(details, closeBtn);
      } else {
        closeBtn.focus();
      }
      if (dialog) dialog.setAttribute('tabindex', '-1');
    }, 120);
  }

  function bindHost(host) {
    if (!host || host.dataset.gnMnavBound === 'true') return;
    host.dataset.gnMnavBound = 'true';

    var details = host.querySelector('details.disclosure-has-popup');
    var menu = host.querySelector('.gn-mnav');
    initAccordion(menu);

    if (details) {
      details.addEventListener('toggle', function () {
        if (details.open) {
          focusDrawer(details);
        } else if (menu) {
          menu.querySelectorAll('[data-gn-mnav-toggle]').forEach(function (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
          });
          menu.querySelectorAll('[data-gn-mnav-panel]').forEach(function (panel) {
            panel.classList.remove('is-open');
            panel.hidden = true;
          });
        }
      });
    }
  }

  function boot() {
    document.querySelectorAll('.menu-drawer.gn-mnav-host').forEach(bindHost);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', boot);
})();
