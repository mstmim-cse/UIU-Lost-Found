// Main App Logic

// --- Reward System ---
const RewardSystem = {
  getPoints: function() {
    return parseInt(localStorage.getItem('rewardPoints')) || 120; // Default 120 for mockup testing
  },
  
  setPoints: function(points) {
    localStorage.setItem('rewardPoints', points);
    this.updateRewardUI();
  },

  addPoints: function(amount, reason) {
    const newPoints = this.getPoints() + amount;
    this.setPoints(newPoints);
    this.showPopup(`+${amount} Points Earned`, reason, 'success');
  },

  removePoints: function(amount, reason) {
    const newPoints = Math.max(0, this.getPoints() - amount);
    this.setPoints(newPoints);
    this.showPopup(`-${amount} Points Lost`, reason, 'danger');
  },

  getBadge: function(points) {
    if (points >= 600) return { title: 'UIU Guardian', color: 'var(--primary)' };
    if (points >= 300) return { title: 'Campus Hero', color: 'var(--warning)' };
    if (points >= 150) return { title: 'Trusted Member', color: 'var(--success)' };
    if (points >= 50) return { title: 'Helpful Student', color: '#3b82f6' };
    return { title: 'New Member', color: 'var(--text-secondary)' };
  },

  getBadgeIcon: function(points) {
    if (points >= 600) return 'fa-crown';
    if (points >= 300) return 'fa-medal';
    if (points >= 150) return 'fa-star';
    if (points >= 50) return 'fa-hands-helping';
    return 'fa-user';
  },

  updateRewardUI: function() {
    const points = this.getPoints();
    const badge = this.getBadge(points);
    const icon = this.getBadgeIcon(points);

    // Update global point displays
    document.querySelectorAll('.display-reward-points').forEach(el => el.innerText = points);
    
    // Update badge displays
    document.querySelectorAll('.display-reward-badge').forEach(el => {
      el.innerHTML = `<i class="fas ${icon}" style="margin-right: 4px;"></i> ${badge.title}`;
      el.style.color = badge.color;
      el.style.borderColor = badge.color;
      if (el.classList.contains('badge-bg')) {
        el.style.backgroundColor = badge.color + '20'; // 20% opacity
      }
    });

    // Update Progress Bars
    const progressFills = document.querySelectorAll('.reputation-progress-fill');
    progressFills.forEach(fill => {
      let nextTier = 50;
      if (points >= 50) nextTier = 150;
      if (points >= 150) nextTier = 300;
      if (points >= 300) nextTier = 600;
      if (points >= 600) nextTier = 1000;

      let prevTier = 0;
      if (points >= 50) prevTier = 50;
      if (points >= 150) prevTier = 150;
      if (points >= 300) prevTier = 300;
      if (points >= 600) prevTier = 600;

      const percentage = Math.min(100, Math.max(0, ((points - prevTier) / (nextTier - prevTier)) * 100));
      fill.style.width = `${percentage}%`;

      const textEl = fill.parentElement.nextElementSibling;
      if (textEl && textEl.classList.contains('progress-text')) {
        textEl.innerText = `${nextTier - points} points to next tier`;
        if (points >= 600) textEl.innerText = "Max Level Reached";
      }
    });

    // Update displays for next tier progress
    document.querySelectorAll('.display-reward-points-next').forEach(el => {
      let nextTier = 50;
      if (points >= 50) nextTier = 150;
      if (points >= 150) nextTier = 300;
      if (points >= 300) nextTier = 600;
      if (points >= 600) nextTier = 1000;
      el.innerText = points >= 600 ? 'Max Level' : `${points} / ${nextTier} PTS`;
    });

    // Update Leaderboard if renderLeaderboard function exists
    if (typeof renderLeaderboard === 'function') {
      renderLeaderboard();
    }
  },

  showPopup: function(title, reason, type = 'success') {
    const popup = document.createElement('div');
    popup.className = `points-popup ${type}`;
    const icon = type === 'success' ? 'fa-arrow-up' : 'fa-arrow-down';
    popup.innerHTML = `
      <i class="fas ${icon}"></i>
      <div>
        <div style="font-size: 1.125rem;">${title}</div>
        <div style="font-size: 0.875rem; font-weight: normal; opacity: 0.9;">${reason}</div>
      </div>
    `;
    document.body.appendChild(popup);
    
    // Trigger animation
    setTimeout(() => popup.classList.add('show'), 50);

    // Remove
    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 400);
    }, 4000);
  },

  checkDailyLogin: function() {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLoginDate');
    if (lastLogin !== today) {
      localStorage.setItem('lastLoginDate', today);
      setTimeout(() => {
         this.addPoints(1, 'Daily Login Bonus');
      }, 2000);
    }
  }
};

