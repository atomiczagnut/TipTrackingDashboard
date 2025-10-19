// ===============
// Imports
// ===============
import { supabase } from './db/supabase.js';
import { checkAuth, signInWithGoogle, signOut } from './auth.js';

// =================
// Global Variables
// =================
let chartInstance = null; // Store the current chart.js instance
let currentUserId = null; // Store the logged-in user's ID

// ====================
// Main Initialization
// ====================
document.addEventListener("DOMContentLoaded", async function () {
    await initializeAuth();
});
    
// ====================
// Authentication
// ==================== 
async function initializeAuth() {
    const user = await checkAuth();

    const loggedInSection = document.getElementById("logged-in");
    const loggedOutSection = document.getElementById("logged-out");
    const userEmailSpan = document.getElementById("user-email");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (user) {
        // User is logged in
        currentUserId = user.id;
        loggedInSection.style.display = "block";
        loggedOutSection.style.display = "none";
        userEmailSpan.textContent = user.email;

        // Initialize the dashboard
        await initializeApp();

    } else {
        // User is not logged in
        loggedInSection.style.display = "none";
        loggedOutSection.style.display = "block"; 
    }

    // Setup up auth button handlers
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", signInWithGoogle);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", signOut);
    }
}

// ====================
// App Initialization
// ====================
async function initializeApp() {
    try {
        // Fetch data from Supabase
        const { data, error } = await supabase
        .from("tips")
        .select("*")
        .eq("user_id", currentUserId)
        .order("date", { ascending: true });

        if (error) {
            console.error("Error fetching data:", error);
            showError("Failed to fetch data");
            return;
        }

        // Handle case where no data is returned
        if (!data || data.length === 0) {
            showError("No data avaliable.  Add your first shift!");
            return;
        }

        // Initialize filters and dashboard content
        setupFilters(data);
        initializeDashboard(data);

        // Set up event handlers
        setupEventHandlers(data);

    } catch (err) {
        console.error("Unexpected error:", err);
        showError("An unexpected error occured");
    }
}     

// ===========================
// Event Handlers
// ===========================
function setupEventHandlers(data) {
    // Chart type selector
    const chartSelector = document.getElementById("chart-type-selector");
    if (chartSelector) {
        chartSelector.onchange = () => filterAndRenderData(data);
    }

    // Input shift button to open modal
    const saveShiftBtn = document.getElementById("save-shift-btn");
    if (saveShiftBtn) {
        saveShiftBtn.addEventListener("click", () => handleSaveShift(data));
    }
}    

// Input Shift button functionality
async function handleSaveShift(data) {
    // Get form values
    const date = document.getElementById("shift-date").value;
    const dayOfWeek = document.getElementById("shift-day").value;
    const amOrPm = document.getElementById("shift-period").value;
    const hoursWorked = parseFloat(document.getElementById("shift-hours").value);
    const tipsEarned = parseFloat(document.getElementById("shift-tips").value);

    // Validate
    if (!date || !dayOfWeek || !amOrPm || !hoursWorked || !tipsEarned) {
        alert("Please fill out all fields");
        return;
    }

    // Insert into Supabase
    const { data: newData, error } = await supabase
        .from("tips")
        .insert([{
            user_id: CURRENT_USER_ID,
            date: date,
            day_of_week: dayOfWeek,
            am_or_pm: amOrPm,
            hours_worked: hoursWorked,
            tips_earned: tipsEarned
        }])
        .select();

    if (error) {
        console.error("Error saving shift:", error);
        alert("Failed to save shift: " + error.message);
        return;
    }

    console.log("Shift saved succesfully:", data);
    alert("Shift saved successfully!");

    // Close modal
    $("#shiftModal").modal("hide");

    // Clear form
    document.getElementById("shift-form").reset();

    // Refresh the page to show new data
    window.location.reload();
}

// =======================
// Filter Setup
// =======================

