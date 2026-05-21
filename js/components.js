// Toast Notification System
class ToastManager {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'info-circle';
    
    toast.innerHTML = `
      <i class="fas fa-${icon} toast-icon"></i>
      <span>${message}</span>
    `;

    this.container.appendChild(toast);

    // Trigger reflow for animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

const toast = new ToastManager();

// Modal System
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Notifications Dropdown
const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');

if (notifBtn && notifPanel) {
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifPanel.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!notifPanel.contains(e.target) && e.target !== notifBtn) {
      notifPanel.classList.remove('active');
    }
  });
}

// Profile Dropdown
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (profileBtn && profileDropdown) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
    profileBtn.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
      profileDropdown.classList.remove('active');
      profileBtn.classList.remove('active');
    }
  });
}

// Mobile Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// Tab System
function setupTabs() {
  const tabElements = document.querySelectorAll('.tab');
  
  tabElements.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      const parent = tab.parentElement;
      parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      
      // Add active to clicked
      tab.classList.add('active');
      
      // Hide all content
      const targetId = tab.getAttribute('data-target');
      const contentContainer = document.getElementById(tab.getAttribute('data-parent'));
      
      if (contentContainer) {
        contentContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Show target content
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      }
    });
  });
}

// Inject About Us Modal and Footer Link
function injectAboutUs() {
  const footers = document.querySelectorAll('footer .container p');
  footers.forEach(p => {
    p.innerHTML += ` | <a href="#" onclick="openModal('aboutUsModal'); return false;" style="color: var(--primary); text-decoration: none; font-weight: 500; transition: var(--transition);">About Us</a>`;
  });

  if (!document.getElementById('aboutUsModal')) {
    const modalHtml = `
      <div class="modal-overlay" id="aboutUsModal">
          <div class="modal" style="text-align: center; position: relative;">
              <div class="modal-header" style="justify-content: center;">
                  <h3 style="margin: 0;">About UIU Lost & Found</h3>
                  <i class="fas fa-times modal-close" onclick="closeModal('aboutUsModal')" style="position: absolute; right: 32px; top: 32px;"></i>
              </div>
              <div style="padding: 16px 0;">
                  <i class="fas fa-search-location" style="font-size: 3rem; color: var(--primary); margin-bottom: 24px;"></i>
                  <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 32px;">
                      The official hub for connecting lost and found items across the United International University campus. 
                      Our mission is to help students, faculty, and staff easily report and recover their belongings in a secure and organized way.
                  </p>
                  <button class="btn btn-secondary" onclick="closeModal('aboutUsModal')" style="width: 100%;">Close</button>
              </div>
          </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

// Inject Item Details Modal
function injectItemDetailsModal() {
  if (!document.getElementById('itemDetailsModal')) {
    const modalHtml = `
      <div class="modal-overlay" id="itemDetailsModal">
          <div class="modal item-details-modal">
              <div class="modal-header" style="margin-bottom: 16px;">
                  <h3 style="margin: 0;">Item Details</h3>
                  <i class="fas fa-times modal-close" onclick="closeModal('itemDetailsModal')"></i>
              </div>
              <div class="item-details-content">
                  <div class="item-details-img-container">
                      <img id="detailImage" src="" alt="Item" class="item-details-img">
                  </div>
                  <div class="item-details-info">
                      <div class="mb-1" style="display: flex; justify-content: space-between; align-items: center;">
                          <span id="detailBadge" class="badge"></span>
                          <span style="font-size: 0.875rem; color: var(--text-secondary);"><i class="fas fa-clock"></i> Today</span>
                      </div>
                      <h2 id="detailTitle" style="margin-bottom: 8px;"></h2>
                      <p id="detailDescription" style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;"></p>
                      
                      <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                          <span id="detailLocation" style="font-size: 0.875rem; color: var(--text-primary); font-weight: 500; padding: 6px 12px; background-color: var(--bg-color); border-radius: var(--radius-sm);"></span>
                          <span id="detailUser" style="font-size: 0.875rem; color: var(--text-primary); font-weight: 500; padding: 6px 12px; background-color: var(--bg-color); border-radius: var(--radius-sm);"><i class="fas fa-user"></i> Posted by John Doe</span>
                      </div>

                      <div id="itemDetailsArchiveTimeline" style="display: none; margin-bottom: 24px;"></div>

                      <div class="item-details-actions" style="display: flex; gap: 12px; border-top: 1px solid var(--border-color); padding-top: 24px; margin-bottom: 24px;">
                          <button id="detailClaimBtn" class="btn btn-primary" style="flex: 2;"></button>
                          <button class="btn btn-secondary" onclick="handleRestrictedAction('Liked')" style="flex: 1;" title="Like"><i class="far fa-thumbs-up"></i></button>
                          <button class="btn btn-secondary" onclick="handleRestrictedAction('Reported')" style="flex: 1;" title="Report" style="color: var(--danger);"><i class="far fa-flag"></i></button>
                      </div>

                      <div class="item-details-comments">
                          <h4 style="margin-bottom: 16px;">Comments (1)</h4>
                          <div class="comment-item" style="display: flex; gap: 12px; margin-bottom: 16px;">
                              <img src="https://ui-avatars.com/api/?name=Jane+Smith&background=0ea5e9&color=fff" style="width: 32px; height: 32px; border-radius: 50%;" alt="User">
                              <div style="background-color: var(--bg-color); padding: 12px; border-radius: var(--radius-md); flex: 1;">
                                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                      <span style="font-weight: 500; font-size: 0.875rem;">Jane Smith</span>
                                      <span style="font-size: 0.75rem; color: var(--text-secondary);">2h ago</span>
                                  </div>
                                  <p style="font-size: 0.875rem; color: var(--text-secondary);">Is this still available?</p>
                              </div>
                          </div>
                          <div style="display: flex; gap: 8px;">
                              <input type="text" class="form-control" placeholder="Add a comment..." style="padding: 8px 12px; font-size: 0.875rem;">
                              <button class="btn btn-primary" onclick="handleRestrictedAction('Commented')" style="padding: 8px 16px;"><i class="fas fa-paper-plane"></i></button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

// Password Visibility Toggle
function setupPasswordToggles() {
  const toggles = document.querySelectorAll('.toggle-password');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          this.classList.remove('fa-eye');
          this.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          this.classList.remove('fa-eye-slash');
          this.classList.add('fa-eye');
        }
      }
    });
  });
}