// --- Activity Log ---
const ActivityLog = {
  getEvents: function() {
    const defaultEvents = [
      { type: 'success', title: 'Successfully Returned Item', date: 'Oct 12, 2026', text: 'You successfully returned the <strong>Black Leather Wallet</strong> to its owner.' },
      { type: 'warning', title: 'Claimed an Item', date: 'Oct 10, 2026', text: 'You submitted a claim for <strong>MacBook Pro Charger</strong>. Status: <span style="color: var(--primary);">Accepted</span>' },
      { type: 'info', title: 'Posted Found Item', date: 'Oct 05, 2026', text: 'You reported a found <strong>Black Leather Wallet</strong> near the library.' }
    ];
    const saved = localStorage.getItem('activityLog');
    return saved ? JSON.parse(saved) : defaultEvents;
  },
  
  addEvent: function(type, title, text) {
    const events = this.getEvents();
    const newEvent = {
      type: type,
      title: title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      text: text
    };
    events.unshift(newEvent);
    localStorage.setItem('activityLog', JSON.stringify(events));
    this.render();
  },
  
  render: function() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    const events = this.getEvents();
    timeline.innerHTML = events.map(e => `
      <div class="timeline-item">
        <div class="timeline-marker ${e.type}"></div>
        <div class="timeline-content">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <h4 style="margin: 0; font-size: 1rem;">${e.title}</h4>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">${e.date}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0;">${e.text}</p>
        </div>
      </div>
    `).join('');
  }
};



// Theme Toggle
function initTheme() {
  const themeToggles = document.querySelectorAll('#themeToggle, #profileThemeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggles.forEach(toggle => {
    toggle.checked = currentTheme === 'dark';
    toggle.addEventListener('change', (e) => {
      const newTheme = e.target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      // Sync other toggles
      themeToggles.forEach(t => { if(t !== toggle) t.checked = e.target.checked; });
    });
  });
}

