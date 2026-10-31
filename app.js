/**
 * CaloTrack - Pure Vanilla JavaScript
 * Zero Backend, Browser LocalStorage, No Libraries
 */

(function () {
  'use strict';

  // --- Storage Keys ---
  const STORAGE_KEY_DATA = 'calotrack_daily_logs';
  const STORAGE_KEY_SETTINGS = 'calotrack_user_settings';

  // --- Default Settings ---
  const DEFAULT_SETTINGS = {
    calorieTarget: 2000,
    waterTarget: 2500,
    proteinTarget: 140,
    carbsTarget: 220,
    fatTarget: 65
  };

  // --- Quick Food Suggestions / Presets ---
  const FOOD_PRESETS = [
    { name: 'Oatmeal & Berries', cal: 320, p: 11, c: 54, f: 6, serving: '1 bowl (75g dry)', cat: 'breakfast' },
    { name: 'Eggs & Whole Toast', cal: 280, p: 18, c: 24, f: 12, serving: '2 eggs + 1 slice', cat: 'breakfast' },
    { name: 'Greek Yogurt & Honey', cal: 210, p: 17, c: 22, f: 4, serving: '200g', cat: 'breakfast' },
    { name: 'Chicken Breast & Rice', cal: 520, p: 48, c: 55, f: 9, serving: '200g chicken + 150g rice', cat: 'lunch' },
    { name: 'Tuna Salad Wrap', cal: 390, p: 32, c: 38, f: 11, serving: '1 wrap', cat: 'lunch' },
    { name: 'Salmon & Sweet Potato', cal: 580, p: 42, c: 45, f: 22, serving: '200g fillet + 1 potato', cat: 'dinner' },
    { name: 'Steak & Steamed Veggies', cal: 560, p: 46, c: 14, f: 28, serving: '220g sirloin', cat: 'dinner' },
    { name: 'Pasta with Ground Beef', cal: 640, p: 40, c: 75, f: 18, serving: '1 plate (350g)', cat: 'dinner' },
    { name: 'Whey Protein Shake', cal: 130, p: 25, c: 3, f: 2, serving: '1 scoop (32g)', cat: 'snacks' },
    { name: 'Banana', cal: 105, p: 1.3, c: 27, f: 0.3, serving: '1 medium', cat: 'snacks' },
    { name: 'Peanut Butter Toast', cal: 250, p: 9, c: 26, f: 13, serving: '1 slice + 2 tbsp PB', cat: 'snacks' },
    { name: 'Mixed Almonds & Walnuts', cal: 190, p: 5, c: 6, f: 17, serving: '1 handful (30g)', cat: 'snacks' },
    { name: 'Apple with Cinnamon', cal: 95, p: 0.5, c: 25, f: 0.3, serving: '1 large apple', cat: 'snacks' }
  ];

  // --- State ---
  let currentDate = getTodayDateString();
  let appData = loadLogs();
  let userSettings = loadSettings();
  let searchFilter = '';

  // --- DOM Elements ---
  const datePicker = document.getElementById('datePicker');
  const dateDisplayLabel = document.getElementById('dateDisplayLabel');
  const prevDayBtn = document.getElementById('prevDayBtn');
  const nextDayBtn = document.getElementById('nextDayBtn');
  const todayBtn = document.getElementById('todayBtn');

  // Summary Elements
  const calorieProgressCircle = document.getElementById('calorieProgressCircle');
  const caloriesRemainingValue = document.getElementById('caloriesRemainingValue');
  const calorieTargetVal = document.getElementById('calorieTargetVal');
  const calorieConsumedVal = document.getElementById('calorieConsumedVal');
  const caloriePercentageVal = document.getElementById('caloriePercentageVal');
  const calorieStatusBadge = document.getElementById('calorieStatusBadge');

  const proteinConsumedVal = document.getElementById('proteinConsumedVal');
  const proteinTargetVal = document.getElementById('proteinTargetVal');
  const proteinProgressBar = document.getElementById('proteinProgressBar');
  const proteinPercentageVal = document.getElementById('proteinPercentageVal');

  const carbsConsumedVal = document.getElementById('carbsConsumedVal');
  const carbsTargetVal = document.getElementById('carbsTargetVal');
  const carbsProgressBar = document.getElementById('carbsProgressBar');
  const carbsPercentageVal = document.getElementById('carbsPercentageVal');

  const fatConsumedVal = document.getElementById('fatConsumedVal');
  const fatTargetVal = document.getElementById('fatTargetVal');
  const fatProgressBar = document.getElementById('fatProgressBar');
  const fatPercentageVal = document.getElementById('fatPercentageVal');

  // Water Elements
  const waterConsumedVal = document.getElementById('waterConsumedVal');
  const waterTargetVal = document.getElementById('waterTargetVal');
  const waterProgressPercent = document.getElementById('waterProgressPercent');
  const waterCupsContainer = document.getElementById('waterCupsContainer');
  const addWater250Btn = document.getElementById('addWater250Btn');
  const addWater500Btn = document.getElementById('addWater500Btn');
  const resetWaterBtn = document.getElementById('resetWaterBtn');

  // Meal Lists
  const breakfastItemsList = document.getElementById('breakfastItemsList');
  const lunchItemsList = document.getElementById('lunchItemsList');
  const dinnerItemsList = document.getElementById('dinnerItemsList');
  const snacksItemsList = document.getElementById('snacksItemsList');

  const breakfastMacroSum = document.getElementById('breakfastMacroSum');
  const lunchMacroSum = document.getElementById('lunchMacroSum');
  const dinnerMacroSum = document.getElementById('dinnerMacroSum');
  const snacksMacroSum = document.getElementById('snacksMacroSum');

  const foodSearchInput = document.getElementById('foodSearchInput');
  const quickAddGlobalBtn = document.getElementById('quickAddGlobalBtn');

  // Modals & Overlays
  const foodModalOverlay = document.getElementById('foodModalOverlay');
  const closeFoodModalBtn = document.getElementById('closeFoodModalBtn');
  const cancelFoodModalBtn = document.getElementById('cancelFoodModalBtn');
  const foodForm = document.getElementById('foodForm');
  const foodModalTitle = document.getElementById('foodModalTitle');
  const foodEditId = document.getElementById('foodEditId');
  const foodNameInput = document.getElementById('foodNameInput');
  const mealCategorySelect = document.getElementById('mealCategorySelect');
  const foodCaloriesInput = document.getElementById('foodCaloriesInput');
  const foodServingInput = document.getElementById('foodServingInput');
  const foodProteinInput = document.getElementById('foodProteinInput');
  const foodCarbsInput = document.getElementById('foodCarbsInput');
  const foodFatInput = document.getElementById('foodFatInput');
  const saveFoodBtnText = document.getElementById('saveFoodBtnText');
  const presetsContainer = document.getElementById('presetsContainer');

  const settingsModalOverlay = document.getElementById('settingsModalOverlay');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const settingsForm = document.getElementById('settingsForm');
  const settingCaloriesInput = document.getElementById('settingCaloriesInput');
  const settingWaterInput = document.getElementById('settingWaterInput');
  const settingProteinInput = document.getElementById('settingProteinInput');
  const settingCarbsInput = document.getElementById('settingCarbsInput');
  const settingFatInput = document.getElementById('settingFatInput');

  // Calculator inputs
  const calcGender = document.getElementById('calcGender');
  const calcAge = document.getElementById('calcAge');
  const calcWeight = document.getElementById('calcWeight');
  const calcHeight = document.getElementById('calcHeight');
  const calcActivity = document.getElementById('calcActivity');
  const calcGoal = document.getElementById('calcGoal');
  const calcRecommendedCalories = document.getElementById('calcRecommendedCalories');
  const calcMacroSplit = document.getElementById('calcMacroSplit');
  const applyCalcBtn = document.getElementById('applyCalcBtn');

  // Trends Elements
  const trendsModalOverlay = document.getElementById('trendsModalOverlay');
  const openTrendsBtn = document.getElementById('openTrendsBtn');
  const closeTrendsModalBtn = document.getElementById('closeTrendsModalBtn');
  const trendAvgCalories = document.getElementById('trendAvgCalories');
  const trendDaysLogged = document.getElementById('trendDaysLogged');
  const trendAvgWater = document.getElementById('trendAvgWater');
  const chartBarsContainer = document.getElementById('chartBarsContainer');
  const chartYMax = document.getElementById('chartYMax');
  const chartYMid = document.getElementById('chartYMid');

  // Backup Elements
  const exportDataBtn = document.getElementById('exportDataBtn');
  const importDataBtn = document.getElementById('importDataBtn');
  const importFileInput = document.getElementById('importFileInput');
  const clearDayBtn = document.getElementById('clearDayBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const toastContainer = document.getElementById('toastContainer');

  // --- Helpers for Date Formatting ---
  function getTodayDateString() {
    const today = new Date();
    return formatDateKey(today);
  }

  function formatDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getDisplayDateLabel(dateStr) {
    const todayStr = getTodayDateString();
    if (dateStr === todayStr) {
      return 'Today';
    }

    const [y, m, d] = dateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate - todayDate) / (1000 * 60 * 60 * 24));
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';

    return targetDate.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  // --- Local Storage Management ---
  function loadLogs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Error loading data from localStorage', e);
      return {};
    }
  }

  function saveLogs() {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(appData));
    } catch (e) {
      console.error('Error saving data to localStorage', e);
      showToast('Error saving data to browser storage', 'danger');
    }
  }

  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Error loading settings', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(userSettings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }

  function ensureDayEntry(dateStr) {
    if (!appData[dateStr]) {
      appData[dateStr] = {
        water: 0,
        meals: []
      };
    }
    if (!Array.isArray(appData[dateStr].meals)) {
      appData[dateStr].meals = [];
    }
    if (typeof appData[dateStr].water !== 'number') {
      appData[dateStr].water = 0;
    }
    return appData[dateStr];
  }

  // --- Notification Toast ---
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- UI Render Pipeline ---
  function renderAll() {
    updateDateControls();
    ensureDayEntry(currentDate);
    renderSummary();
    renderWater();
    renderMeals();
  }

  function updateDateControls() {
    datePicker.value = currentDate;
    dateDisplayLabel.textContent = getDisplayDateLabel(currentDate);
  }

  function renderSummary() {
    const day = ensureDayEntry(currentDate);
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    day.meals.forEach(item => {
      totalCalories += Number(item.calories) || 0;
      totalProtein += Number(item.protein) || 0;
      totalCarbs += Number(item.carbs) || 0;
      totalFat += Number(item.fat) || 0;
    });

    const targetCal = Number(userSettings.calorieTarget) || 2000;
    const remainingCal = targetCal - totalCalories;
    const calPercentage = Math.round((totalCalories / targetCal) * 100);

    // Calorie card numbers
    calorieTargetVal.textContent = `${targetCal.toLocaleString()} kcal`;
    calorieConsumedVal.textContent = `${totalCalories.toLocaleString()} kcal`;
    caloriePercentageVal.textContent = `${calPercentage}%`;

    // Circular Progress Ring calculation: 2 * PI * 68 ≈ 427.25
    const circumference = 427.25;
    const progressClamped = Math.min(100, Math.max(0, calPercentage));
    const offset = circumference - (progressClamped / 100) * circumference;

    calorieProgressCircle.style.strokeDashoffset = offset;

    if (remainingCal >= 0) {
      caloriesRemainingValue.textContent = remainingCal.toLocaleString();
      caloriesRemainingValue.style.color = '#ffffff';
      calorieProgressCircle.style.stroke = '#10b981';
      calorieStatusBadge.textContent = 'On Track';
      calorieStatusBadge.className = 'sub-badge';
    } else {
      const overBy = Math.abs(remainingCal);
      caloriesRemainingValue.textContent = `+${overBy.toLocaleString()}`;
      caloriesRemainingValue.style.color = '#ef4444';
      calorieProgressCircle.style.stroke = '#ef4444';
      calorieStatusBadge.textContent = `Over by ${overBy.toLocaleString()} kcal`;
      calorieStatusBadge.className = 'sub-badge status-warning';
    }

    // Macro Cards
    const targetP = Number(userSettings.proteinTarget) || 140;
    const targetC = Number(userSettings.carbsTarget) || 220;
    const targetF = Number(userSettings.fatTarget) || 65;

    const roundP = Math.round(totalProtein * 10) / 10;
    const roundC = Math.round(totalCarbs * 10) / 10;
    const roundF = Math.round(totalFat * 10) / 10;

    const percentP = Math.round((roundP / targetP) * 100);
    const percentC = Math.round((roundC / targetC) * 100);
    const percentF = Math.round((roundF / targetF) * 100);

    proteinConsumedVal.textContent = `${roundP}g`;
    proteinTargetVal.textContent = `${targetP}g`;
    proteinProgressBar.style.width = `${Math.min(100, percentP)}%`;
    proteinPercentageVal.textContent = `${percentP}%`;

    carbsConsumedVal.textContent = `${roundC}g`;
    carbsTargetVal.textContent = `${targetC}g`;
    carbsProgressBar.style.width = `${Math.min(100, percentC)}%`;
    carbsPercentageVal.textContent = `${percentC}%`;

    fatConsumedVal.textContent = `${roundF}g`;
    fatTargetVal.textContent = `${targetF}g`;
    fatProgressBar.style.width = `${Math.min(100, percentF)}%`;
    fatPercentageVal.textContent = `${percentF}%`;
  }

  function renderWater() {
    const day = ensureDayEntry(currentDate);
    const currentWater = day.water || 0;
    const targetWater = Number(userSettings.waterTarget) || 2500;
    const percent = Math.min(100, Math.round((currentWater / targetWater) * 100));

    waterConsumedVal.textContent = currentWater.toLocaleString();
    waterTargetVal.textContent = targetWater.toLocaleString();
    waterProgressPercent.textContent = `${percent}%`;

    // Render 10 interactive cups representing 10% each (or increments of 250ml)
    waterCupsContainer.innerHTML = '';
    const totalCups = 10;
    const waterPerCup = targetWater / totalCups;

    for (let i = 1; i <= totalCups; i++) {
      const isFilled = currentWater >= i * waterPerCup;
      const cup = document.createElement('div');
      cup.className = `water-cup-icon ${isFilled ? 'filled' : ''}`;
      cup.title = `${Math.round(i * waterPerCup)} ml`;
      cup.innerHTML = `
        <svg viewBox="0 0 24 24" fill="${isFilled ? '#06b6d4' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      `;

      // Click cup to jump to that amount
      cup.addEventListener('click', () => {
        setWaterAmount(Math.round(i * waterPerCup));
      });

      waterCupsContainer.appendChild(cup);
    }
  }

  function setWaterAmount(amount) {
    const day = ensureDayEntry(currentDate);
    day.water = Math.max(0, amount);
    saveLogs();
    renderWater();
  }

  function addWater(amount) {
    const day = ensureDayEntry(currentDate);
    day.water = Math.max(0, (day.water || 0) + amount);
    saveLogs();
    renderWater();
    showToast(`Added +${amount} ml of water!`);
  }

  function resetWater() {
    const day = ensureDayEntry(currentDate);
    day.water = 0;
    saveLogs();
    renderWater();
    showToast('Water intake reset.');
  }

  function renderMeals() {
    const day = ensureDayEntry(currentDate);
    const filter = searchFilter.trim().toLowerCase();

    const categorized = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };

    day.meals.forEach(item => {
      const cat = categorized[item.category] ? item.category : 'snacks';
      if (!filter || item.name.toLowerCase().includes(filter)) {
        categorized[cat].push(item);
      }
    });

    renderMealCategory('breakfast', categorized.breakfast, breakfastItemsList, breakfastMacroSum);
    renderMealCategory('lunch', categorized.lunch, lunchItemsList, lunchMacroSum);
    renderMealCategory('dinner', categorized.dinner, dinnerItemsList, dinnerMacroSum);
    renderMealCategory('snacks', categorized.snacks, snacksItemsList, snacksMacroSum);
  }

  function renderMealCategory(catName, items, containerEl, summaryEl) {
    let totalKcal = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;

    items.forEach(item => {
      totalKcal += Number(item.calories) || 0;
      totalP += Number(item.protein) || 0;
      totalC += Number(item.carbs) || 0;
      totalF += Number(item.fat) || 0;
    });

    summaryEl.textContent = `${totalKcal.toLocaleString()} kcal | P: ${Math.round(totalP)}g • C: ${Math.round(totalC)}g • F: ${Math.round(totalF)}g`;

    containerEl.innerHTML = '';

    if (items.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'meal-empty-state';
      emptyDiv.innerHTML = `
        <span>No foods logged for ${catName} yet</span>
        <button class="empty-state-btn" onclick="app.openAddFoodModal('${catName}')">+ Log something</button>
      `;
      containerEl.appendChild(emptyDiv);
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'meal-item-card';

      const portionHtml = item.serving ? `<span class="portion-text">${escapeHtml(item.serving)}</span>` : '';

      const macrosHtml = (item.protein > 0 || item.carbs > 0 || item.fat > 0)
        ? `
          <div class="macro-tag-group">
            ${item.protein ? `<span class="macro-tag tag-protein">${item.protein}g P</span>` : ''}
            ${item.carbs ? `<span class="macro-tag tag-carbs">${item.carbs}g C</span>` : ''}
            ${item.fat ? `<span class="macro-tag tag-fat">${item.fat}g F</span>` : ''}
          </div>
        `
        : '';

      card.innerHTML = `
        <div class="meal-item-left">
          <div class="meal-item-name">${escapeHtml(item.name)}</div>
          <div class="meal-item-sub">
            ${portionHtml}
            ${macrosHtml}
          </div>
        </div>
        <div class="meal-item-right">
          <span class="meal-item-calories">${Number(item.calories).toLocaleString()} kcal</span>
          <div class="meal-item-actions">
            <button class="action-icon-btn" title="Edit" onclick="app.openEditFoodModal('${item.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="action-icon-btn delete-btn" title="Delete" onclick="app.deleteFoodItem('${item.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;

      containerEl.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Food Modal Operations ---
  function openAddFoodModal(category = 'breakfast') {
    foodForm.reset();
    foodEditId.value = '';
    mealCategorySelect.value = category;
    foodModalTitle.textContent = `Log Food to ${capitalize(category)}`;
    saveFoodBtnText.textContent = 'Add to Log';
    renderPresets(category);
    foodModalOverlay.classList.add('open');
    setTimeout(() => foodNameInput.focus(), 50);
  }

  function openEditFoodModal(id) {
    const day = ensureDayEntry(currentDate);
    const item = day.meals.find(m => m.id === id);
    if (!item) return;

    foodEditId.value = item.id;
    foodNameInput.value = item.name;
    mealCategorySelect.value = item.category || 'breakfast';
    foodCaloriesInput.value = item.calories;
    foodServingInput.value = item.serving || '';
    foodProteinInput.value = item.protein !== undefined ? item.protein : '';
    foodCarbsInput.value = item.carbs !== undefined ? item.carbs : '';
    foodFatInput.value = item.fat !== undefined ? item.fat : '';

    foodModalTitle.textContent = 'Edit Food Item';
    saveFoodBtnText.textContent = 'Save Changes';
    renderPresets(item.category || 'breakfast');
    foodModalOverlay.classList.add('open');
  }

  function closeFoodModal() {
    foodModalOverlay.classList.remove('open');
  }

  function renderPresets(preferredCategory) {
    presetsContainer.innerHTML = '';
    // Sort so preferred category presets come first
    const sortedPresets = [...FOOD_PRESETS].sort((a, b) => {
      if (a.cat === preferredCategory && b.cat !== preferredCategory) return -1;
      if (b.cat === preferredCategory && a.cat !== preferredCategory) return 1;
      return 0;
    });

    sortedPresets.forEach(preset => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'preset-chip';
      chip.innerHTML = `<span>${preset.name}</span> <span class="preset-kcal">${preset.cal} kcal</span>`;
      chip.addEventListener('click', () => {
        foodNameInput.value = preset.name;
        foodCaloriesInput.value = preset.cal;
        foodProteinInput.value = preset.p;
        foodCarbsInput.value = preset.c;
        foodFatInput.value = preset.f;
        foodServingInput.value = preset.serving;
        if (preset.cat) {
          mealCategorySelect.value = preset.cat;
        }
      });
      presetsContainer.appendChild(chip);
    });
  }

  function handleFoodSubmit(e) {
    e.preventDefault();
    const name = foodNameInput.value.trim();
    const calories = Number(foodCaloriesInput.value);
    const category = mealCategorySelect.value;
    const serving = foodServingInput.value.trim();
    const protein = foodProteinInput.value !== '' ? Number(foodProteinInput.value) : 0;
    const carbs = foodCarbsInput.value !== '' ? Number(foodCarbsInput.value) : 0;
    const fat = foodFatInput.value !== '' ? Number(foodFatInput.value) : 0;

    if (!name || isNaN(calories) || calories < 0) {
      showToast('Please provide a valid name and calorie count', 'danger');
      return;
    }

    const day = ensureDayEntry(currentDate);
    const editId = foodEditId.value;

    if (editId) {
      // Editing existing item
      const index = day.meals.findIndex(m => m.id === editId);
      if (index !== -1) {
        day.meals[index] = {
          ...day.meals[index],
          name,
          category,
          calories,
          serving,
          protein,
          carbs,
          fat
        };
        showToast(`Updated "${name}"`);
      }
    } else {
      // Adding new item
      const newItem = {
        id: 'meal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name,
        category,
        calories,
        serving,
        protein,
        carbs,
        fat,
        createdAt: new Date().toISOString()
      };
      day.meals.unshift(newItem);
      showToast(`Added "${name}" (${calories} kcal)`);
    }

    saveLogs();
    renderAll();
    closeFoodModal();
  }

  function deleteFoodItem(id) {
    const day = ensureDayEntry(currentDate);
    const item = day.meals.find(m => m.id === id);
    const itemName = item ? item.name : 'item';

    day.meals = day.meals.filter(m => m.id !== id);
    saveLogs();
    renderAll();
    showToast(`Removed "${itemName}"`, 'info');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // --- Settings & Goals Modal ---
  function openSettingsModal() {
    settingCaloriesInput.value = userSettings.calorieTarget;
    settingWaterInput.value = userSettings.waterTarget;
    settingProteinInput.value = userSettings.proteinTarget;
    settingCarbsInput.value = userSettings.carbsTarget;
    settingFatInput.value = userSettings.fatTarget;

    switchSettingsTab('targets');
    calculateTDEE();
    settingsModalOverlay.classList.add('open');
  }

  function closeSettingsModal() {
    settingsModalOverlay.classList.remove('open');
  }

  function switchSettingsTab(tabName) {
    document.querySelectorAll('.settings-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.modal-card .tab-content').forEach(tab => tab.classList.remove('active'));

    if (tabName === 'targets') {
      document.getElementById('tabTargetsBtn').classList.add('active');
      document.getElementById('tabContentTargets').classList.add('active');
    } else if (tabName === 'calculator') {
      document.getElementById('tabCalculatorBtn').classList.add('active');
      document.getElementById('tabContentCalculator').classList.add('active');
      calculateTDEE();
    } else if (tabName === 'backup') {
      document.getElementById('tabBackupBtn').classList.add('active');
      document.getElementById('tabContentBackup').classList.add('active');
    }
  }

  function handleSettingsSubmit(e) {
    e.preventDefault();
    userSettings.calorieTarget = Math.max(500, Number(settingCaloriesInput.value) || 2000);
    userSettings.waterTarget = Math.max(500, Number(settingWaterInput.value) || 2500);
    userSettings.proteinTarget = Math.max(0, Number(settingProteinInput.value) || 140);
    userSettings.carbsTarget = Math.max(0, Number(settingCarbsInput.value) || 220);
    userSettings.fatTarget = Math.max(0, Number(settingFatInput.value) || 65);

    saveSettings();
    renderAll();
    closeSettingsModal();
    showToast('Daily goals and targets saved!');
  }

  // --- TDEE Calculator Formula (Mifflin-St Jeor) ---
  function calculateTDEE() {
    const gender = calcGender.value;
    const age = Number(calcAge.value) || 25;
    const weightKg = Number(calcWeight.value) || 70;
    const heightCm = Number(calcHeight.value) || 170;
    const activityMult = Number(calcActivity.value) || 1.375;
    const goalOffset = Number(calcGoal.value) || 0;

    // BMR formula
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = Math.round(bmr * activityMult);
    const targetCalories = Math.max(1200, Math.round(tdee + goalOffset));

    calcRecommendedCalories.textContent = targetCalories.toLocaleString();

    // Suggested Macro Split: 30% Protein, 45% Carbs, 25% Fat
    // 1g Protein = 4 kcal, 1g Carb = 4 kcal, 1g Fat = 9 kcal
    const proteinGrams = Math.round((targetCalories * 0.30) / 4);
    const carbsGrams = Math.round((targetCalories * 0.45) / 4);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);

    calcMacroSplit.textContent = `P: ${proteinGrams}g | C: ${carbsGrams}g | F: ${fatGrams}g`;

    return {
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams
    };
  }

  function applyCalculatedTargets() {
    const calc = calculateTDEE();
    userSettings.calorieTarget = calc.calories;
    userSettings.proteinTarget = calc.protein;
    userSettings.carbsTarget = calc.carbs;
    userSettings.fatTarget = calc.fat;

    saveSettings();
    renderAll();
    closeSettingsModal();
    showToast(`Applied ${calc.calories} kcal goal to your daily targets!`);
  }

  // --- 7-Day Trends Modal ---
  function openTrendsModal() {
    renderTrendsChart();
    trendsModalOverlay.classList.add('open');
  }

  function closeTrendsModal() {
    trendsModalOverlay.classList.remove('open');
  }

  function renderTrendsChart() {
    chartBarsContainer.innerHTML = '';

    // Collect previous 7 days up to currentDate
    const [y, m, d] = currentDate.split('-').map(Number);
    const baseDate = new Date(y, m - 1, d);

    const days = [];
    let totalCalsSum = 0;
    let daysWithLogs = 0;
    let totalWaterSum = 0;

    for (let i = 6; i >= 0; i--) {
      const dt = new Date(baseDate);
      dt.setDate(baseDate.getDate() - i);
      const dateKey = formatDateKey(dt);
      const dayData = appData[dateKey];

      let dayCals = 0;
      let dayWater = 0;

      if (dayData) {
        if (Array.isArray(dayData.meals)) {
          dayData.meals.forEach(item => {
            dayCals += Number(item.calories) || 0;
          });
        }
        dayWater = dayData.water || 0;
      }

      if (dayCals > 0 || dayWater > 0) {
        daysWithLogs++;
      }

      totalCalsSum += dayCals;
      totalWaterSum += dayWater;

      days.push({
        dateKey,
        label: dt.toLocaleDateString(undefined, { weekday: 'narrow' }),
        calories: dayCals,
        water: dayWater
      });
    }

    const avgCals = Math.round(totalCalsSum / 7);
    const avgWater = Math.round(totalWaterSum / 7);

    trendAvgCalories.textContent = `${avgCals.toLocaleString()} kcal`;
    trendDaysLogged.textContent = `${daysWithLogs} / 7`;
    trendAvgWater.textContent = `${avgWater.toLocaleString()} ml`;

    const targetCal = Number(userSettings.calorieTarget) || 2000;
    // Determine scale max
    const maxValFound = Math.max(...days.map(d => d.calories), targetCal);
    const yAxisMax = Math.ceil((maxValFound * 1.15) / 500) * 500;

    chartYMax.textContent = yAxisMax.toLocaleString();
    chartYMid.textContent = Math.round(yAxisMax / 2).toLocaleString();

    days.forEach(day => {
      const col = document.createElement('div');
      col.className = 'chart-day-col';

      const barHeightPercent = Math.min(100, Math.max(3, (day.calories / yAxisMax) * 100));
      const isOver = day.calories > targetCal;

      col.innerHTML = `
        <div class="chart-bar-outer">
          <div class="chart-bar-tooltip">${day.calories.toLocaleString()} kcal</div>
          <div class="chart-bar-fill ${isOver ? 'over-target' : ''}" style="height: ${barHeightPercent}%"></div>
        </div>
        <span class="chart-day-label">${day.label}</span>
      `;

      // Click bar to jump to that day
      col.addEventListener('click', () => {
        currentDate = day.dateKey;
        renderAll();
        closeTrendsModal();
        showToast(`Switched to ${day.dateKey}`);
      });

      chartBarsContainer.appendChild(col);
    });
  }

  // --- Backup, Export & Clear Operations ---
  function exportData() {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: userSettings,
      logs: appData
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calotrack-backup-${currentDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded!');
  }

  function triggerImport() {
    importFileInput.value = '';
    importFileInput.click();
  }

  function handleFileImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.logs && typeof parsed.logs === 'object') {
          appData = parsed.logs;
          saveLogs();
          if (parsed.settings && typeof parsed.settings === 'object') {
            userSettings = { ...DEFAULT_SETTINGS, ...parsed.settings };
            saveSettings();
          }
          renderAll();
          closeSettingsModal();
          showToast('Data imported successfully!');
        } else {
          showToast('Invalid backup file format.', 'danger');
        }
      } catch (err) {
        showToast('Error reading backup file: Invalid JSON.', 'danger');
      }
    };
    reader.readAsText(file);
  }

  function clearCurrentDay() {
    if (confirm(`Are you sure you want to clear all logged food and water for ${getDisplayDateLabel(currentDate)}?`)) {
      appData[currentDate] = {
        water: 0,
        meals: []
      };
      saveLogs();
      renderAll();
      closeSettingsModal();
      showToast(`Cleared log for ${getDisplayDateLabel(currentDate)}`);
    }
  }

  function clearAllData() {
    if (confirm('WARNING: This will permanently delete ALL logged history, food items, and custom goals. Proceed?')) {
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      appData = {};
      userSettings = { ...DEFAULT_SETTINGS };
      renderAll();
      closeSettingsModal();
      showToast('All stored data has been erased.');
    }
  }

  // --- Date Navigation ---
  function changeDateByOffset(offsetDays) {
    const [y, m, d] = currentDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + offsetDays);
    currentDate = formatDateKey(dateObj);
    renderAll();
  }

  function setDate(dateStr) {
    if (!dateStr) return;
    currentDate = dateStr;
    renderAll();
  }

  // --- Attach Event Listeners ---
  function initEvents() {
    // Date Nav
    prevDayBtn.addEventListener('click', () => changeDateByOffset(-1));
    nextDayBtn.addEventListener('click', () => changeDateByOffset(1));
    todayBtn.addEventListener('click', () => {
      currentDate = getTodayDateString();
      renderAll();
    });
    datePicker.addEventListener('change', (e) => setDate(e.target.value));

    // Water Controls
    addWater250Btn.addEventListener('click', () => addWater(250));
    addWater500Btn.addEventListener('click', () => addWater(500));
    resetWaterBtn.addEventListener('click', resetWater);

    // Global Add Food Button
    quickAddGlobalBtn.addEventListener('click', () => openAddFoodModal('lunch'));

    // Search
    foodSearchInput.addEventListener('input', (e) => {
      searchFilter = e.target.value;
      renderMeals();
    });

    // Food Modal Events
    closeFoodModalBtn.addEventListener('click', closeFoodModal);
    cancelFoodModalBtn.addEventListener('click', closeFoodModal);
    foodForm.addEventListener('submit', handleFoodSubmit);
    foodModalOverlay.addEventListener('click', (e) => {
      if (e.target === foodModalOverlay) closeFoodModal();
    });

    // Settings Modal Events
    openSettingsBtn.addEventListener('click', openSettingsModal);
    closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
    cancelSettingsBtn.addEventListener('click', closeSettingsModal);
    settingsForm.addEventListener('submit', handleSettingsSubmit);
    settingsModalOverlay.addEventListener('click', (e) => {
      if (e.target === settingsModalOverlay) closeSettingsModal();
    });

    // TDEE Calculator Live Change
    [calcGender, calcAge, calcWeight, calcHeight, calcActivity, calcGoal].forEach(elem => {
      elem.addEventListener('change', calculateTDEE);
      elem.addEventListener('input', calculateTDEE);
    });
    applyCalcBtn.addEventListener('click', applyCalculatedTargets);

    // Trends Modal Events
    openTrendsBtn.addEventListener('click', openTrendsModal);
    closeTrendsModalBtn.addEventListener('click', closeTrendsModal);
    trendsModalOverlay.addEventListener('click', (e) => {
      if (e.target === trendsModalOverlay) closeTrendsModal();
    });

    // Backup & Restore
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', triggerImport);
    importFileInput.addEventListener('change', handleFileImport);
    clearDayBtn.addEventListener('click', clearCurrentDay);
    clearAllBtn.addEventListener('click', clearAllData);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeFoodModal();
        closeSettingsModal();
        closeTrendsModal();
      }
    });
  }

  // Initial Seed Data for first-time user (so the app doesn't look completely empty on launch)
  function seedInitialDemoDataIfEmpty() {
    if (Object.keys(appData).length === 0) {
      const today = getTodayDateString();
      appData[today] = {
        water: 1250,
        meals: [
          {
            id: 'meal_init_1',
            name: 'Oatmeal & Fresh Berries',
            category: 'breakfast',
            calories: 320,
            serving: '1 bowl',
            protein: 11,
            carbs: 54,
            fat: 6,
            createdAt: new Date().toISOString()
          },
          {
            id: 'meal_init_2',
            name: 'Grilled Chicken & White Rice',
            category: 'lunch',
            calories: 520,
            serving: '200g chicken + rice',
            protein: 48,
            carbs: 55,
            fat: 9,
            createdAt: new Date().toISOString()
          },
          {
            id: 'meal_init_3',
            name: 'Whey Protein Shake',
            category: 'snacks',
            calories: 130,
            serving: '1 scoop with water',
            protein: 25,
            carbs: 3,
            fat: 2,
            createdAt: new Date().toISOString()
          }
        ]
      };
      saveLogs();
    }
  }

  // Expose global methods for inline handlers
  window.app = {
    openAddFoodModal,
    openEditFoodModal,
    deleteFoodItem,
    switchSettingsTab
  };

  // --- Bootstrap ---
  seedInitialDemoDataIfEmpty();
  initEvents();
  renderAll();

})();