// Initlialize Flatpickr date pickers and category filter
function setupFilters(data) {
    // Convert date strings to JS Date objects
    const dates = data.map((item) => new Date(item.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Configure start date picker
    flatpickr("#start-date", {
        defaultDate: minDate.toISOString().slice(0, 10),
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        onChange: function () {
            filterAndRenderData(data);
        },
    });

    // Configure end date picker
    flatpickr("#end-date", {
        defaultDate: maxDate.toISOString().slice(0, 10),
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        onChange: function () {
            filterAndRenderData(data);
        },
    });

    // Set up category dropdown change listener
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
        categoryFilter.onchange = () => filterAndRenderData(data);
    }
}

// =====================
// Initialize Dashboard
// =====================
function initializeDashboard(data) {
    populateCategoryFilter(data); // Populate category dropdown
    filterAndRenderData(data); // Initial render with all data
}

// =============================
// Data Filtering and Rendering
// =============================
function filterAndRenderData(data) {
    const chartType = document.getElementById('chart-type-selector').value;
    const startDate = document.getElementById('start-date')._flatpickr.selectedDates[0];
    const endDate = document.getElementById('end-date')._flatpickr.selectedDates[0];
    const selectedCategory = document.getElementById('category-filter').value; // Reserved for future functionality

    // Filter date by date range
    const filteredData = data.filter((item) =>  {
        // Parse date as local date, not UTC
        const [year, month, day] = item.date.split('-');
        const itemDate = new Date(year, month - 1, day); // month is 0-indexed
        return (
            itemDate >= startDate &&
            itemDate <= endDate
            //(selectedCategory === 'all' || item.categories === selectedCategory)
        );
    });

    updateKeyMetrics(filteredData); // Update metrics like Total Tips and Average Tips
    drawChart(filteredData, 'chart-canvas', chartType); // Render chart
    populateDataTable(filteredData); // Update table
}

// ======================
// Key Metrics
// ======================
function updateKeyMetrics(data) {
    const totalTips = data.reduce((acc, item) => acc + parseFloat(item.tips_earned), 0);
    const averageTips = totalTips / data.length;

    // Display metrics in the DOM
    document.getElementById("total-tips").textContent = `$${totalTips.toFixed(2)}`;
    document.getElementById("average-tips").textContent = `$${averageTips.toFixed(2)}`;
}

// =======================
// Chart Rendering
// =======================
// Uses Chart.js
function drawChart(data, elementId, chartType) {
    const ctx = document.getElementById(elementId).getContext('2d');

    // Destroy previous chart if one exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    switch (chartType) {
        case "tipsOverTime":
            chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => item.date),
                    datasets: [{
                        label: "Tips Over Time",
                        data: data.map((item) => parseFloat(item.tips_earned)),
                        fill: false,
                        borderColor: "rgb(0, 255, 65)",
                        tension: 0.1,
                    }],
                },
                options: {
                    scales: {
                        y: { beginAtZero: true},
                    },
                },
            });
            break;
    }
}

// ======================
// Data Table
//=======================
function populateDataTable(data) {
    const tableElement = $("#data-table");

    // Destroy existing table if it exists
    if ($.fn.DataTable.isDataTable(tableElement)) {
        tableElement.DataTable().clear().destroy();
    }

    // Create a new DataTable with relevant columns
    tableElement.DataTable({
        data: data.map((item) => [
            item.date,
            item.day_of_week,
            item.am_or_pm,
            item.hours_worked,
            item.tips_earned,
        ]),
        columns: [
            { title: "Date" },
            { title: "Day" },
            { title: "AM or PM" },
            { title: "Hours Worked" },
            { title: "Tips Earned" },
        ],
    });
}

// =================
// Category Filter
// =================
function populateCategoryFilter(data) {
    const categoryFilter = document.getElementById("category-filter");
    categoryFilter.innerHTML = '';
    categoryFilter.appendChild(new Option("All Categories", "all", true, true));

    // Placeholder for future category functionality
    // const categories = new Set(data.map((item) => item.categories));
    // categories.forEach((category) => {
    //    categoryFilter.appendChild(new Option(category, category));
    // });
}

// ===================
// Utility Functions
// ===================
function showError(msg) {
    const app = document.getElementById("app");
    if (app) {
        app.innerHTML = `<p> class="text-center">${msg}</p>`;
    }
}