// --- Archive Logic ---
function isItemArchived(dateString) {
  if (!dateString) return false;
  const itemDate = new Date(dateString);
  // Using a mock "today" date to match the existing dates in the system
  const mockToday = new Date('2026-05-21'); 
  const diffTime = Math.abs(mockToday - itemDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays > 30;
}

// Render Item Card
function createItemCard(item, isArchived = false) {
  const badgeClass = `badge-${item.type}`;
  const badgeText = item.type.charAt(0).toUpperCase() + item.type.slice(1);
  const archivedClass = isArchived ? 'archived-card' : '';
  const archivedBadge = isArchived ? `<span class="badge" style="background-color: var(--text-secondary); color: white; margin-left: 8px;"><i class="fas fa-archive"></i> Archived</span>` : '';
  
  return `
    <div class="card item-card-clickable ${archivedClass}" onclick="openItemDetails(${item.id})">
      <img src="${item.image}" alt="${item.title}" class="card-img" loading="lazy" />
      <div class="card-body">
        <div class="mb-1"><span class="badge ${badgeClass}">${badgeText}</span>${archivedBadge}</div>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-text">${item.description}</p>
        <div class="card-footer" style="padding-top: 12px;">
          <span style="font-size: 0.875rem; color: var(--text-secondary);">
            <i class="fas fa-map-marker-alt"></i> ${item.location}
          </span>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">
            <i class="fas fa-clock"></i> ${isArchived ? 'Archived' : 'Today'}
          </span>
        </div>
      </div>
    </div>
  `;
}

// Render Dashboard Items
function renderDashboard() {
  const grid = document.getElementById('itemsGrid');
  if (!grid) return;
  
  // Show skeletons
  grid.innerHTML = Array(6).fill(`
    <div class="card">
      <div class="skeleton skeleton-img"></div>
      <div class="card-body">
        <div class="skeleton skeleton-text short"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  `).join('');

  // Simulate network delay
  setTimeout(() => {
    filterAndRender();
  }, 800);
}

// Render Contributor Leaderboard
function renderLeaderboard() {
  const leaderboardBody = document.getElementById('leaderboardBody');
  if (!leaderboardBody) return;

  const currentPoints = parseInt(localStorage.getItem('rewardPoints')) || 120;

  // Mock list of contributors
  const contributors = [
    { name: "John Doe", points: 285, badge: "Campus Hero", icon: "fa-medal", color: "var(--warning)" },
    { name: "Sarah Smith", points: 195, badge: "Trusted Member", icon: "fa-star", color: "var(--success)" },
    { name: "Mst. Mim", points: currentPoints, badge: "", icon: "", color: "", isSelf: true },
    { name: "Mike Johnson", points: 80, badge: "Helpful Student", icon: "fa-hands-helping", color: "#3b82f6" },
    { name: "Emily Chen", points: 45, badge: "New Member", icon: "fa-user", color: "var(--text-secondary)" }
  ];

  // Resolve self badge info
  const selfBadge = RewardSystem.getBadge(currentPoints);
  const selfIcon = RewardSystem.getBadgeIcon(currentPoints);
  const selfIndex = contributors.findIndex(c => c.isSelf);
  contributors[selfIndex].badge = selfBadge.title;
  contributors[selfIndex].icon = selfIcon;
  contributors[selfIndex].color = selfBadge.color;

  // Sort contributors by points descending
  contributors.sort((a, b) => b.points - a.points);

  leaderboardBody.innerHTML = contributors.map((c, index) => {
    const isSelfStyle = c.isSelf ? 'style="background: var(--primary-light); font-weight: bold; border: 1px solid var(--primary);"' : '';
    const rankIcon = index === 0 ? '<i class="fas fa-trophy" style="color: #ffd700;"></i>' : 
                     index === 1 ? '<i class="fas fa-trophy" style="color: #c0c0c0;"></i>' :
                     index === 2 ? '<i class="fas fa-trophy" style="color: #cd7f32;"></i>' : 
                     `<span style="width: 14px; text-align: center; font-size: 0.875rem;">${index + 1}</span>`;

    return `
      <div class="leaderboard-item" ${isSelfStyle} style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: var(--radius-md); margin-bottom: 8px; font-size: 0.875rem; background: var(--surface-color); border: 1px solid var(--border-color);">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${rankIcon}
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span>${c.name}</span>
              ${c.isSelf ? '<span class="badge" style="font-size: 0.6rem; padding: 1px 4px; background: var(--primary); color: white;">You</span>' : ''}
            </div>
            <span style="font-size: 0.7rem; color: ${c.color}; display: flex; align-items: center; gap: 3px;">
              <i class="fas ${c.icon}"></i> ${c.badge}
            </span>
          </div>
        </div>
        <strong style="color: var(--text-primary);">${c.points} pts</strong>
      </div>
    `;
  }).join('');
}

// Filter Logic
function filterAndRender() {
  const grid = document.getElementById('itemsGrid');
  if (!grid) return;

  const typeFilter = document.getElementById('typeFilter')?.value || 'all';
  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
  const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';

  let filtered = items.filter(item => {
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchSearch = item.title.toLowerCase().includes(searchInput) || item.description.toLowerCase().includes(searchInput);
    return matchType && matchCat && matchSearch && !isItemArchived(item.date);
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-search"></i>
        <h3>No items found</h3>
        <p>Try adjusting your filters or search term.</p>
      </div>
    `;
  } else {
    grid.innerHTML = filtered.map(item => createItemCard(item)).join('');
  }
}

// Archive Filtering
function filterAndRenderArchive() {
  const grid = document.getElementById('archiveGrid');
  if (!grid) return;

  const typeFilter = document.getElementById('typeFilter')?.value || 'all';
  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
  const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';

  let filtered = items.filter(item => {
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchSearch = item.title.toLowerCase().includes(searchInput) || item.description.toLowerCase().includes(searchInput);
    return matchType && matchCat && matchSearch && isItemArchived(item.date);
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-archive" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 16px;"></i>
        <h3>No archived items yet</h3>
        <p>Items older than 30 days will automatically appear here.</p>
      </div>
    `;
  } else {
    grid.innerHTML = filtered.map(item => createItemCard(item, true)).join('');
  }
}

function renderArchive() {
  const grid = document.getElementById('archiveGrid');
  if (!grid) return;
  
  grid.innerHTML = Array(6).fill(`
    <div class="card archived-card">
      <div class="skeleton skeleton-img"></div>
      <div class="card-body">
        <div class="skeleton skeleton-text short"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  `).join('');

  setTimeout(() => {
    filterAndRenderArchive();
  }, 800);
}

// Setup Filters
function setupFilters() {
  const filters = ['typeFilter', 'categoryFilter', 'searchInput'];
  filters.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (window.location.pathname.includes('archive.html')) filterAndRenderArchive();
        else filterAndRender();
      });
      el.addEventListener('change', () => {
        if (window.location.pathname.includes('archive.html')) filterAndRenderArchive();
        else filterAndRender();
      });
    }
  });
}