// Inject Trust & Safety Modals
function injectTrustSafetyModals() {
  if (!document.getElementById('requestReviewModal')) {
    const reviewModalHtml = `
      <div class="modal-overlay" id="requestReviewModal">
          <div class="modal">
              <div class="modal-header">
                  <h3>Review Claim Request</h3>
                  <i class="fas fa-times modal-close" onclick="closeModal('requestReviewModal')"></i>
              </div>
              
              <div class="user-profile-summary" style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding: 12px; background: var(--bg-color); border-radius: var(--radius-md);">
                  <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=10b981&color=fff" style="width: 48px; height: 48px; border-radius: 50%;" alt="Claimant">
                  <div>
                      <h4 style="margin: 0; display: flex; align-items: center; gap: 6px;">Jane Doe <i class="fas fa-shield-check text-primary" title="Verified UIU Student"></i></h4>
                      <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">Verified UIU Student • 2 Successful Returns</p>
                  </div>
              </div>

              <div style="margin-bottom: 16px;">
                  <label class="form-label" style="font-size: 0.75rem;">Identifying Features Provided:</label>
                  <p style="font-size: 0.875rem; background: var(--bg-color); padding: 12px; border-radius: var(--radius-sm);">"It has a small scratch near the MagSafe port and a sticker of a cat on the adapter block."</p>
              </div>

              <div style="margin-bottom: 24px;">
                  <label class="form-label" style="font-size: 0.75rem;">Proof of Ownership:</label>
                  <div style="background: var(--bg-color); padding: 12px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 12px;">
                      <i class="fas fa-file-image" style="font-size: 1.5rem; color: var(--primary);"></i>
                      <div>
                          <p style="font-size: 0.875rem; margin: 0;">receipt_jan2025.jpg</p>
                          <a href="#" style="font-size: 0.75rem; color: var(--primary);">View Attachment</a>
                      </div>
                  </div>
              </div>

              <div style="display: flex; gap: 12px;">
                  <button class="btn btn-secondary" style="flex: 1; border-color: var(--danger); color: var(--danger);" onclick="rejectClaim(this)">Reject Claim</button>
                  <button class="btn btn-primary" style="flex: 1;" onclick="acceptClaim(this)">Accept & Chat</button>
              </div>
          </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', reviewModalHtml);
  }

  if (!document.getElementById('safeExchangeModal')) {
    const safeModalHtml = `
      <div class="modal-overlay" id="safeExchangeModal">
          <div class="modal" style="text-align: center;">
              <div class="modal-header" style="justify-content: center; border: none; padding-bottom: 0;">
                  <i class="fas fa-times modal-close" onclick="closeModal('safeExchangeModal')" style="position: absolute; right: 32px; top: 32px;"></i>
              </div>
              <i class="fas fa-shield-alt" style="font-size: 4rem; color: var(--primary); margin-bottom: 16px;"></i>
              <h3 style="margin-bottom: 16px;">Safe Exchange Recommendation</h3>
              <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.875rem; line-height: 1.5;">
                  For your safety, we recommend meeting in a well-lit, public area on campus to exchange the item. 
                  <br><br><b>Suggested Locations:</b> UIU Canteen, Main Library Entrance, or Security Desk.
              </p>
              <button class="btn btn-primary" style="width: 100%;" onclick="proceedToChat()">I Understand, Proceed to Chat</button>
          </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', safeModalHtml);
  }
}

// Claim Actions Logic
window.rejectClaim = function(btn) {
    if (confirm("Are you sure you want to reject this claim? This action cannot be undone.")) {
        // Show loading state
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rejecting...';
        btn.disabled = true;
        
        setTimeout(() => {
            closeModal('requestReviewModal');
            toast.show('Claim rejected securely. Your contact info remains hidden.', 'info');
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            setTimeout(() => {
                toast.show('Claimant was penalized -25 points for false claim attempt.', 'warning');
            }, 800);
        }, 800);
    }
};

window.acceptClaim = function(btn) {
    // Show loading state
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Approving...';
    btn.disabled = true;
    
    setTimeout(() => {
        closeModal('requestReviewModal');
        openModal('safeExchangeModal');
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (typeof RewardSystem !== 'undefined') {
            RewardSystem.addPoints(50, 'Successfully Returned an Item');
        }
        if (typeof ActivityLog !== 'undefined') {
            ActivityLog.addEvent('success', 'Successfully Returned Item', 'You successfully returned the <strong>MacBook Charger</strong> to Jane Doe.');
        }
    }, 800);
};

window.proceedToChat = function() {
    closeModal('safeExchangeModal');
    window.location.href = 'messages.html';
};

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  injectAboutUs();
  injectItemDetailsModal();
  setupPasswordToggles();
  injectTrustSafetyModals();
});