// Item Details Modal Logic
function openItemDetails(itemId) {
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById('itemDetailsModal');
  if (!modal) return;

  // Populate modal data
  document.getElementById('detailImage').src = item.image;
  document.getElementById('detailTitle').textContent = item.title;
  document.getElementById('detailDescription').textContent = item.description;
  document.getElementById('detailLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.location}`;
  
  const detailUser = document.getElementById('detailUser');
  if (detailUser) {
    detailUser.innerHTML = `<i class="fas fa-user"></i> Posted by ${item.user}`;
  }

  const badge = document.getElementById('detailBadge');
  badge.className = `badge badge-${item.type}`;
  badge.textContent = item.type.charAt(0).toUpperCase() + item.type.slice(1);

  const claimBtn = document.getElementById('detailClaimBtn');
  const isArchived = isItemArchived(item.date);
  
  const actionsDiv = document.querySelector('.item-details-actions');
  const commentsDiv = document.querySelector('.item-details-comments');
  const archiveTimelineDiv = document.getElementById('itemDetailsArchiveTimeline');
  
  if (isArchived) {
      if (actionsDiv) actionsDiv.style.display = 'none';
      if (commentsDiv) commentsDiv.style.display = 'none';
      
      if (archiveTimelineDiv) {
          archiveTimelineDiv.style.display = 'block';
          const itemDateObj = new Date(item.date);
          const archivedDateObj = new Date(itemDateObj);
          archivedDateObj.setDate(archivedDateObj.getDate() + 30);
          
          archiveTimelineDiv.innerHTML = `
            <div style="width: 100%;">
              <h4 style="margin-bottom: 16px;"><i class="fas fa-history"></i> Lifecycle Timeline</h4>
              <div class="timeline" style="margin-top: 0; padding-left: 8px;">
                  <div class="timeline-item">
                      <div class="timeline-marker success"></div>
                      <div class="timeline-content">
                          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                              <h4 style="margin: 0; font-size: 0.9rem;">Posted</h4>
                              <span style="font-size: 0.75rem; color: var(--text-secondary);">${itemDateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                          </div>
                      </div>
                  </div>
                  <div class="timeline-item">
                      <div class="timeline-marker warning"></div>
                      <div class="timeline-content">
                          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                              <h4 style="margin: 0; font-size: 0.9rem;">Archived</h4>
                              <span style="font-size: 0.75rem; color: var(--text-secondary);">${archivedDateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                          </div>
                          <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0;">Archived due to 30 days of inactivity.</p>
                      </div>
                  </div>
              </div>
            </div>
            <button class="btn btn-secondary" style="width: 100%; cursor: not-allowed; opacity: 0.7;" disabled title="Archived items can no longer receive claims"><i class="fas fa-archive"></i> Archived Item (Read-only)</button>
          `;
      }
  } else {
      if (actionsDiv) actionsDiv.style.display = 'flex';
      if (commentsDiv) commentsDiv.style.display = 'block';
      if (archiveTimelineDiv) {
          archiveTimelineDiv.style.display = 'none';
          archiveTimelineDiv.innerHTML = '';
      }

      if (item.user === "Mst. Mim") {
        if (item.type === 'returned') {
          claimBtn.textContent = 'Post Resolved';
          claimBtn.disabled = true;
          claimBtn.style.opacity = '0.6';
          claimBtn.style.cursor = 'not-allowed';
          claimBtn.onclick = null;
        } else {
          claimBtn.textContent = 'Close Post (Mark Resolved)';
          claimBtn.disabled = false;
          claimBtn.style.opacity = '1';
          claimBtn.style.cursor = 'pointer';
          claimBtn.onclick = () => {
            item.type = 'returned';
            if (typeof RewardSystem !== 'undefined') {
              RewardSystem.addPoints(30, 'Resolved own post');
            }
            if (typeof toast !== 'undefined') {
              toast.show('Post marked as resolved! +30 points awarded.');
            }
            closeModal('itemDetailsModal');
            if (window.location.pathname.includes('archive.html')) filterAndRenderArchive();
            else filterAndRender();
          };
        }
      } else {
        claimBtn.disabled = false;
        claimBtn.style.opacity = '1';
        claimBtn.style.cursor = 'pointer';
        claimBtn.textContent = item.type === 'lost' ? 'I Found This' : 'Claim Item';
        claimBtn.onclick = () => {
          requireAuth(() => {
            closeModal('itemDetailsModal');
            openClaimModal(itemId);
          });
        };
      }
  }

  openModal('itemDetailsModal');
}

// Claim Modal Logic
function openClaimModal(itemId) {
  openModal('claimModal');
  const claimForm = document.getElementById('claimForm');
  
  // Setup file drag and drop for claim
  const claimDropArea = document.getElementById('claimDropArea');
  const claimFileInput = document.getElementById('claimFileInput');
  if (claimDropArea && claimFileInput) {
    claimDropArea.onclick = () => claimFileInput.click();
    claimFileInput.onchange = function() {
      if (this.files.length > 0) {
        const file = this.files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                claimDropArea.innerHTML = `<img src="${e.target.result}" style="max-height: 120px; border-radius: 8px; object-fit: cover; margin-bottom: 8px;"><p style="font-size: 0.875rem;">Selected: ${file.name}</p>`;
            };
            reader.readAsDataURL(file);
        } else {
            claimDropArea.innerHTML = `<i class="fas fa-file drag-drop-icon" style="color: var(--primary)"></i><p>Selected: ${file.name}</p>`;
        }
      }
    };
  }

  if(claimForm) {
    claimForm.onsubmit = (e) => {
      e.preventDefault();
      closeModal('claimModal');
      toast.show('Claim request submitted successfully!');
      
      const item = items.find(i => i.id === itemId);
      const itemName = item ? item.title : 'Item';

      setTimeout(() => {
        toast.show(`Your claim for '${itemName}' was approved by the owner!`, 'success');
        
        // Add to notification panel
        const notifList = document.querySelector('.notification-list');
        if (notifList) {
          // Notification 1: Their claim got approved
          const approvedNotif = document.createElement('div');
          approvedNotif.className = 'notification-item unread';
          approvedNotif.innerHTML = `
              <i class="fas fa-check-circle text-success mt-1" style="color: var(--success);"></i>
              <div>
                  <p style="font-size: 0.875rem; margin-bottom: 4px; cursor: pointer;" onclick="window.location.href='messages.html'">Your claim for <strong>${itemName}</strong> was approved! Click to chat.</p>
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">Just now</span>
              </div>
          `;
          notifList.prepend(approvedNotif);

          // Notification 2: Someone claimed their item (to test approval flow)
          const receivedNotif = document.createElement('div');
          receivedNotif.className = 'notification-item unread';
          receivedNotif.innerHTML = `
              <i class="fas fa-hand-paper text-primary mt-1" style="color: var(--primary);"></i>
              <div>
                  <p style="font-size: 0.875rem; margin-bottom: 4px; cursor: pointer;" onclick="openModal('requestReviewModal')"><strong>Jane Doe</strong> claimed your item 'UIU Student ID Card'</p>
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">1 min ago</span>
              </div>
          `;
          notifList.prepend(receivedNotif);

          // Show red dot
          const notifDot = document.querySelector('#notifBtn span');
          if (notifDot) notifDot.style.display = 'block';
        }
      }, 2500);
    }
  }
}

// Post Item Form
function setupPostForm() {
  const form = document.getElementById('postForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      requireAuth(() => {
        toast.show('Item posted successfully!');
        
        // Award points if Found item
        const postTypeEl = document.getElementById('postType');
        const nameEl = form.querySelector('input[placeholder="e.g., Black Leather Wallet"]');
        const itemName = nameEl ? nameEl.value : 'Item';

        if (postTypeEl && postTypeEl.value === 'found') {
          if (typeof RewardSystem !== 'undefined') {
            RewardSystem.addPoints(15, 'Reported a Found Item');
          }
          if (typeof ActivityLog !== 'undefined') {
            ActivityLog.addEvent('info', 'Posted Found Item', `You reported a found <strong>${itemName}</strong>.`);
          }
        } else {
          if (typeof ActivityLog !== 'undefined') {
            ActivityLog.addEvent('warning', 'Posted Lost Item', `You reported a lost <strong>${itemName}</strong>.`);
          }
        }

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      });
    });
  }

  // Setup Drag & Drop
  const dropArea = document.getElementById('dropArea');
  const fileInput = document.getElementById('fileInput');

  if (dropArea && fileInput) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, () => {
        dropArea.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, () => {
        dropArea.classList.remove('dragover');
      }, false);
    });

    dropArea.addEventListener('drop', (e) => {
      let dt = e.dataTransfer;
      let files = dt.files;
      handleFiles(files);
    });

    dropArea.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', function() {
      handleFiles(this.files);
    });

    function handleFiles(files) {
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                dropArea.innerHTML = `<img src="${e.target.result}" style="max-height: 160px; border-radius: 8px; object-fit: cover; margin-bottom: 8px;"><p style="font-size: 0.875rem;">Selected: ${file.name}</p>`;
            };
            reader.readAsDataURL(file);
        } else {
            dropArea.innerHTML = `<i class="fas fa-file drag-drop-icon" style="color: var(--primary)"></i><p>Selected: ${file.name}</p>`;
        }
      }
    }
  }
}

// Auth Simulation
// Initialize from localStorage, default to false if not set
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Temporary override for development if user wants it true initially, but requested is simulation
// If it's the first time visiting, maybe set to true for demo purposes? We'll leave it as actual state.
if (localStorage.getItem('isLoggedIn') === null) {
  isLoggedIn = true; // Defaulting to true for demo purposes
  localStorage.setItem('isLoggedIn', 'true');
}

function requireAuth(actionCallback) {
  if (isLoggedIn) {
    actionCallback();
  } else {
    toast.show('Please log in to continue', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }
}

// Attach auth check to comment/reaction globally
window.handleRestrictedAction = function(actionName) {
  requireAuth(() => {
    toast.show(`${actionName} successful!`);
  });
};

function initAuth() {
  const loggedOutState = document.getElementById('loggedOutState');
  const loggedInState = document.getElementById('loggedInState');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Protect specific navigation links
  const protectedLinks = document.querySelectorAll('a[href="post.html"], a[href="dashboard.html"], a[href="profile.html"]');
  protectedLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        requireAuth(() => {
          window.location.href = link.getAttribute('href');
        });
      }
    });
  });

  // Intercept login and signup forms
  const authForms = document.querySelectorAll('form[action="dashboard.html"]');
  authForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'true');
      isLoggedIn = true;
      if(typeof toast !== 'undefined' && toast.show) {
        toast.show('Authentication successful!');
      }
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  });

  function updateAuthState() {
    if (isLoggedIn) {
      if(loggedOutState) loggedOutState.style.display = 'none';
      if(loggedInState) loggedInState.style.display = 'flex';
    } else {
      if(loggedOutState) loggedOutState.style.display = 'block';
      if(loggedInState) loggedInState.style.display = 'none';
    }
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }

  updateAuthState();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isLoggedIn = false;
      updateAuthState();
      if(typeof toast !== 'undefined' && toast.show) {
        toast.show('Logged out successfully');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
      }
    });
  }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAuth();
  
  // Reward System Init
  RewardSystem.updateRewardUI();
  RewardSystem.checkDailyLogin();
  
  // Activity Log Render
  if (typeof ActivityLog !== 'undefined') {
    ActivityLog.render();
  }
  
  // Page level protection
  const restrictedPages = ['dashboard.html', 'post.html', 'profile.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (restrictedPages.includes(currentPage) && !isLoggedIn) {
    window.location.href = 'login.html';
    return;
  }
  
  // Initialize specific page logic
  if (window.location.pathname.includes('dashboard.html')) {
    renderDashboard();
    setupFilters();
    // Render Leaderboard initially
    if (typeof renderLeaderboard === 'function') {
      renderLeaderboard();
    }
    
    // Simulate auto-archive notification
    const archivedCount = items.filter(i => isItemArchived(i.date)).length;
    if (archivedCount > 0 && !localStorage.getItem('archiveNotified')) {
      setTimeout(() => {
        if (typeof toast !== 'undefined') {
          toast.show(`${archivedCount} items have been automatically archived due to 30 days of inactivity.`, 'info');
          localStorage.setItem('archiveNotified', 'true');
        }
      }, 1500);
    }
  }

  if (window.location.pathname.includes('archive.html')) {
    renderArchive();
    setupFilters();
  }
  
  if (window.location.pathname.includes('post.html')) {
    setupPostForm();
  }

  if (window.location.pathname.includes('profile.html')) {
    setupProfilePage();
  }
});

function setupProfilePage() {
  const profileImageInput = document.getElementById('profileImageInput');
  const profileImagePreview = document.getElementById('profileImagePreview');

  if (typeof renderLeaderboard === 'function') {
    renderLeaderboard();
  }

  if (profileImageInput && profileImagePreview) {
    profileImageInput.addEventListener('change', function(e) {
      const file = this.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          profileImagePreview.src = e.target.result;
          if (typeof toast !== 'undefined') {
            toast.show('Profile picture updated successfully');
          }
          if (typeof RewardSystem !== 'undefined') {
            RewardSystem.addPoints(5, 'Uploaded a Profile Picture');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}
